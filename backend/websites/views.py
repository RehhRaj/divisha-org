from django import forms
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_http_methods

from kernel.policy import (
    EDIT_SITE, PUBLISH_SITE, TenantContext, accessible_tenant_ids, allowed,
)
from tenancy.models import Tenant

from .models import Website
from .registry import template_choices
from .services import read_site, update_site


class DraftForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        business_type = self.instance.tenant.business_type.slug
        self.fields["template"].choices = template_choices(business_type)

        offering_labels = {
            "restau": "Menu items",
            "edu": "Programmes",
            "tour": "Tour packages",
        }
        offering_help = {
            "restau": "Enter one menu item per line. Example: Paneer Tikka | ₹240.",
            "edu": "Enter one programme per line. Example: Class 6 admissions | Open from 1 August.",
            "tour": "Enter one package per line. Example: Manali Weekend | 3 days, 2 nights.",
        }

        offerings_field = self.fields["draft_offerings"]
        offerings_field.label = offering_labels.get(business_type, "Offerings")
        offerings_field.help_text = offering_help.get(
            business_type,
            "Enter one offering per line. Add an optional detail after |.",
        )






        self.fields["draft_hours"].label = "Opening hours"
        self.fields["draft_contact"].label = "Address and contact details"
        self.fields["draft_contact"].help_text = "Put each phone number or email address on its own line to make it clickable."

    class Meta:
        model = Website
        fields = ["draft_title", "draft_description", "template", "draft_offerings", "draft_hours", "draft_contact"]


@login_required
def panel_index(request):
    tenants = Tenant.objects.filter(pk__in=accessible_tenant_ids(request.user)).order_by("name")
    return render(request, "websites/index.html", {"tenants": tenants})


@login_required
@require_http_methods(["GET", "POST"])
def panel(request, slug):
    tenant = get_object_or_404(
        Tenant, slug=slug, pk__in=accessible_tenant_ids(request.user),
    )
    context = TenantContext(tenant.pk, request.user.pk, request.request_id)
    site = read_site(context)
    form = DraftForm(instance=site)
    if request.method == "POST":
        if request.POST.get("action") == "publish":
            update_site(context, PUBLISH_SITE)
            return redirect("tenant-panel", slug=slug)
        fields = request.POST.copy()
        if "template" not in fields:
            fields["template"] = site.template
        for field in ("draft_offerings", "draft_hours", "draft_contact"):
            if field not in fields:
                fields[field] = getattr(site, field)
        form = DraftForm(fields, instance=site)
        if form.is_valid():
            for field in ("template", "draft_offerings", "draft_hours", "draft_contact"):
                if field not in request.POST:
                    form.cleaned_data.pop(field)
            update_site(context, EDIT_SITE, form.cleaned_data)
            return redirect("tenant-panel", slug=slug)
    return render(request, "websites/panel.html", {
        "tenant": tenant, "form": form, "site": site,
        "can_edit": allowed(context, EDIT_SITE),
        "can_publish": allowed(context, PUBLISH_SITE),
    })
