from rest_framework import permissions
from ..election.models import Vote
from django.utils import timezone


# ✅ **Admin Only Permission**
class IsAdminUser(permissions.BasePermission):
    """
    Custom permission to allow only admins to perform actions.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.profile.is_admin


# ✅ **Can Vote in Election**
class CanVoteInElection(permissions.BasePermission):
    """
    Permission to check if the user is eligible to vote in the given election.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False  # User must be logged in
        
        if request.method == "POST":
            # Extract candidate from request data
            candidate_id = request.data.get("candidate")
            if not candidate_id:
                return False  # Candidate ID is required
            
            from ..election.models import Candidate
            candidate = Candidate.objects.filter(id=candidate_id).first()
            if not candidate:
                return False  # Candidate does not exist
            
            election = candidate.position.election

            # Check if election is active
            now = timezone.now()
            if now < election.start_date or now > election.end_date:
                return False  # Election is not active

            # Ensure user has not exceeded voting limit
            position = candidate.position
            existing_votes = Vote.objects.filter(
                voter=request.user,
                candidate__position=position
            ).count()

            return existing_votes < position.max_votes_per_voter  # Allow voting if limit is not exceeded

        return True  # Allow GET requests
