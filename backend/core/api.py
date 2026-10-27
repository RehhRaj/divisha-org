"""Builds the /api/message/ response. Pure Python: no Django imports."""

from . import resolver


def template_payload(business_type, template) -> dict:
    labels = {m.key: m.label for m in business_type.modules}
    return {
        "key": template.key,
        "name": template.name,
        "layout": template.layout,
        "theme": dict(template.theme),
        "modules": [{"key": k, "label": labels[k]} for k in template.modules],
    }


def build_message(registry, raw_host: str, root_domain: str):
    """Returns (http_status, payload)."""
    result = resolver.resolve(raw_host, root_domain, registry)
    payload = {
        "message": "",
        "level": result.level,
        "business_type": result.business_type,
        "tenant": result.tenant,
        "host": raw_host,
        # new fields, filled only for tenants
        "tenant_name": None,
        "status": None,
        "custom_domain": None,
        "contact": None,
        "template": None,
    }

    if result.level == resolver.PLATFORM:
        payload["message"] = "Welcome to the Business OS platform."
        return 200, payload

    if result.level == resolver.BUSINESS_TYPE:
        payload["message"] = f"This is the default view for business type: {result.business_type}."
        return 200, payload

    if result.level == resolver.TENANT:
        bt = registry.business_type(result.business_type)
        tenant = registry.find_tenant(result.business_type, result.tenant)
        payload["tenant_name"] = tenant.name
        payload["status"] = tenant.status
        if tenant.status != "active":
            payload["message"] = f"'{tenant.name}' is not active yet (status: {tenant.status})."
            return 403, payload
        payload["custom_domain"] = tenant.custom_domain
        payload["contact"] = tenant.contact
        payload["template"] = template_payload(bt, tenant.template)
        payload["message"] = bt.greeting(tenant.name)  # text comes from the business type
        return 200, payload

    payload["message"] = "Unknown host: this address does not belong to the platform."
    return 404, payload
