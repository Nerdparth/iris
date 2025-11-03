from django.db import models
from django.contrib.auth.models import User
import uuid

class Organisation(models.Model):
    INDUSTRY_OPTIONS = [("software", "software"), ("transport", "transport"), ("telecommunications", "telecommunications"), ("education", "education"), ("fitness", "fitness"), ("health", "health"), ("food&beverages", "food&beverages"), ("aggriculture", "aggriculture"), ("other", "other")]
    organisation_name = models.TextField()
    organisation_code = models.CharField(max_length=6, unique=True)
    industry = models.CharField(max_length=18, choices=INDUSTRY_OPTIONS)
    uuid = models.UUIDField(default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)


class OrganisationMember(models.Model):
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE)
    member = models.OneToOneField(User, on_delete=models.CASCADE)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
