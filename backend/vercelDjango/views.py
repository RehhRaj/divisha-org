"""Divisha Business OS V1: platform, demos, tenant-business sites and custom domains."""
import re
from urllib.parse import urlsplit
from django.http import JsonResponse

BASE_DOMAIN = "divisha.org"
BUSINESS_TYPES = {
    "tour": {"title": "Tour Business Demo", "message": "Welcome to Tour Business Demo", "template": "tour"},
    "restau": {"title": "Restaurant Business Demo", "message": "Welcome to Restaurant Demo", "template": "restaurant"},
    "society": {"title": "Society Business Demo", "message": "Welcome to Society Demo", "template": "society"},
    "edu": {"title": "Education & School Demo", "message": "Welcome to School Management Demo", "template": "education"},
    "salon": {"title": "Beauty & Salon Demo", "message": "Welcome to Beauty & Care Salon Demo", "template": "salon"},
}
RESERVED_TENANT_SLUGS = {"www", "api", "admin", "app", "dashboard", "login", "register", "support"} | set(BUSINESS_TYPES)
TENANTS = {
    "jeetu": "Jeetu",
    "teal": "Teal",
    "abc": "ABC",
    "apexacademy": "Apex International Academy",
    "glamhub": "Glam Hub",
}
# List of records makes duplicate composite keys detectable before indexing.
BUSINESS_SITE_RECORDS = [
    {"tenant": "jeetu", "business_type": "tour", "title": "Jeetu Tour Business", "message": "Welcome to Jeetu Tour Website"},
    {"tenant": "jeetu", "business_type": "restau", "title": "Jeetu Da Dhaba & Restaurant", "message": "Welcome to Jeetu Fine Dine Restaurant"},
    {"tenant": "jeetu", "business_type": "salon", "title": "Jeetu Gents Salon", "message": "Welcome to Jeetu Grooming Station"},
    {"tenant": "teal", "business_type": "restau", "title": "Teal Restaurant", "message": "Welcome to Teal Restaurant"},
    {"tenant": "abc", "business_type": "society", "title": "ABC Co-operative Society", "message": "Welcome to ABC Residential Society Portal"},
    {"tenant": "abc", "business_type": "tour", "title": "ABC Tour & Travels", "message": "Welcome to ABC Tour Website"},
    {"tenant": "abc", "business_type": "restau", "title": "ABC Multi-Cuisine Restaurant", "message": "Welcome to ABC Restaurant Website"},
    {"tenant": "apexacademy", "business_type": "edu", "title": "Apex International Academy", "message": "Welcome to Apex Academy Portal"},
    {"tenant": "apexacademy", "business_type": "tour", "title": "Apex Educational Tours", "message": "Welcome to Apex Academy Study Tours & Travels"},
    {"tenant": "glamhub", "business_type": "salon", "title": "Glam Hub Luxury Salon", "message": "Welcome to Glam Hub Styling Studio"},
]
# Examples only: add a custom domain after verifying ownership and configuring Vercel DNS/TLS.
CUSTOM_DOMAINS = {}


def validate_tenant_slug(slug):
    if not isinstance(slug, str) or not re.fullmatch(r"[a-z][a-z0-9]{0,39}", slug):
        raise ValueError(f"Invalid tenant slug: {slug!r}; use 1-40 lowercase letters/digits, starting with a letter")
    if slug in RESERVED_TENANT_SLUGS:
        raise ValueError(f"Reserved tenant slug: {slug}")
    return slug


def normalize_host(raw_host):
    if not isinstance(raw_host, str) or not raw_host or len(raw_host) > 253:
        return None
    raw_host = raw_host.strip().lower()
    try:
        parsed = urlsplit("//" + raw_host)
        host = parsed.hostname
        _ = parsed.port
    except ValueError:
        return None
    if not host or parsed.username is not None or parsed.password is not None or parsed.path or parsed.query or parsed.fragment:
        return None
    host = host.rstrip(".")
    if host in {"localhost", "127.0.0.1"}:
        host = BASE_DOMAIN
    elif host.endswith(".localhost"):
        host = host[:-len(".localhost")] + "." + BASE_DOMAIN
    if len(host) > 253 or any(not re.fullmatch(r"[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?", label) for label in host.split(".")):
        return None
    return host


def build_registry():
    for slug in TENANTS:
        validate_tenant_slug(slug)
    sites = {}
    hosts = {BASE_DOMAIN, "www." + BASE_DOMAIN}
    hosts.update(f"{type_name}.{BASE_DOMAIN}" for type_name in BUSINESS_TYPES)
    for record in BUSINESS_SITE_RECORDS:
        tenant, kind = record["tenant"], record["business_type"]
        if tenant not in TENANTS or kind not in BUSINESS_TYPES:
            raise ValueError(f"Unknown tenant or business type: {(tenant, kind)}")
        key = (tenant, kind)
        if key in sites:
            raise ValueError(f"Duplicate business composite key: {key}")
        hostname = f"{tenant}-{kind}.{BASE_DOMAIN}"
        if hostname in hosts:
            raise ValueError(f"Hostname collision: {hostname}")
        hosts.add(hostname)
        sites[key] = record
    custom = {}
    for raw_domain, key in CUSTOM_DOMAINS.items():
        domain = normalize_host(raw_domain)
        if domain != raw_domain or domain in hosts or domain in custom:
            raise ValueError(f"Invalid or colliding custom domain: {raw_domain}")
        if key not in sites:
            raise ValueError(f"Unknown custom-domain business: {key}")
        custom[domain] = key
    return sites, custom


BUSINESS_SITES, CUSTOM_DOMAIN_INDEX = build_registry()


def make_page(page_type, business_type=None, tenant=None, title="", message="", template=None, parent_tenant=None):
    return JsonResponse({
        "page_type": page_type, "business_type": business_type,
        "tenant": tenant, "parent_tenant": parent_tenant,
        "title": title, "message": message, "template": template,
    })


def page_error(message, status=404):
    return JsonResponse({"error": message}, status=status)


def render_business(key):
    record = BUSINESS_SITES[key]
    tenant, kind = key
    return make_page(
        page_type="tenant", business_type=kind, tenant=tenant,
        title=record["title"], message=record["message"],
        template=record.get("template", BUSINESS_TYPES[kind]["template"]),
    )


def page_data(request):
    host = normalize_host(request.GET.get("host", ""))
    if not host:
        return page_error("Invalid hostname", 400)
    if host in {BASE_DOMAIN, "www." + BASE_DOMAIN}:
        return make_page("platform", title="Welcome to Divisha", message="Divisha Business OS Platform", template="platform")
    if host in CUSTOM_DOMAIN_INDEX:
        return render_business(CUSTOM_DOMAIN_INDEX[host])
    suffix = "." + BASE_DOMAIN
    if not host.endswith(suffix):
        return page_error("Unknown domain")
    slug = host[:-len(suffix)]
    if not slug or "." in slug:
        return page_error("Invalid domain structure")
    if slug in BUSINESS_TYPES:
        demo = BUSINESS_TYPES[slug]
        return make_page("demo", business_type=slug, title=demo["title"], message=demo["message"], template=demo["template"])
    # Parse suffixes, never split on a hyphen (business codes may contain hyphens later).
    for kind in sorted(BUSINESS_TYPES, key=len, reverse=True):
        ending = "-" + kind
        if slug.endswith(ending):
            tenant = slug[:-len(ending)]
            key = (tenant, kind)
            if key in BUSINESS_SITES:
                return render_business(key)
    return page_error("Website Not Found")