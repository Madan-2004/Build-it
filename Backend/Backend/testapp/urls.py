from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ElectionViewSet, PositionViewSet, CandidateViewSet,
    VoteViewSet, AdminDashboardViewSet,UploadVoterListView,VoterDetailsView
)
candidate_list = CandidateViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

candidate_detail = CandidateViewSet.as_view({
    'get': 'retrieve',   # 🔹 Fetch a single candidate
    'put': 'update',     # 🔹 Update a candidate
    'patch': 'partial_update',  # 🔹 Partial update (optional fields)
    'delete': 'destroy'  # 🔹 Delete a candidate
})

# Create router for standard ViewSets
router = DefaultRouter()
router.register(r'elections', ElectionViewSet)  # Standard route for elections
router.register(r'votes', VoteViewSet, basename="votes")  # Basename required for votes
router.register(r'admin/dashboard', AdminDashboardViewSet, basename="admin-dashboard")

# Define URL patterns
urlpatterns = [
    path('', include(router.urls)),  # Includes all ViewSets in `router`
    
    # Manually add a custom path for PositionViewSet under election
    path('elections/<int:election_pk>/positions/', PositionViewSet.as_view({'get': 'list', 'post': 'create'}), name="position-list"),
    path('elections/<int:election_pk>/positions/<int:pk>/', PositionViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name="position-detail"),

     # 🔹 List & Create Candidates (for a specific position in an election)
    path('elections/<int:election_pk>/positions/<int:position_pk>/candidates/', candidate_list, name="candidate-list"),

    # 🔹 Retrieve, Update, Delete Candidate (by ID)
    path('elections/<int:election_pk>/positions/<int:position_pk>/candidates/<int:pk>/', candidate_detail, name="candidate-detail"),
    path("upload-voter-list/", UploadVoterListView.as_view(), name="upload-voter-list"),
    path("voter-details/", VoterDetailsView.as_view(), name="voter-details"),
]
