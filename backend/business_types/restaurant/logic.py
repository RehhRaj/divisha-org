"""Restaurant business logic. core knows nothing about this file."""

from decimal import ROUND_HALF_UP, Decimal

CENT = Decimal("0.01")


def greeting(tenant_name: str) -> str:
    return f"Welcome to {tenant_name} · Restaurant POS"


def bill_total(items, options):
    """items: iterable of (unit_price, quantity). Tax and service charge come from the template."""
    tax_rate = Decimal(options.get("tax_rate", "0"))
    service_rate = Decimal(options.get("service_charge", "0"))
    subtotal = sum((Decimal(str(price)) * qty for price, qty in items), Decimal("0"))
    tax = (subtotal * tax_rate).quantize(CENT, rounding=ROUND_HALF_UP)
    service = (subtotal * service_rate).quantize(CENT, rounding=ROUND_HALF_UP)
    return {
        "subtotal": subtotal.quantize(CENT),
        "tax": tax,
        "service": service,
        "total": (subtotal + tax + service).quantize(CENT),
    }
