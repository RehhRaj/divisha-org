from django.core.validators import validate_domain_name
from django.db import models

from .registry import TEMPLATE_CHOICES


class Website(models.Model):
    tenant = models.OneToOneField("tenancy.Tenant", on_delete=models.CASCADE)
    template = models.CharField(max_length=50, choices=TEMPLATE_CHOICES)
    draft_title = models.CharField(max_length=150)
    draft_description = models.TextField(max_length=3000)
    published_template = models.CharField(max_length=50, choices=TEMPLATE_CHOICES, blank=True, editable=False)
    published_title = models.CharField(max_length=150, blank=True, editable=False)
    published_description = models.TextField(blank=True, editable=False)
    published_at = models.DateTimeField(null=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

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
