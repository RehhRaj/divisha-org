from core.contracts import TemplateSpec

TEMPLATES = (
    TemplateSpec(
        key="restaurant-template-a", name="Restaurant Standard", layout="sidebar",
        theme={"primary": "#b45309"},
        modules=("pos", "kitchen_display", "inventory"),
        options={"tax_rate": "0.05", "service_charge": "0.00"},
    ),
)
