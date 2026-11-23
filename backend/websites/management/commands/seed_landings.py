from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from tenancy.models import BusinessType
from websites.models import LandingPage


class Command(BaseCommand):
    help = "Create sample published Divisha landing pages when absent."

    @transaction.atomic
    def handle(self, *args, **options):
        restaurant, _ = BusinessType.objects.get_or_create(
            slug="restau", defaults={"name": "Restaurant"},
        )
        pages = (
            ("divisha.org", None, "Divisha", "Websites for restaurants and education businesses.", ""),
            (
                "restau.divisha.org", restaurant, "Websites for restaurants",
                "Show your menu, opening hours, and contact details online.",
                "Starter · Sample beta plan\nContact Divisha for pricing.",
            ),
        )
        for hostname, business_type, title, description, pricing in pages:
            _, created = LandingPage.objects.get_or_create(
                hostname=hostname,
                defaults={
                    "business_type": business_type,
                    "draft_title": title,
                    "draft_description": description,
                    "draft_pricing": pricing,
                    "published_title": title,
                    "published_description": description,
                    "published_pricing": pricing,
                    "published_at": timezone.now(),
                },
            )
            self.stdout.write(f"{hostname}: {'created' if created else 'already exists'}")
