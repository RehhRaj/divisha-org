from django.http import JsonResponse
from urllib.parse import urlsplit


BASE_DOMAIN = "divisha.org"


# ---------------------------------------
# 1. BUSINESS TYPES
# ---------------------------------------

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
}


# ---------------------------------------
# 2. REGISTERED TENANTS
# ---------------------------------------

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
}


# ---------------------------------------
# 3. REGISTERED NESTED WEBSITES
# ---------------------------------------

NESTED_SITES = {
    ("abc", "tour"): {
        "business_type": "tour",
        "title": "ABC Tour Business",
        "message": "Welcome to ABC Tour Website",
        "template": "tour",
    },

    ("abc", "jeetu"): {
        "business_type": "tour",
        "title": "ABC - Jeetu Tours",
        "message": "Welcome to ABC under Jeetu",
        "template": "tour",
    },
}


# ---------------------------------------
# 4. STANDARD RESPONSE
# ---------------------------------------

def make_page(
    page_type,
    business_type,
    tenant,
    title,
    message,
    template,
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
    return JsonResponse({
        "error": message,
    }, status=status)


# ---------------------------------------
# 5. MAIN API
# ---------------------------------------

def page_data(request):

    raw_host = request.GET.get("host", "").strip()

    try:
        host = urlsplit("//" + raw_host).hostname
    except ValueError:
        host = None

    if not host:
        return page_error("Invalid hostname", 400)

    host = host.lower().rstrip(".")


    # -----------------------------------
    # CASE 1: MAIN PLATFORM
    # divisha.org
    # -----------------------------------

    if host == BASE_DOMAIN:

        return make_page(
            page_type="platform",
            business_type=None,
            tenant=None,
            title="Welcome to Divisha",
            message="Divisha Business OS Platform",
            template="platform",
        )


    # -----------------------------------
    # CHECK BASE DOMAIN
    # -----------------------------------

    suffix = "." + BASE_DOMAIN

    if not host.endswith(suffix):
        return page_error("Unknown domain")


    subdomain = host[:-len(suffix)]

    parts = subdomain.split(".")

    if any(not part for part in parts):
        return page_error("Invalid domain structure")


    # -----------------------------------
    # CASE 2: ONE SUBDOMAIN
    # -----------------------------------

    if len(parts) == 1:

        name = parts[0]

        # Business demo
        business = BUSINESS_TYPES.get(name)

        if business:

            return make_page(
                page_type="demo",
                business_type=name,
                tenant=None,
                title=business["title"],
                message=business["message"],
                template=business["template"],
            )

        # Registered tenant
        tenant = TENANTS.get(name)

        if tenant:

            return make_page(
                page_type="tenant",
                business_type=tenant["business_type"],
                tenant=name,
                title=tenant["title"],
                message=tenant["message"],
                template=tenant["template"],
            )

        return page_error("Website Not Found")


    # -----------------------------------
    # CASE 3: NESTED SUBDOMAIN
    # -----------------------------------

    if len(parts) == 2:

        child_name = parts[0]
        parent_name = parts[1]

        nested = NESTED_SITES.get(
            (child_name, parent_name)
        )

        if not nested:
            return page_error("Nested website not found")

        return make_page(
            page_type="tenant",
            business_type=nested["business_type"],
            tenant=child_name,
            parent_tenant=parent_name,
            title=nested["title"],
            message=nested["message"],
            template=nested["template"],
        )


    # -----------------------------------
    # CASE 4: INVALID STRUCTURE
    # -----------------------------------

    return page_error("Invalid domain structure")