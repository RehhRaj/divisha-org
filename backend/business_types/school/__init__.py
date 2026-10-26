from core.contracts import BusinessType, ModuleSpec

from .logic import greeting
from .templates import TEMPLATES

MODULES = (
    ModuleSpec("students", "Students"),
    ModuleSpec("attendance", "Attendance"),
    ModuleSpec("fees", "Fees"),
    ModuleSpec("exams", "Exams"),
    ModuleSpec("timetable", "Timetable"),
    ModuleSpec("parent_portal", "Parent Portal"),
)

BUSINESS_TYPE = BusinessType(
    key="school", name="School", modules=MODULES, templates=TEMPLATES, greeting=greeting,
)
