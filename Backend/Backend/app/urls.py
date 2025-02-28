from django.urls import path
from .views import google_login
from rest_framework_simplejwt.views import TokenRefreshView,TokenVerifyView
from .views import (
    get_councils,
    get_council_detail,
    get_clubs,
    create_council,
    delete_council,
    clubs_by_council_crud,
    club_crud,
    get_club_by_name
    , AddMemberView, RemoveMemberView, EditMemberView,get_user_profile
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
    path("api/clubs/<int:club_id>/add-member/", AddMemberView.as_view(), name="add-member"),
    path("api/clubs/<int:club_id>/edit-member/<int:user_id>/", EditMemberView.as_view(), name="edit-member"),
    path("api/clubs/<int:club_id>/remove-member/<int:user_id>/", RemoveMemberView.as_view(), name="remove-member"),

    #google
    path('api/auth/google/', google_login, name='google_login'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/auth/profile/', get_user_profile, name='user_profile'),
]
