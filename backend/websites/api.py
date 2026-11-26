from http import HTTPStatus
from typing import Literal
from urllib.parse import urlsplit

from django.conf import settings
from ninja import NinjaAPI, Schema

from .models import LandingPage, Website
from .registry import TEMPLATES


class TemplatePresentation(Schema):
    layout: str
    palette: str


class Offering(Schema):
    name: str
    detail: str


class PublishedPage(Schema):
    title: str
    description: str
    template: str
    business_type: str
    presentation: TemplatePresentation | None = None
    offerings: list[Offering]
    hours: str
    contact: str


class LandingLink(Schema):
    label: str
    href: str


class PublishedLanding(Schema):
    page_type: Literal["platform_landing", "business_landing"]
    title: str
    description: str
    pricing: str
    links: list[LandingLink]


class PageNotFound(Schema):
    detail: str


api = NinjaAPI(
    title="Divisha Websites",
    docs_url="/docs" if settings.DEBUG else None,
    openapi_url="/openapi.json" if settings.DEBUG else None,
)


@api.get("/page/", response={200: PublishedPage | PublishedLanding, 404: PageNotFound})
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
        landing = resolve_landing(hostname)
        if landing is None:
            return HTTPStatus.NOT_FOUND, missing
        return landing
    business_type = site.tenant.business_type.slug
    variant = next(
        (item for item in TEMPLATES.get(business_type, ()) if item.key == site.published_template),
        None,
    )
    return PublishedPage(
        title=site.published_title,
        description=site.published_description,
        template=site.published_template,
        business_type=business_type,
        offerings=[
            Offering(name=name.strip(), detail=detail.strip())
            for line in site.published_offerings.splitlines() if line.strip()
            for name, _, detail in [line.partition("|")]
        ],
        hours=site.published_hours,
        contact=site.published_contact,
        presentation=TemplatePresentation(layout=variant.layout, palette=variant.palette) if variant else None,
    )


def resolve_landing(hostname):
    local = hostname == "localhost" or hostname.endswith(".localhost")
    if hostname in {"localhost", "www.divisha.org"}:
        hostname = "divisha.org"
    elif local:
        hostname = hostname.removesuffix(".localhost") + ".divisha.org"

    published_pages = LandingPage.objects.filter(published_at__isnull=False)
    page = published_pages.filter(hostname=hostname).first()
    if page is None:
        return None

    links = []
    if page.business_type_id is None:
        business_pages = published_pages.filter(
            business_type__isnull=False,
        ).select_related("business_type").order_by("business_type__name")
        for business_page in business_pages:
            host = business_page.hostname
            href = f"https://{host}/"
            if local and host.endswith(".divisha.org"):
                href = f"http://{host.removesuffix('.divisha.org')}.localhost:3000/"
            links.append(LandingLink(label=business_page.business_type.name, href=href))

    return PublishedLanding(
        page_type="platform_landing" if page.business_type_id is None else "business_landing",
        title=page.published_title,
        description=page.published_description,
        pricing=page.published_pricing,
        links=links,
    )
