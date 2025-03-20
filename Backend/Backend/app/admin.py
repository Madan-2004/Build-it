from django.contrib import admin
from .models import Council, Club,Users,ClubMembership,Project,ProjectImage,CouncilHead # Import your models


# Alternative way to register models
admin.site.register(Council)
admin.site.register(Club)
admin.site.register(Users)
admin.site.register(ClubMembership)
admin.site.register(Project)
admin.site.register(ProjectImage)
admin.site.register(CouncilHead)
