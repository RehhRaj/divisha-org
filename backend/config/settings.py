import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "dev-only-change-me")
DEBUG = os.environ.get("DJANGO_DEBUG", "1") == "1"

# Subdomains are dynamic (tenants come and go), so any host is accepted here.
# Tighten this in production (e.g. ".mysite.com").
ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "*").split(",")

# The root domain of the platform. "localhost" for local dev,
# "mysite.com" in production.
PLATFORM_ROOT_DOMAIN = os.environ.get("PLATFORM_ROOT_DOMAIN", "localhost")

# Business types: each is a package that exposes BUSINESS_TYPE (its modules,
# templates and business logic). core never imports them by name.
# Add a new business type here; no change in core.
ENABLED_BUSINESS_TYPES = [
    "business_types.school",
    "business_types.hospital",
    "business_types.restaurant",
]

# Dummy tenants live in a JSON file for now. The database comes later.
TENANTS_FILE = Path(os.environ.get("TENANTS_FILE", BASE_DIR / "data" / "tenants.json"))

INSTALLED_APPS = [
    "core",
]

MIDDLEWARE = [
    "django.middleware.common.CommonMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"

# No database yet: tenants come from data/tenants.json.
DATABASES = {}

USE_TZ = True
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
