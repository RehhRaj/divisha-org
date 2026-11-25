from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.db.models import F
from django.utils import timezone

from kernel.models import AuditEvent, Capability, Membership, Role
from kernel.policy import can_access_platform, can_manage_platform
from tenancy.models import BusinessType, Domain, Tenant

from .models import LandingPage, Website


class PlatformAdmin(admin.AdminSite):
    site_header = "Divisha Platform Admin"

    def has_permission(self, request):
        return can_access_platform(request.user)

class PlatformModelAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return can_manage_platform(request.user)

    def has_change_permission(self, request, obj=None):
        return can_manage_platform(request.user)

    def has_delete_permission(self, request, obj=None):
        return can_manage_platform(request.user)


class WebsiteAdmin(PlatformModelAdmin):
    fields = ("tenant", "template", "draft_title", "draft_description", "draft_offerings", "draft_hours", "draft_contact")
    list_display = ("tenant", "template", "published_at")


class AuditAdmin(admin.ModelAdmin):
    list_display = ("created_at", "tenant", "actor", "action", "target_id")
    readonly_fields = ("created_at", "tenant", "actor", "action", "target_id", "request_id")

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


class CapabilityAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


platform_admin = PlatformAdmin(name="platform-admin")
class PlatformUserAdmin(PlatformModelAdmin, UserAdmin):
    def has_view_permission(self, request, obj=None):
        return can_manage_platform(request.user)


platform_admin.register(get_user_model(), PlatformUserAdmin)
platform_admin.register([BusinessType, Tenant, Domain, Role, Membership], PlatformModelAdmin)
platform_admin.register(Capability, CapabilityAdmin)
platform_admin.register(Website, WebsiteAdmin)
platform_admin.register(AuditEvent, AuditAdmin)


class LandingPageAdmin(PlatformModelAdmin):
    fields = ("hostname", "business_type", "draft_title", "draft_description", "draft_pricing")
    list_display = ("hostname", "business_type", "published_at")
    actions = ("publish_saved_drafts",)

    @admin.action(permissions=["change"], description="Publish selected landing page drafts")
    def publish_saved_drafts(self, request, queryset):
        count = queryset.update(
            published_title=F("draft_title"),
            published_description=F("draft_description"),
            published_pricing=F("draft_pricing"),
            published_at=timezone.now(),
        )
        self.message_user(request, f"Published {count} landing page(s).")


platform_admin.register(LandingPage, LandingPageAdmin)
