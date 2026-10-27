"""School business logic. core knows nothing about this file."""

from decimal import ROUND_HALF_UP, Decimal

LETTER_SCALE = ((90, "A+"), (80, "A"), (70, "B"), (60, "C"), (50, "D"))


def greeting(tenant_name: str) -> str:
    return f"Welcome to {tenant_name} · School Portal"


def grade_for(percent, options):
    """Grade as per the template option: 'letter' (A+, A, ...) or 'cgpa10' (0-10)."""
    if options.get("grading") == "cgpa10":
        cgpa = (Decimal(str(percent)) / Decimal("9.5")).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)
        return min(cgpa, Decimal("10.0"))
    for floor, letter in LETTER_SCALE:
        if percent >= floor:
            return letter
    return "F"
