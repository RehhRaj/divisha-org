from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from kernel.models import Capability, Membership, Role
from kernel.policy import CAPABILITIES, EDIT_SITE, PLATFORM_SUPPORT_GROUP, PUBLISH_SITE, VIEW_SITE
from tenancy.models import BusinessType, Domain, Tenant
from websites.models import Website

SAMPLE_SITES = (
    ("restau", "Restaurant", "jeetu-restau", "Jeetu Da Dhaba", "restaurant-classic",
     "Explore our sample dhaba menu and dining options.", "owner", (VIEW_SITE, EDIT_SITE, PUBLISH_SITE)),
    ("restau", "Restaurant", "teal-restau", "Teal Restaurant", "restaurant-classic",
     "Discover a sample seasonal restaurant menu.", "editor", (VIEW_SITE, EDIT_SITE)),
    ("edu", "Education", "apexacademy-edu", "Apex Academy", "education-classic",
     "Explore our sample school programmes and campus.", "owner", (VIEW_SITE, EDIT_SITE, PUBLISH_SITE)),
    ("edu", "Education", "horizon-edu", "Horizon Academy", "education-classic",
     "Learn about our sample admissions and student activities.", "reviewer", (VIEW_SITE, PUBLISH_SITE)),
)


class Command(BaseCommand):
    help = "Create the four database-backed sample sites and tenant accounts."

    @transaction.atomic
    def handle(self, *args, **options):
        user_model = get_user_model()
        support_group, _ = Group.objects.get_or_create(name=PLATFORM_SUPPORT_GROUP)
        support_group.permissions.set(Permission.objects.filter(
            content_type__app_label="tenancy",
            codename__in=["view_businesstype", "view_tenant", "view_domain"],
        ))
        support, created = user_model.objects.get_or_create(
            username="platform_support", defaults={"is_staff": True},
        )
        if created:
            support.set_unusable_password()
            support.save(update_fields=["password"])
            support.groups.add(support_group)
        capabilities = {
            code: Capability.objects.get_or_create(code=code)[0] for code in CAPABILITIES
        }
        for type_slug, type_name, slug, name, template, description, role_name, codes in SAMPLE_SITES:
            business_type, _ = BusinessType.objects.get_or_create(
                slug=type_slug, defaults={"name": type_name},
            )
            tenant, _ = Tenant.objects.get_or_create(
                slug=slug, defaults={"name": name, "business_type": business_type},
            )
            Domain.objects.get_or_create(hostname=f"{slug}.localhost", defaults={"tenant": tenant})
            Website.objects.get_or_create(tenant=tenant, defaults={
                "template": template,
                "draft_title": name,
                "draft_description": description,
                "published_title": name,
                "published_description": description,
                "published_template": template,
                "published_at": timezone.now(),
            })
            role, created = Role.objects.get_or_create(tenant=tenant, name=role_name)
            if created:
                role.capabilities.set(capabilities[code] for code in codes)
            username = slug.replace("-", "_") + "_admin"
            user, created = user_model.objects.get_or_create(username=username)
            if created:
                user.set_unusable_password()
                user.save(update_fields=["password"])
                Membership.objects.create(user=user, role=role)
            self.stdout.write(f"{slug}.localhost:3000 | {username} | {role_name}")
