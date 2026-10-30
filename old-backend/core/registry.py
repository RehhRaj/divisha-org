"""Loads business types (code) and tenants (JSON file, database later).

To move tenants to a database later, keep the same methods
(business_type, find_tenant, find_tenant_by_domain) and only replace the
loading part. resolver, api and frontend stay unchanged.
"""

import importlib
import json
import logging
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Optional

from .contracts import LABEL_RE, BusinessType, ConfigError, TemplateSpec
from .resolver import normalize_host

logger = logging.getLogger(__name__)

STATUSES = ("active", "pending", "suspended")
HOST_RE = re.compile(r"^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$")
REQUIRED = ("slug", "name", "business_type", "template", "status")


@dataclass(frozen=True)
class Tenant:
    slug: str
    name: str
    business_type: str
    template: TemplateSpec
    custom_domain: Optional[str]
    contact: str
    status: str


def normalize_domain(value) -> Optional[str]:
    """Lower-case, drop scheme, path, port and a leading www. Blank -> None."""
    if not value:
        return None
    host = re.sub(r"^https?://", "", str(value).strip().lower()).split("/")[0]
    host = normalize_host(host)
    if host.startswith("www."):
        host = host[4:]
    return host or None


class Registry:
    def __init__(self, business_types: Iterable[BusinessType], tenants_file, reload_on_change=False):
        self._types = {}
        self._templates = {}
        for bt in business_types:
            if bt.key in self._types:
                raise ConfigError(f"Duplicate business type '{bt.key}'.")
            self._types[bt.key] = bt
            for t in bt.templates:
                if t.key in self._templates:
                    raise ConfigError(f"Template key '{t.key}' is used by more than one business type.")
                self._templates[t.key] = t
        self._file = Path(tenants_file)
        self._reload_on_change = reload_on_change
        self._load()  # fail fast: bad data stops startup with a clear message

    # ---------- queries ----------
    def business_type(self, key) -> Optional[BusinessType]:
        return self._types.get(key)

    def business_types(self):
        return list(self._types.values())

    def tenants(self):
        self._refresh()
        return self._tenants

    def find_tenant(self, business_type, slug) -> Optional[Tenant]:
        self._refresh()
        return self._by_slug.get((business_type, slug))

    def find_tenant_by_domain(self, host) -> Optional[Tenant]:
        self._refresh()
        domain = normalize_domain(host)
        return self._by_domain.get(domain) if domain else None

    # ---------- loading ----------
    def _parse(self):
        try:
            raw = json.loads(self._file.read_text(encoding="utf-8"))
        except (OSError, ValueError) as exc:
            raise ConfigError(f"Cannot read tenants file {self._file}: {exc}") from exc
        rows = raw.get("tenants") if isinstance(raw, dict) else None
        if not isinstance(rows, list):
            raise ConfigError("Tenants file must be an object with a 'tenants' list.")

        tenants, slugs, domains = [], set(), set()
        for i, row in enumerate(rows):
            where = f"tenants[{i}] ({row.get('name', '?')})"
            missing = [k for k in REQUIRED if not row.get(k)]
            if missing:
                raise ConfigError(f"{where}: missing {missing}")
            slug = str(row["slug"]).strip().lower()
            if not LABEL_RE.match(slug):
                raise ConfigError(f"{where}: slug '{slug}' must be a valid DNS label (a-z, 0-9, hyphen).")
            bt = self._types.get(row["business_type"])
            if bt is None:
                raise ConfigError(f"{where}: unknown business type '{row['business_type']}'.")
            template = self._templates.get(row["template"])
            if template is None:
                raise ConfigError(f"{where}: unknown template '{row['template']}'.")
            if template.key not in {t.key for t in bt.templates}:
                raise ConfigError(
                    f"{where}: template '{template.key}' does not belong to business type '{bt.key}'."
                )
            if row["status"] not in STATUSES:
                raise ConfigError(f"{where}: status must be one of {STATUSES}.")
            domain = normalize_domain(row.get("custom_domain"))
            if domain and not HOST_RE.match(domain):
                raise ConfigError(f"{where}: invalid custom domain '{domain}'.")
            if (bt.key, slug) in slugs:
                raise ConfigError(f"{where}: duplicate slug '{slug}' in business type '{bt.key}'.")
            slugs.add((bt.key, slug))
            if domain:
                if domain in domains:
                    raise ConfigError(f"{where}: duplicate custom domain '{domain}'.")
                domains.add(domain)
            tenants.append(Tenant(slug, row["name"], bt.key, template, domain,
                                  str(row.get("contact", "")), row["status"]))
        return tuple(tenants)

    def _load(self):
        tenants = self._parse()
        self._tenants = tenants
        self._by_slug = {(t.business_type, t.slug): t for t in tenants}
        self._by_domain = {t.custom_domain: t for t in tenants if t.custom_domain}
        self._mtime = self._file.stat().st_mtime

    def _refresh(self):
        """Dev convenience: edits to the tenants file apply without a restart."""
        if not self._reload_on_change:
            return
        try:
            if self._file.stat().st_mtime != self._mtime:
                self._load()
                logger.info("Tenants file reloaded.")
        except Exception:
            logger.exception("Tenants file reload failed; keeping previous data.")
            try:
                self._mtime = self._file.stat().st_mtime
            except OSError:
                pass


def load_registry(module_paths, tenants_file, reload_on_change=False) -> Registry:
    types = []
    for path in module_paths:
        module = importlib.import_module(path)
        if not hasattr(module, "BUSINESS_TYPE"):
            raise ConfigError(f"Module '{path}' does not define BUSINESS_TYPE.")
        types.append(module.BUSINESS_TYPE)
    return Registry(types, tenants_file, reload_on_change)
