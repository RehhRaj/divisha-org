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
