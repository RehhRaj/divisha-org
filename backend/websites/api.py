from http import HTTPStatus
from urllib.parse import urlsplit

from django.conf import settings
from ninja import NinjaAPI, Schema

from .models import Website


class PublishedPage(Schema):
    title: str
    description: str
    template: str
    business_type: str


class PageNotFound(Schema):
    detail: str


api = NinjaAPI(
    title="Divisha Websites",
    docs_url="/docs" if settings.DEBUG else None,
    openapi_url="/openapi.json" if settings.DEBUG else None,
)


@api.get("/page/", response={200: PublishedPage, 404: PageNotFound})
def published_page(request, host: str = ""):
    host = host.strip()
    try:
        hostname = (urlsplit(f"//{host}").hostname or "").lower().removesuffix(".")
    except ValueError:
        hostname = ""
    missing = {"detail": "Website not found."}
    if not hostname or any(char in host for char in "/@?#"):
        return HTTPStatus.NOT_FOUND, missing

    site = Website.objects.select_related("tenant__business_type").filter(
        tenant__domains__hostname=hostname, tenant__active=True, published_at__isnull=False,
    ).first()
    if site is None:
        return HTTPStatus.NOT_FOUND, missing
    return PublishedPage(
        title=site.published_title,
        description=site.published_description,
        template=site.published_template,
        business_type=site.tenant.business_type.slug,
    )
