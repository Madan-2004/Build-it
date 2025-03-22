from django.urls import include,path
from .import views
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from .views import (
    get_councils, get_council_detail, get_clubs, create_council, delete_council,
    clubs_by_council_crud, club_crud, get_club_by_name, AddMemberView, 
    RemoveMemberView, EditMemberView, get_user_profile, FeedbackView, CustomTokenRefreshView,
    update_club, delete_club, google_auth_url, google_callback, check_auth, logout,
    ProjectListCreateView, ProjectDetailView, CouncilHeadDetailView,CouncilHeadListCreateView,InventoryDetailView
    ,InventoryListCreateView,CouncilInventoryView, get_inventory, create_inventory, add_inventory_item, update_inventory_item, delete_inventory
    # UploadProjectImagesView  # Added project views
)

urlpatterns = [
    # Councils
    path("api/councils/", get_councils, name="get_councils"),
    path("api/councils/<str:council_name>/", get_council_detail, name="get_council_detail"),
    path("api/councils/create/", create_council, name="create_council"),
    path("api/councils/<int:council_id>/delete/", delete_council, name="delete_council"),
    path("api/councils/<str:council_name>/inventory/", CouncilInventoryView.as_view(), name="council-inventory"),

    # Clubs
    path("api/clubs/", get_clubs, name="get_clubs"),
    path("api/clubs/<str:club_name>/", get_club_by_name, name="club-detail"),
    path("api/clubs/<str:club_name>/update/", update_club, name="update_club"),
    path('api/councils/<str:council_name>/clubs/<int:club_id>/',views.delete_club,name='delete_club'),
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
    # Project Inventory URLs
    path('inventory/<int:project_id>/', get_inventory, name='get_inventory'),
    path('api/inventory/<int:project_id>/create/', create_inventory, name='create_inventory'),
    path('api/inventory/<int:project_id>/add-item/', add_inventory_item, name='add_inventory_item'),
    path('api/inventory/<int:project_id>/update-item/<int:item_id>/', update_inventory_item, name='update_inventory_item'),
    path('api/inventory/<int:project_id>/delete/', delete_inventory, name='delete_inventory'),


    # Google Authentication
    path('api/auth/google/url/', google_auth_url, name='google_auth_url'),
    path('api/auth/google/callback/', google_callback, name='google_callback'),
    path('api/auth/token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    # path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/profile/', get_user_profile, name='user_profile'),
    path('api/auth/check/', check_auth, name='auth_check'),
    path('api/auth/logout/', logout, name='logout'),
    path('api/token/info/', views.token_info, name='token_info'),

    # Feedback
    path('api/feedback/', FeedbackView.as_view(), name='feedback'),
    # path('api/', include('election.urls')),

    #testing
    path('auth/check/', views.check_auth_status, name="check-auth"),
    path('api/user-profile/', get_user_profile, name='user-profile'),

    #council heads
    path("api/council-heads/", CouncilHeadListCreateView.as_view(), name="council-heads-list-create"),
    path("api/council-heads/<int:pk>/", CouncilHeadDetailView.as_view(), name="council-heads-detail"),

    # Inventory Management
    # List/Create inventory for a club
   path("api/clubs/<str:club_name>/inventory/", InventoryListCreateView.as_view(), name="club-inventory"),

    # Retrieve, update, or delete specific inventory item
   path("api/clubs/<int:club_id>/inventory/<int:pk>/", InventoryDetailView.as_view(), name="inventory-detail"),

]
