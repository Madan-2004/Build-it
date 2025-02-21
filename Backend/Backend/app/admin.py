from django.contrib import admin
from .models import Council, Club  # Import your models


# Alternative way to register models
admin.site.register(Council)
admin.site.register(Club)
