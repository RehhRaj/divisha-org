from django.http import JsonResponse
from urllib.parse import urlsplit


# Main domain
BASE_DOMAIN = "divisha.org"


# Available business types
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


# Registered tenants
# Key = (tenant_name, business_type)

TENANTS = {
    ("jeetu", "tour"): {
        "title": "Jeetu Tour Business",
        "message": "Welcome to Jeetu Tour Website",
        "template": "tour",
    },

    ("teal", "restau"): {
        "title": "Teal Restaurant",
        "message": "Welcome to Teal Restaurant",
        "template": "restaurant",
    },

    ("abc", "society"): {
        "title": "ABC Society",
        "message": "Welcome to ABC Society",
        "template": "society",
    },
}


def page_data(request):

    # Host received from Next.js
    raw_host = request.GET.get("host", "")

    try:
        host = urlsplit("//" + raw_host.strip()).hostname
    except ValueError:
        host = None

    if not host:
        return JsonResponse(
            {"error": "Invalid hostname"},
            status=400,
        )

    host = host.lower().rstrip(".")

    # CASE 1: Main SaaS website
    if host == BASE_DOMAIN:

        return JsonResponse({
            "page_type": "platform",
            "business_type": None,
            "tenant": None,
            "title": "Welcome to My SaaS",
            "message": "Main SaaS Platform",
            "template": "platform",
        })


    # CASE 2: Check domain suffix
    suffix = "." + BASE_DOMAIN

    if not host.endswith(suffix):
        return JsonResponse(
            {"error": "Unknown domain"},
            status=404,
        )

    # Remove main domain
    subdomain = host[:-len(suffix)]

    parts = subdomain.split(".")


    # CASE 3: Business type demo
    # Example: tour.divisha.org

    if len(parts) == 1:

        business_type = parts[0]

        business = BUSINESS_TYPES.get(business_type)

        if not business:
            return JsonResponse(
                {"error": "Business type not registered"},
                status=404,
            )

        return JsonResponse({
            "page_type": "demo",
            "business_type": business_type,
            "tenant": None,
            "title": business["title"],
            "message": business["message"],
            "template": business["template"],
        })


    # CASE 4: Tenant website
    # Example: jeetu.tour.divisha.org

    if len(parts) == 2:

        tenant_name = parts[0]
        business_type = parts[1]

        # First check business type
        business = BUSINESS_TYPES.get(business_type)

        if not business:
            return JsonResponse(
                {"error": "Business type not registered"},
                status=404,
            )

        # Then check tenant
        tenant_data = TENANTS.get(
            (tenant_name, business_type)
        )

        if not tenant_data:
            return JsonResponse(
                {"error": "Tenant not registered"},
                status=404,
            )

        return JsonResponse({
            "page_type": "tenant",
            "business_type": business_type,
            "tenant": tenant_name,
            "title": tenant_data["title"],
            "message": tenant_data["message"],
            "template": tenant_data["template"],
        })


    # CASE 5: Invalid nested subdomain

    return JsonResponse(
        {"error": "Invalid domain structure"},
        status=404,
    )
