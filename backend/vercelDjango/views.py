from django.http import JsonResponse


# Registered tenants
TENANTS = {
    "teal": {
        "title": "Welcome to Teal",
        "message": "Django selected the teal tenant.",
    },
    "jeetu": {
        "title": "Welcome to Jeetu",
        "message": "Django selected the jeetu tenant.",
    },
    "school": {
        "title": "Welcome to School",
        "message": "Django selected the school tenant.",
    },
}


def page_data(request):
    # Read hostname sent by Next.js.
    host = (
        request.GET.get("host", "")
        .lower()
        .strip()
        .rstrip(".")
        .split(":")[0]
    )

    # Main Divisha page
    if host in ("divisha.org", "localhost", "127.0.0.1"):
        return JsonResponse({
            "page_type": "platform",
            "title": "Welcome to Divisha",
            "message": "This page data came from Django.",
            "tenant": None,
        })

    # Support production and local tenant domains.
    if host.endswith(".divisha.org"):
        suffix = ".divisha.org"
    elif host.endswith(".localhost"):
        suffix = ".localhost"
    else:
        return JsonResponse(
            {"error": "Unknown domain"},
            status=404,
        )

    # Extract tenant name.
    tenant = host[:-len(suffix)]

    # Reject empty names and nested subdomains.
    if not tenant or "." in tenant:
        return JsonResponse(
            {"error": "Unknown tenant"},
            status=404,
        )

    # Only registered tenants are allowed.
    if tenant not in TENANTS:
        return JsonResponse(
            {"error": "Tenant not registered"},
            status=404,
        )

    # Return the registered tenant's page.
    tenant_data = TENANTS[tenant]

    return JsonResponse({
        "page_type": "tenant",
        "title": tenant_data["title"],
        "message": tenant_data["message"],
        "tenant": tenant,
    })