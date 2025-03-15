from django.urls import include,path
from .import views
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from .views import (
    get_councils, get_council_detail, get_clubs, create_council, delete_council,
    clubs_by_council_crud, club_crud, get_club_by_name, AddMemberView, 
    RemoveMemberView, EditMemberView, get_user_profile, FeedbackView, 
    update_club, delete_club, google_auth_url, google_callback, check_auth, logout,
    ProjectListCreateView, ProjectDetailView, 
    # UploadProjectImagesView  # Added project views
)

urlpatterns = [
    # Councils
    path("api/councils/", get_councils, name="get_councils"),
    path("api/councils/<str:council_name>/", get_council_detail, name="get_council_detail"),
    path("api/councils/create/", create_council, name="create_council"),
    path("api/councils/<int:council_id>/delete/", delete_council, name="delete_council"),

    # Clubs
    path("api/clubs/", get_clubs, name="get_clubs"),
    path("api/clubs/<str:club_name>/", get_club_by_name, name="club-detail"),
    path("api/clubs/<str:club_name>/update/", update_club, name="update_club"),
    path("api/clubs/<str:club_name>/delete/", delete_club, name="delete_club"),
    path("api/clubs/<str:club_name>/rename/", delete_club, name="delete_club"),
    path("api/councils/<str:council_name>/clubs/", clubs_by_council_crud, name="clubs_by_council"),
    path("api/councils/<str:council_name>/clubs/<int:club_id>/", club_crud, name="club_crud"),
    path("api/clubs/<int:club_id>/add-member/", AddMemberView.as_view(), name="add-member"),
    path("api/clubs/<int:club_id>/edit-member/<int:user_id>/", EditMemberView.as_view(), name="edit-member"),
    path("api/clubs/<int:club_id>/remove-member/<int:user_id>/", RemoveMemberView.as_view(), name="remove-member"),
    path('api/clubs/user-head/<str:email>/', views.user_head_clubs, name='user-head-clubs'),

    # Projects (Newly Added)
    path("api/clubs/<int:club_id>/projects/", ProjectListCreateView.as_view(), name="club-projects"),  # Get/Create projects for a club
    # path("api/projects/<int:pk>/", ProjectDetailView.as_view(), name="project-detail"),  # Retrieve, update, delete project
    path('api/clubs/<int:club_id>/projects/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),

    # path("api/projects/<int:project_id>/upload-images/", UploadProjectImagesView.as_view(), name="upload-project-images"),  # Upload multiple images for a project

    # Google Authentication
    path('api/auth/google/url/', google_auth_url, name='google_auth_url'),
    path('api/auth/google/callback/', google_callback, name='google_callback'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/profile/', get_user_profile, name='user_profile'),
    path('api/auth/check/', check_auth, name='auth_check'),
    path('api/auth/logout/', logout, name='logout'),

    # Feedback
    path('api/feedback/', FeedbackView.as_view(), name='feedback'),
    path('api/', include('election.urls')),
]
