from django.db import models


class BusinessType(models.Model):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Tenant(models.Model):
    business_type = models.ForeignKey(BusinessType, on_delete=models.PROTECT)
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=120)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Domain(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="domains")
    hostname = models.CharField(max_length=253, unique=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(models.functions.Lower("hostname"), name="domain_hostname_ci"),
        ]

    def clean(self):
        self.hostname = self.hostname.strip().lower().removesuffix(".")

    def __str__(self):
        return self.hostname
