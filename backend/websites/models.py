from django.core.exceptions import ValidationError
from django.core.validators import validate_domain_name
from django.db import models

from .registry import TEMPLATE_CHOICES, template_choices


class Website(models.Model):
    tenant = models.OneToOneField("tenancy.Tenant", on_delete=models.CASCADE)
    template = models.CharField(max_length=50, choices=TEMPLATE_CHOICES)
    draft_title = models.CharField(max_length=150)
    draft_description = models.TextField(max_length=3000)
    draft_offerings = models.TextField(blank=True, max_length=6000)
    published_offerings = models.TextField(blank=True, editable=False)
    draft_hours = models.TextField(blank=True, max_length=500)
    published_hours = models.TextField(blank=True, editable=False)
    draft_contact = models.TextField(blank=True, max_length=500)
    published_contact = models.TextField(blank=True, editable=False)
    published_template = models.CharField(max_length=50, choices=TEMPLATE_CHOICES, blank=True, editable=False)
    published_title = models.CharField(max_length=150, blank=True, editable=False)
    published_description = models.TextField(blank=True, editable=False)
    published_at = models.DateTimeField(null=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if any(
            not name.strip() or (separator and not detail.strip())
            for line in self.draft_offerings.splitlines() if line.strip()
            for name, separator, detail in [line.partition("|")]
        ):
            raise ValidationError({"draft_offerings": "Enter a name and, after |, a price or detail."})
        if self.tenant_id and self.template:
            choices = dict(template_choices(self.tenant.business_type.slug))
            if self.template not in choices:
                raise ValidationError({"template": "Choose a template for this business type."})

    def __str__(self):
        return str(self.tenant)


class LandingPage(models.Model):
    hostname = models.CharField(max_length=253, unique=True, help_text="Production hostname without a port.")
    business_type = models.OneToOneField(
        "tenancy.BusinessType", on_delete=models.PROTECT, null=True, blank=True,
    )
    draft_title = models.CharField(max_length=150)
    draft_description = models.TextField(max_length=3000)
    draft_pricing = models.TextField(max_length=3000, blank=True)
    published_title = models.CharField(max_length=150, editable=False)
    published_description = models.TextField(editable=False)
    published_pricing = models.TextField(editable=False)
    published_at = models.DateTimeField(null=True, editable=False)

    def clean(self):
        self.hostname = self.hostname.strip().lower().removesuffix(".")
        validate_domain_name(self.hostname)

    def __str__(self):
        return self.hostname
