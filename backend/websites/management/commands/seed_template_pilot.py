from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from kernel.models import Capability, Membership, Role
from kernel.policy import CAPABILITIES
from tenancy.models import BusinessType, Domain, Tenant
from websites.models import LandingPage, Website
from websites.registry import template_choices


PILOT = (
    ("restau", "Restaurant", (
        ("pilot-tandoor-restau", "Tandoor House", "restaurant-classic", "North Indian favourites and tandoor specials."),
        ("pilot-highway-restau", "Highway Dhaba", "restaurant-dhaba", "Punjabi meals and chai for the road."),
        ("pilot-copper-restau", "Copper Bistro", "restaurant-bistro", "Seasonal small plates and evening dining."),
    )),
    ("edu", "Education", (
        ("pilot-maple-edu", "Maple Academy", "education-classic", "Primary learning and school programmes."),
        ("pilot-river-edu", "River School", "education-admissions", "Admissions information and campus visits."),
        ("pilot-oak-edu", "Oak Learning Centre", "education-campus", "Campus activities and learning spaces."),
    )),
    ("tour", "Tour & Travel", (
        ("pilot-summit-tour", "Summit Trails", "tour-explorer", "Guided mountain holidays and short treks."),
        ("pilot-wild-tour", "Wild Routes", "tour-adventure", "Outdoor escapes and active group trips."),
        ("pilot-fort-tour", "Fort Journeys", "tour-heritage", "Heritage tours and guided city walks."),
    )),
)


class Command(BaseCommand):
    help = "Create nine demo websites and their tenant accounts with local domains."

    @transaction.atomic
    def handle(self, *args, **options):
        users = get_user_model().objects
        capabilities = [Capability.objects.get_or_create(code=code)[0] for code in CAPABILITIES]
        now = timezone.now()

        for slug, name, sites in PILOT:
            business_type, _ = BusinessType.objects.get_or_create(slug=slug, defaults={"name": name})
            description = f"Explore demo websites for {name.lower()} businesses."
            existing_landing = LandingPage.objects.filter(business_type=business_type).first()
            if existing_landing is None:
                landing = LandingPage(
                    hostname=f"{slug}.divisha.org",
                    business_type=business_type,
                    draft_title=f"Websites for {name}",
                    draft_description=description,
                    published_title=f"Websites for {name}",
                    published_description=description,
                    published_at=now,
                )
                landing.full_clean()
                landing.save()

            for tenant_slug, title, template, description in sites:
                if template not in dict(template_choices(slug)):
                    raise CommandError(f"Invalid template for {tenant_slug}: {template}")
                tenant, _ = Tenant.objects.get_or_create(
                    slug=tenant_slug, defaults={"business_type": business_type, "name": title},
                )
                if tenant.business_type_id != business_type.pk:
                    raise CommandError(f"Pilot tenant slug already belongs to another type: {tenant_slug}")
                hostname = f"{tenant_slug}.localhost"
                domain, _ = Domain.objects.get_or_create(hostname=hostname, defaults={"tenant": tenant})
                if domain.tenant_id != tenant.pk:
                    raise CommandError(f"Domain already assigned: {hostname}")
                Website.objects.get_or_create(
                    tenant=tenant,
                    defaults={
                        "template": template, "published_template": template,
                        "draft_title": title, "published_title": title,
                        "draft_description": description, "published_description": description,
                        "published_at": now,
                    },
                )
                username = tenant_slug.replace("-", "_") + "_admin"
                role, role_created = Role.objects.get_or_create(tenant=tenant, name="pilot_owner")
                if role_created:
                    role.capabilities.set(capabilities)
                user, user_created = users.get_or_create(username=username)
                if user_created:
                    user.set_unusable_password()
                    user.save(update_fields=["password"])
                    Membership.objects.create(user=user, role=role)
                elif not Membership.objects.filter(user=user, role=role).exists():
                    raise CommandError(f"Pilot username already exists without the pilot membership: {username}")
                self.stdout.write(f"http://{hostname}:3000/ | {username}")
