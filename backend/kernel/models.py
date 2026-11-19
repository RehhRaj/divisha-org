from django.conf import settings
from django.db import models


class Capability(models.Model):
    code = models.CharField(max_length=80, unique=True)

    def __str__(self):
        return self.code


class Role(models.Model):
    tenant = models.ForeignKey("tenancy.Tenant", on_delete=models.CASCADE)
    name = models.CharField(max_length=80)
    capabilities = models.ManyToManyField(Capability, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["tenant", "name"], name="tenant_role_name"),
        ]

    def __str__(self):
        return f"{self.tenant} · {self.name}"


class Membership(models.Model):
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["role", "user"], name="user_role_membership"),
        ]

    def __str__(self):
        return f"{self.user} · {self.role}"


class AuditEvent(models.Model):
    tenant = models.ForeignKey("tenancy.Tenant", on_delete=models.PROTECT)
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL)
    action = models.CharField(max_length=80)
    target_id = models.PositiveBigIntegerField()
    request_id = models.UUIDField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.created_at} · {self.action}"
