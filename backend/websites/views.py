from django import forms
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_http_methods

from kernel.policy import (
    EDIT_SITE, PUBLISH_SITE, TenantContext, accessible_tenant_ids, allowed,
)
from tenancy.models import Tenant

from .models import Website
from .services import read_site, update_site


class DraftForm(forms.ModelForm):
    class Meta:
        model = Website
        fields = ["draft_title", "draft_description"]


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
        form = DraftForm(request.POST, instance=site)
        if form.is_valid():
            update_site(context, EDIT_SITE, form.cleaned_data)
            return redirect("tenant-panel", slug=slug)
    return render(request, "websites/panel.html", {
        "tenant": tenant, "form": form, "site": site,
        "can_edit": allowed(context, EDIT_SITE),
        "can_publish": allowed(context, PUBLISH_SITE),
    })
