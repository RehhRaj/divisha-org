"""Public restaurant checkout configuration resolved for a single site."""
import re


def ordering_config(record, table_token):
    config = record.get("ordering")
    if not config:
        return None

    # Django record is the single source of truth for each tenant's number.
    # Environment variables are deliberately NOT consulted.
    phone = (config.get("whatsapp_number") or "").strip()
    if not re.fullmatch(r"[1-9][0-9]{7,14}", phone):
        phone = None

    tables = config.get("tables", {})
    table = tables.get(table_token) if table_token is not None else None
    return {
        "whatsapp_number": phone,
        "mode": "dine-in" if table else "invalid-table" if table_token is not None else "takeaway",
        "table": table,
    }
