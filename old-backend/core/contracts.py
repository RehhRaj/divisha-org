"""Contract that every business type must follow.

core knows ONLY this contract. It never imports a business type by name:
business types are listed in settings.ENABLED_BUSINESS_TYPES and loaded by path.
"""

import re
from dataclasses import dataclass, field
from typing import Any, Callable, Mapping

LABEL_RE = re.compile(r"^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$")


class ConfigError(Exception):
    """Raised at startup when business types or tenant data are invalid."""


@dataclass(frozen=True)
class ModuleSpec:
    key: str
    label: str


@dataclass(frozen=True)
class TemplateSpec:
    key: str                       # e.g. "school-template-a"
    name: str
    layout: str                    # frontend layout name: "sidebar" or "cards"
    theme: Mapping[str, str]       # must contain "primary"
    modules: tuple                 # module keys, subset of the business type modules
    options: Mapping[str, Any] = field(default_factory=dict)  # business-specific settings


@dataclass(frozen=True)
class BusinessType:
    key: str                       # e.g. "school"
    name: str
    modules: tuple                 # tuple[ModuleSpec, ...]
    templates: tuple               # tuple[TemplateSpec, ...]
    greeting: Callable[[str], str]  # business-specific text for a tenant name

    def __post_init__(self):
        if not LABEL_RE.match(self.key):
            raise ConfigError(f"Business type key '{self.key}' must be a valid DNS label.")
        if not self.templates:
            raise ConfigError(f"Business type '{self.key}' needs at least one template.")
        module_keys = {m.key for m in self.modules}
        seen = set()
        for t in self.templates:
            if t.key in seen:
                raise ConfigError(f"Business type '{self.key}': duplicate template '{t.key}'.")
            seen.add(t.key)
            if "primary" not in t.theme:
                raise ConfigError(f"Template '{t.key}': theme needs a 'primary' color.")
            if not t.layout:
                raise ConfigError(f"Template '{t.key}': layout is required.")
            unknown = [m for m in t.modules if m not in module_keys]
            if unknown:
                raise ConfigError(f"Template '{t.key}': unknown modules {unknown}.")
