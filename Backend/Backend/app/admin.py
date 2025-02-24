from django.contrib import admin
from .models import Council, Club,User,ClubMembership  # Import your models


# Alternative way to register models
admin.site.register(Council)
admin.site.register(Club)
admin.site.register(User)
admin.site.register(ClubMembership)
