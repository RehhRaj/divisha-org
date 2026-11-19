from dataclasses import dataclass
from uuid import UUID

from django.core.exceptions import PermissionDenied

from .models import Membership

VIEW_SITE = "website.view"
EDIT_SITE = "website.edit"
PUBLISH_SITE = "website.publish"
PLATFORM_SUPPORT_GROUP = "Platform Support"
CAPABILITIES = (VIEW_SITE, EDIT_SITE, PUBLISH_SITE)


@dataclass(frozen=True)
class TenantContext:
    tenant_id: int
    actor_id: int
    request_id: UUID


def can_manage_platform(user):
    return user.is_authenticated and user.is_active and user.is_staff and user.is_superuser


def can_access_platform(user):
    if can_manage_platform(user):
        return True
    return (
        user.is_authenticated and user.is_active and user.is_staff
        and user.groups.filter(name=PLATFORM_SUPPORT_GROUP).exists()
    )


def accessible_tenant_ids(user):
    return Membership.objects.filter(
        user=user, role__tenant__active=True, role__capabilities__code=VIEW_SITE,
    ).values("role__tenant_id")


def allowed(context, capability):
    return Membership.objects.filter(
        user_id=context.actor_id, user__is_active=True,
        role__tenant_id=context.tenant_id, role__tenant__active=True,
        role__capabilities__code=capability,
    ).exists()


def require(context, capability):
    if not allowed(context, capability):
        raise PermissionDenied
