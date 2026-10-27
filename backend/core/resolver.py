"""Hostname -> (level, business_type, tenant).

Nothing here knows about "school" or "hospital". It asks the registry which
business types and tenants exist.

Order:
  1. platform root domain            -> platform
  2. a tenant's custom domain        -> tenant   (abc.com)
  3. <type>.<root>                   -> business type default view
  4. <tenant>.<type>.<root>          -> tenant
"""

from dataclasses import dataclass
from typing import Optional

PLATFORM = "platform"
BUSINESS_TYPE = "business_type"
TENANT = "tenant"
UNKNOWN = "unknown"


@dataclass(frozen=True)
class Resolved:
    level: str
    business_type: Optional[str] = None
    tenant: Optional[str] = None


def normalize_host(raw_host: str) -> str:
    """Lower-case the host and drop any :port."""
    host = (raw_host or "").strip().lower()
    if host.startswith("["):  # IPv6 literal, not a platform host
        return host
    return host.split(":", 1)[0].rstrip(".")


def resolve(raw_host: str, root_domain: str, registry) -> Resolved:
    host = normalize_host(raw_host)
    root = root_domain.lower().strip(".")

    if host == root or host == f"www.{root}":
        return Resolved(PLATFORM)

    tenant = registry.find_tenant_by_domain(host)
    if tenant is not None:
        return Resolved(TENANT, business_type=tenant.business_type, tenant=tenant.slug)

    suffix = f".{root}"
    if not host.endswith(suffix):
        return Resolved(UNKNOWN)

    labels = host[: -len(suffix)].split(".")
    if any(not label for label in labels):
        return Resolved(UNKNOWN)

    if len(labels) == 1:
        if registry.business_type(labels[0]) is None:
            return Resolved(UNKNOWN)
        return Resolved(BUSINESS_TYPE, business_type=labels[0])
    if len(labels) == 2:
        if registry.find_tenant(labels[1], labels[0]) is None:
            return Resolved(UNKNOWN)
        return Resolved(TENANT, business_type=labels[1], tenant=labels[0])
    return Resolved(UNKNOWN)
