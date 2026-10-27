from core.contracts import BusinessType, ModuleSpec

from .logic import greeting
from .templates import TEMPLATES

MODULES = (
    ModuleSpec("opd", "OPD"),
    ModuleSpec("ipd", "IPD"),
    ModuleSpec("lab", "Laboratory"),
    ModuleSpec("pharmacy", "Pharmacy"),
    ModuleSpec("billing", "Billing"),
    ModuleSpec("insurance", "Insurance"),
)

BUSINESS_TYPE = BusinessType(
    key="hospital", name="Hospital", modules=MODULES, templates=TEMPLATES, greeting=greeting,
)
