"""Hospital business logic. core knows nothing about this file."""


def greeting(tenant_name: str) -> str:
    return f"Welcome to {tenant_name} · Hospital Management"


def generate_patient_code(sequence: int, options) -> str:
    prefix = options.get("patient_code_prefix", "PAT")
    return f"{prefix}-{sequence:06d}"
