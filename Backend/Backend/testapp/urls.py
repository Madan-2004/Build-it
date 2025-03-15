from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ElectionViewSet, PositionViewSet, CandidateViewSet,
    VoteViewSet, AdminDashboardViewSet
)

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

    path('elections/<int:election_pk>/positions/<int:position_pk>/candidates/', CandidateViewSet.as_view({'get': 'list', 'post': 'create'}), name="candidate-list"),
]
