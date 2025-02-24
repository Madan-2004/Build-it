from django.urls import path
from .views import (
    get_councils,
    get_council_detail,
    get_clubs,
    create_council,
    delete_council,
    clubs_by_council_crud,
    club_crud,
    get_club_by_name
)

urlpatterns = [
    # Councils
    path("api/councils/", get_councils, name="get_councils"),  # Get all councils
    path("api/councils/<str:council_name>/", get_council_detail, name="get_council_detail"),  # Get single council
    path("api/councils/create/", create_council, name="create_council"),  # Create council
    path("api/councils/<int:council_id>/delete/", delete_council, name="delete_council"),  # Delete council

    # Clubs
    path("api/clubs/", get_clubs, name="get_clubs"),  # Get all clubs
    path("api/clubs/<str:club_name>/", get_club_by_name, name="club-detail"),
    path("api/councils/<str:council_name>/clubs/", clubs_by_council_crud, name="clubs_by_council"),  # Clubs under a specific council
    path("api/councils/<str:council_name>/clubs/<int:club_id>/", club_crud, name="club_crud"),  # CRUD for individual clubs
]
