from functools import lru_cache

from django.conf import settings
from django.http import JsonResponse

from . import api
from .registry import load_registry


@lru_cache(maxsize=1)
def get_registry():
    # Loaded once at first request. In DEBUG the tenants file is re-read when it changes.
    return load_registry(settings.ENABLED_BUSINESS_TYPES, settings.TENANTS_FILE, reload_on_change=settings.DEBUG)


def _original_host(request) -> str:
    # The Next.js server forwards the browser's hostname in this header
    # (this API is internal; it must not be exposed to the public internet).
    return request.headers.get("X-Original-Host") or request.get_host()


def message(request):
    status, payload = api.build_message(get_registry(), _original_host(request), settings.PLATFORM_ROOT_DOMAIN)
    return JsonResponse(payload, status=status)


def health(request):
    return JsonResponse({"status": "ok"})
