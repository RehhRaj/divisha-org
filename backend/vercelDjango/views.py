"""Divisha Business OS V1: platform, demos, tenant-business sites and custom domains."""
import re
from urllib.parse import urlsplit
from django.http import JsonResponse

from django.views.decorators.http import require_safe

from .sample_content import sample_content
from .site_registry import (
    BASE_DOMAIN, BUSINESS_SITE_RECORDS, BUSINESS_TYPES, CUSTOM_DOMAINS,
    RESERVED_TENANT_SLUGS, TEMPLATE_VARIANTS, TENANTS,
)
from .tenant_catalogs import TENANT_CATALOGS
from .workflows import DEMOS


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


PUBLIC_CONTENT_FIELDS = (
    "currency", "theme", "content", "sections", "contact", "navigation", "items", "seo", "faqs",
)


def page_error(message, status=404):
    return JsonResponse({"error": message}, status=status)


def business_page(kind, record, *, tenant=None, variant=None):
    page_type = "tenant" if tenant else "demo"
    content = sample_content(kind, record["title"])
    selected_variant = variant or "classic"
    if tenant:
        catalog = TENANT_CATALOGS.get(f"{tenant}-{kind}")
        if catalog:
            selected_variant = catalog["template_variant"]
            content["items"] = [
                {"id": item["slug"], **item} for item in catalog["items"]
            ]

    return JsonResponse({
        "page_type": page_type,
        "business_type": kind,
        "tenant": tenant,
        "parent_tenant": None,
        "title": record["title"],
        "message": record["message"],
        "template": record.get("template", BUSINESS_TYPES[kind]["template"]),
        "template_variant": selected_variant,
        "available_variants": TEMPLATE_VARIANTS[kind] if page_type == "demo" else (),
        **{field: content[field] for field in PUBLIC_CONTENT_FIELDS},
    })


def render_demo(kind, variant):
    if kind not in BUSINESS_TYPES or (variant is not None and variant not in TEMPLATE_VARIANTS[kind]):
        return page_error("Demo or variant not found")
    return business_page(kind, BUSINESS_TYPES[kind], variant=variant)


def render_business(key, variant):
    if variant is not None:
        return page_error("Template previews are only available on demos")
    tenant, kind = key
    return business_page(kind, BUSINESS_SITES[key], tenant=tenant)


@require_safe
def health(request):
    return JsonResponse({"status": "ok"})


@require_safe
def page_data(request):
    host = normalize_host(request.GET.get("host", ""))
    if not host:
        return page_error("Invalid hostname", 400)

    showcase = request.GET.get("showcase")
    workflow = request.GET.get("demo")
    variant = request.GET.get("variant")
    platform = host in {BASE_DOMAIN, f"www.{BASE_DOMAIN}"}
    if showcase is not None or workflow is not None:
        if not platform:
            return page_error("Platform demo not found")
        if workflow is not None:
            if showcase is not None or variant is not None or workflow not in DEMOS:
                return page_error("Workflow not found")
            return JsonResponse(DEMOS[workflow])
        return render_demo(showcase, variant)

    if platform:
        if variant is not None:
            return page_error("Select a business demo before previewing a template")
        return JsonResponse({
            "page_type": "platform", "business_type": None, "tenant": None,
            "parent_tenant": None, "title": "Welcome to Divisha",
            "message": "Divisha Business OS Platform", "template": "platform",
        })

    if host in CUSTOM_DOMAIN_INDEX:
        return render_business(CUSTOM_DOMAIN_INDEX[host], variant)

    suffix = "." + BASE_DOMAIN
    if not host.endswith(suffix):
        return page_error("Unknown domain")
    slug = host.removesuffix(suffix)
    if not slug or "." in slug:
        return page_error("Invalid domain structure")
    if slug in BUSINESS_TYPES:
        return render_demo(slug, variant)
    for kind in sorted(BUSINESS_TYPES, key=len, reverse=True):
        ending = "-" + kind
        if slug.endswith(ending):
            key = (slug[:-len(ending)], kind)
            if key in BUSINESS_SITES:
                return render_business(key, variant)
    return page_error("Website not found")
