
from django.http import JsonResponse
from urllib.parse import urlsplit
import re


# ============================================================
# 1. CONFIGURATION
# ============================================================

BASE_DOMAIN = "divisha.org"

# Local development hostname mapping
# Example:
# jeetu.localhost:3000 -> jeetu.divisha.org
# abc.tour.localhost:3000 -> abc.tour.divisha.org

LOCAL_DOMAINS = ("localhost", "127.0.0.1")


# ============================================================
# 2. BUSINESS TYPES
# ============================================================

BUSINESS_TYPES = {
    "tour": {
        "title": "Tour Business Demo",
        "message": "Welcome to Tour Business Demo",
        "template": "tour",
    },
    "restau": {
        "title": "Restaurant Business Demo",
        "message": "Welcome to Restaurant Demo",
        "template": "restaurant",
    },
    "society": {
        "title": "Society Business Demo",
        "message": "Welcome to Society Demo",
        "template": "society",
    },
    "edu": {
        "title": "Education & School Demo",
        "message": "Welcome to School Management Demo",
        "template": "education",
    },
    "salon": {
        "title": "Beauty & Salon Demo",
        "message": "Welcome to Beauty & Care Salon Demo",
        "template": "salon",
    },
}


# ============================================================
# 3. REGISTERED TENANTS
# ============================================================

# Each tenant has one primary business website.
# A tenant can also own additional nested business websites.

TENANTS = {
    "jeetu": {
        "business_type": "tour",
        "title": "Jeetu Tour Business",
        "message": "Welcome to Jeetu Tour Website",
        "template": "tour",
    },
    "teal": {
        "business_type": "restau",
        "title": "Teal Restaurant",
        "message": "Welcome to Teal Restaurant",
        "template": "restaurant",
    },
    "abc": {
        "business_type": "society",
        "title": "ABC Society",
        "message": "Welcome to ABC Society",
        "template": "society",
    },
    "apex-academy": {
        "business_type": "edu",
        "title": "Apex International Academy",
        "message": "Welcome to Apex Academy Portal",
        "template": "education",
    },
    "glam-hub": {
        "business_type": "salon",
        "title": "Glam Hub Luxury Salon",
        "message": "Welcome to Glam Hub Styling Studio",
        "template": "salon",
    },
}


# ============================================================
# 4. NESTED WEBSITES
# ============================================================

# UNIQUE KEY = (tenant, business_type)
#
# ("abc", "tour")    -> abc.tour.divisha.org
# ("abc", "restau")  -> abc.restau.divisha.org
# ("jeetu", "restau")-> jeetu.restau.divisha.org
#
# Python dictionaries cannot contain two effective entries
# with the same key. However, duplicate literal keys would
# silently overwrite an earlier entry. See the validation note
# below for database-level uniqueness.

NESTED_SITES = {
    ("abc", "tour"): {
        "title": "ABC Tour & Travels",
        "message": "Welcome to ABC Tour Website",
        "template": "tour",
    },
    ("abc", "restau"): {
        "title": "ABC Multi-Cuisine Restaurant",
        "message": "Welcome to ABC Restaurant Website",
        "template": "restaurant",
    },
    ("abc", "society"): {
        "title": "ABC Co-operative Society",
        "message": "Welcome to ABC Residential Society Portal",
        "template": "society",
    },
    ("jeetu", "restau"): {
        "title": "Jeetu Da Dhaba & Restaurant",
        "message": "Welcome to Jeetu Fine Dine Restaurant",
        "template": "restaurant",
    },
    ("jeetu", "salon"): {
        "title": "Jeetu Gents Salon",
        "message": "Welcome to Jeetu Grooming Station",
        "template": "salon",
    },
    ("apex-academy", "tour"): {
        "title": "Apex Educational Tours",
        "message": "Welcome to Apex Academy Study Tours & Travels",
        "template": "tour",
    },
}


# ============================================================
# 5. STANDARD JSON RESPONSE
# ============================================================

def make_page(
    page_type,
    business_type=None,
    tenant=None,
    title="",
    message="",
    template=None,
    parent_tenant=None,
):
    return JsonResponse({
        "page_type": page_type,
        "business_type": business_type,
        "tenant": tenant,
        "parent_tenant": parent_tenant,
        "title": title,
        "message": message,
        "template": template,
    })


def page_error(message, status=404):
    return JsonResponse(
        {"error": message},
        status=status,
    )


# ============================================================
# 6. HOSTNAME NORMALIZATION
# ============================================================

