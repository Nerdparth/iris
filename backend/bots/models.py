from django.db import models
from organisation_api.models import Organisation
import uuid

class Bot(models.Model):
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE)
    bot_name = models.TextField()
    bot_description = models.TextField()
    color_1 = models.CharField(max_length=7, default="#6228d7")
    color_2 = models.CharField(max_length=7, default="#ff00ee")
    text_color = models.CharField(max_length=7, default="#ffffff")
    uuid = models.UUIDField(default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    