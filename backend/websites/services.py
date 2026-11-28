from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone

from kernel.models import AuditEvent
from kernel.policy import EDIT_SITE, PUBLISH_SITE, VIEW_SITE, require

from .models import Website


def read_site(context):
    require(context, VIEW_SITE)
    return get_object_or_404(Website, tenant_id=context.tenant_id)


@transaction.atomic
def update_site(context, action, fields=None):
    require(context, action)
    site = get_object_or_404(
        Website.objects.select_for_update(), tenant_id=context.tenant_id,
    )


    if action == EDIT_SITE:
        site.draft_title = fields["draft_title"]
        site.draft_description = fields["draft_description"]
        site.template = fields.get("template", site.template)
        changes = ["draft_title", "draft_description", "template"]


        # for field in ("draft_offerings", "draft_hours", "draft_contact"):

        for field in ("draft_offerings", "draft_hours", "draft_contact",  "draft_favicon_url"):
            if field in fields:
                setattr(site, field, fields[field])
                changes.append(field)
    elif action == PUBLISH_SITE:
        site.published_template = site.template
        site.published_title = site.draft_title
        site.published_description = site.draft_description
        site.published_at = timezone.now()
        site.published_offerings = site.draft_offerings
        site.published_hours = site.draft_hours
        site.published_contact = site.draft_contact
        site.published_favicon_url = site.draft_favicon_url
        changes = [
            "published_template", "published_title", "published_description", "published_at",
            "published_offerings", "published_hours", "published_contact",
            "published_favicon_url",
        ]
    else:
        raise ValueError("Unsupported website action.")
    site.full_clean()
    site.save(update_fields=[*changes, "updated_at"])
    AuditEvent.objects.create(
        tenant_id=context.tenant_id, actor_id=context.actor_id, action=action,
        target_id=site.pk, request_id=context.request_id,
    )
