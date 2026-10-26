from core.contracts import BusinessType, ModuleSpec

from .logic import greeting
from .templates import TEMPLATES

MODULES = (
    ModuleSpec("pos", "POS"),
    ModuleSpec("kitchen_display", "Kitchen Display"),
    ModuleSpec("inventory", "Inventory"),
)

BUSINESS_TYPE = BusinessType(
    key="restaurant", name="Restaurant", modules=MODULES, templates=TEMPLATES, greeting=greeting,
)
