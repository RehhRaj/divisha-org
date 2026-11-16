"""Divisha Business OS V1: platform, demos, tenant-business sites and custom domains."""
import re
from urllib.parse import urlsplit
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.cache import never_cache

from .ordering import ordering_config
from .platform_landings import PLATFORM_LANDINGS
from .pos_fixtures import POS_FIXTURES

from django.views.decorators.http import require_safe

from .sample_content import sample_content
from .site_registry import (
    BASE_DOMAIN, BUSINESS_SITE_RECORDS, BUSINESS_TYPES, CUSTOM_DOMAINS,
    RESERVED_TENANT_SLUGS, TEMPLATE_VARIANTS, TENANTS,    
)

from .template_config import RESTAURANT_TEMPLATE
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


def business_page(kind, record, *, tenant=None, variant=None, table=None):
    page_type = "tenant" if tenant else "demo"
    content = sample_content(kind, record["title"])
    template_config = {}

    if kind == "restau":
        default_variant = RESTAURANT_TEMPLATE["defaultVariant"]
        selected_variant = (
            record.get("template_variant", default_variant)
            if tenant
            else variant or default_variant
        )
        design = RESTAURANT_TEMPLATE["variants"][selected_variant]
        brand_colors = record.get("brand_colors", {}) if tenant else {}

        for field, brand_key, default_color in (
            ("primary_color", "primary", design["color"]),
            ("secondary_color", "surface", design["surface"]),
        ):
            override = brand_colors.get(brand_key)
            content["theme"][field] = (
                override
                if isinstance(override, str)
                and re.fullmatch(r"#[0-9a-fA-F]{6}", override)
                else default_color
            )

        template_config = {"template_config": RESTAURANT_TEMPLATE}
    else:
        selected_variant = variant or "classic"

    if tenant:
        catalog = TENANT_CATALOGS.get(f"{tenant}-{kind}")
        if catalog:
            if kind != "restau":
                selected_variant = catalog["template_variant"]

            contact = catalog.get("contact", {})
            for field in ("phone", "address"):
                if field in contact:
                    content["contact"][field] = contact[field]

            content["items"] = [
                {"id": item["slug"], **item} for item in catalog["items"]
            ]

    return JsonResponse({
        "page_type": page_type,
        "site_id": f"{tenant}-{kind}" if tenant else None,
        "ordering": ordering_config(record, table) if tenant and kind == "restau" else None,
        "features": features(record),
        "business_type": kind,
        "tenant": tenant,
        "parent_tenant": None,
        "title": record["title"],
        "message": record["message"],
        "template": record.get("template", BUSINESS_TYPES[kind]["template"]),
        "template_variant": selected_variant,
        "available_variants": TEMPLATE_VARIANTS[kind] if page_type == "demo" else (),
        **template_config,
        **{field: content[field] for field in PUBLIC_CONTENT_FIELDS},
    })

def features(record):
    return {"website": True, "restaurant_pos": False, **record.get("features", {})}


def tenant_key_for_host(host):
    if host in CUSTOM_DOMAIN_INDEX:
        return CUSTOM_DOMAIN_INDEX[host]
    suffix = "." + BASE_DOMAIN
    if not host.endswith(suffix):
        return None
    slug = host.removesuffix(suffix)
    for kind in sorted(BUSINESS_TYPES, key=len, reverse=True):
        ending = "-" + kind
        if slug.endswith(ending):
            key = (slug[:-len(ending)], kind)
            if key in BUSINESS_SITES:
                return key
    return None


@never_cache
@require_safe
def pos_demo_config(request):
    raw_host = request.GET.get("host", "")
    local_ok = (
        settings.DEBUG
        and request.META.get("REMOTE_ADDR") in {"127.0.0.1", "::1"}
        and re.fullmatch(r"[a-z0-9-]+\.localhost(?::[0-9]+)?", raw_host)
    )
    # Hosted demo: only when DJANGO_POS_DEMO=1 and only on *.divisha.org hosts.
    hosted_ok = (
        getattr(settings, "POS_DEMO_ENABLED", False)
        and re.fullmatch(r"[a-z0-9-]+\." + re.escape(BASE_DOMAIN), raw_host)
    )
    if not (local_ok or hosted_ok):
        return page_error("POS demo unavailable")
    host = normalize_host(raw_host)
    key = tenant_key_for_host(host) if host else None
    if key not in POS_FIXTURES or not features(BUSINESS_SITES[key])["restaurant_pos"]:
        return page_error("POS demo unavailable")
    tenant, kind = key
    return JsonResponse({
        "tenant": f"{tenant}-{kind}",
        "title": BUSINESS_SITES[key]["title"],
        **POS_FIXTURES[key],
    })


def render_demo(kind, variant):
    if kind not in BUSINESS_TYPES or (variant is not None and variant not in TEMPLATE_VARIANTS[kind]):
        return page_error("Demo or variant not found")
    return business_page(kind, BUSINESS_TYPES[kind], variant=variant)


def render_business(key, variant, table=None):
    if variant is not None:
        return page_error("Template previews are only available on demos")
    tenant, kind = key
    return business_page(kind, BUSINESS_SITES[key], tenant=tenant, table=table)


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

    key = tenant_key_for_host(host)
    if key:
        return render_business(key, variant, request.GET.get("table"))
    suffix = "." + BASE_DOMAIN
    if not host.endswith(suffix):
        return page_error("Unknown domain")
    slug = host.removesuffix(suffix)
    if not slug or "." in slug:
        return page_error("Invalid domain structure")
    if slug in BUSINESS_TYPES:
        if slug in PLATFORM_LANDINGS and variant is None and request.GET.get("preview") != "1":
            return JsonResponse({
                "page_type": "business_landing",
                "business_type": slug,
                "template": "business_landing",
                **PLATFORM_LANDINGS[slug],
            })
        return render_demo(slug, variant)
    return page_error("Website not found")