from core.contracts import TemplateSpec

TEMPLATES = (
    TemplateSpec(
        key="school-template-a", name="School Classic", layout="sidebar",
        theme={"primary": "#1d4ed8"},
        modules=("students", "attendance", "fees", "exams"),
        options={"grading": "letter"},
    ),
    TemplateSpec(
        key="school-template-b", name="School Modern", layout="cards",
        theme={"primary": "#047857"},
        modules=("students", "attendance", "fees", "exams", "timetable", "parent_portal"),
        options={"grading": "cgpa10"},
    ),
)