def normalize_host(raw_host):
    """
    Examples:

    divisha.org              -> divisha.org
    www.divisha.org          -> www.divisha.org
    jeetu.divisha.org        -> jeetu.divisha.org
    jeetu.localhost:3000     -> jeetu.divisha.org
    abc.tour.localhost:3000  -> abc.tour.divisha.org
    localhost:3000           -> divisha.org

    Returns None for invalid hostnames.
    """

    raw_host = raw_host.strip().lower()

    if not raw_host or len(raw_host) > 253:
        return None

    try:
        parsed = urlsplit("//" + raw_host)
        host = parsed.hostname
        _port = parsed.port
    except ValueError:
        return None

    if (
        not host
        or parsed.username is not None
        or parsed.password is not None
        or parsed.path
        or parsed.query
        or parsed.fragment
    ):
        return None

    host = host.rstrip(".")

    # Localhost / loopback support
    if host in LOCAL_DOMAINS:
        return BASE_DOMAIN

    if host.endswith(".localhost"):
        prefix = host[:-len(".localhost")]
        host = prefix + "." + BASE_DOMAIN

    # Validate DNS hostname labels
    labels = host.split(".")

    for label in labels:
        if not re.fullmatch(
            r"[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?",
            label,
        ):
            return None

    return host


# ============================================================
# 7. BUSINESS DATA VALIDATION
# ============================================================

def validate_business_data():
    """
    Validate all hardcoded business configuration.

    Unique nested key:
        (tenant, business_type)

    Also check registered tenants and business types.
    """

    for tenant_name, tenant_data in TENANTS.items():

        business_type = tenant_data["business_type"]

        if business_type not in BUSINESS_TYPES:
            raise ValueError(
                f"Unknown business type '{business_type}' "
                f"for tenant '{tenant_name}'"
            )

    for key, site_data in NESTED_SITES.items():

        if not isinstance(key, tuple) or len(key) != 2:
            raise ValueError(
                f"Invalid nested website key: {key}"
            )

        tenant_name, business_type = key

        if tenant_name not in TENANTS:
            raise ValueError(
                f"Unknown parent tenant: {tenant_name}"
            )

        if business_type not in BUSINESS_TYPES:
            raise ValueError(
                f"Unknown business type: {business_type}"
            )

        if not site_data.get("title"):
            raise ValueError(
                f"Missing website title for {key}"
            )


# Validate once when Django imports this module.
validate_business_data()


# ============================================================
# 8. MAIN PAGE API
# ============================================================

def page_data(request):

    raw_host = request.GET.get("host", "")

    host = normalize_host(raw_host)

    if not host:
        return page_error("Invalid hostname", 400)

    # --------------------------------------------------------
    # CASE 1: PLATFORM WEBSITE
    # --------------------------------------------------------

    if host in (
        BASE_DOMAIN,
        "www." + BASE_DOMAIN,
    ):
        return make_page(
            page_type="platform",
            title="Welcome to Divisha",
            message="Divisha Business OS Platform",
            template="platform",
        )

    # --------------------------------------------------------
    # CHECK BASE DOMAIN
    # --------------------------------------------------------

    suffix = "." + BASE_DOMAIN

    if not host.endswith(suffix):
        return page_error("Unknown domain")

    subdomain = host[:-len(suffix)]

    parts = subdomain.split(".")

    if any(not part for part in parts):
        return page_error("Invalid domain structure")

    # --------------------------------------------------------
    # CASE 2: SINGLE SUBDOMAIN
    # --------------------------------------------------------

    if len(parts) == 1:

        name = parts[0]

        # Business demo
        business = BUSINESS_TYPES.get(name)

        if business:
            return make_page(
                page_type="demo",
                business_type=name,
                title=business["title"],
                message=business["message"],
                template=business["template"],
            )

        # Registered tenant
        tenant_data = TENANTS.get(name)

        if tenant_data:
            return make_page(
                page_type="tenant",
                business_type=tenant_data["business_type"],
                tenant=name,
                title=tenant_data["title"],
                message=tenant_data["message"],
                template=tenant_data["template"],
            )

        return page_error("Website Not Found")

    # --------------------------------------------------------
    # CASE 3: NESTED WEBSITE
    # URL: tenant.business_type.divisha.org
    # --------------------------------------------------------

    if len(parts) == 2:

        tenant_name = parts[0]
        business_type_name = parts[1]

        # Parent tenant must exist
        if tenant_name not in TENANTS:
            return page_error("Parent tenant not registered")

        # Business type must exist
        if business_type_name not in BUSINESS_TYPES:
            return page_error("Unknown business type")

        # Composite unique key
        unique_key = (
            tenant_name,
            business_type_name,
        )

        nested = NESTED_SITES.get(unique_key)

        if not nested:
            return page_error("Nested website not found")

        business = BUSINESS_TYPES[business_type_name]

        return make_page(
            page_type="nested_tenant",
            business_type=business_type_name,
            tenant=tenant_name,
            parent_tenant=tenant_name,
            title=nested["title"],
            message=nested["message"],
            template=nested.get(
                "template",
                business["template"],
            ),
        )

    # --------------------------------------------------------
    # CASE 4: INVALID DOMAIN STRUCTURE
    # --------------------------------------------------------

    return page_error("Invalid domain structure")
