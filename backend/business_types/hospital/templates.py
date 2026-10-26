from core.contracts import TemplateSpec

TEMPLATES = (
    TemplateSpec(
        key="hos-template-a", name="Hospital Clinic", layout="sidebar",
        theme={"primary": "#0e7490"},
        modules=("opd", "pharmacy", "billing"),
        options={"patient_code_prefix": "OPD"},
    ),
    TemplateSpec(
        key="hos-template-b", name="Hospital Multi-specialty", layout="cards",
        theme={"primary": "#7c3aed"},
        modules=("opd", "ipd", "lab", "pharmacy", "billing", "insurance"),
        options={"patient_code_prefix": "HOS"},
    ),
)
