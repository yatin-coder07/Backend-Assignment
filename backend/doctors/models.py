from django.db import models
from django.conf import settings

class Doctor(models.Model):
     user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
     name = models.CharField(max_length=100)
     specialization = models.CharField(max_length=100)