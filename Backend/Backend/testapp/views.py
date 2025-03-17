from rest_framework import viewsets, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from .models import Election, Candidate, Vote, Position
from .serializers import (
    ElectionSerializer, PositionSerializer, CandidateSerializer,
    VoteSerializer, ElectionResultSerializer
)

# ✅ **Election Management**
class ElectionViewSet(viewsets.ModelViewSet):
    queryset = Election.objects.all()
    serializer_class = ElectionSerializer
    permission_classes = [IsAuthenticated]  # ✅ Restore authentication

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)  # ✅ Restore user assignment

    @action(detail=True, methods=['get'])
    def results(self, request, pk=None):
        """Fetch election results"""
        election = self.get_object()
        serializer = ElectionResultSerializer(election)
        return Response(serializer.data)
    def get_serializer_context(self):
        """Pass request to serializer to check if the user has voted."""
        context = super().get_serializer_context()
        context["request"] = self.request  # ✅ Pass request
        return context

# ✅ **Position Management**
class PositionViewSet(viewsets.ModelViewSet):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer
    permission_classes = []  # 🔥 Removed authentication

    def get_queryset(self):
        election_id = self.kwargs.get('election_pk')
        print("1", election_id)  # Print election_id from URL
        if election_id:
            return Position.objects.filter(election_id=election_id)
        return super().get_queryset()

    def perform_update(self, serializer):
        election_id = self.kwargs.get('election_pk')
        position_id = self.kwargs.get('pk')
        if not election_id or not position_id:
            raise serializers.ValidationError("Both Election ID and Position ID are required to update a position.")
        
        position = self.get_object()
        if position.election.id != int(election_id) or position.id != int(position_id):
            raise serializers.ValidationError("Election ID or Position ID mismatch.")
        
        serializer.save()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        position = self.get_object()
        self.perform_destroy(position)
        return Response(status=status.HTTP_204_NO_CONTENT)   

# ✅ **Candidate Management**
class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
    permission_classes = [IsAuthenticated]  # 🔥 Removed authentication
    
    def get_queryset(self):
        position_id = self.kwargs.get('position_pk')
        if position_id:
            return Candidate.objects.filter(position_id=position_id)
        return super().get_queryset()
    
    def perform_create(self, serializer):
        position_id = self.kwargs.get('position_pk')
        position = get_object_or_404(Position, pk=position_id)
        
        name = self.request.data.get('name', None)
        roll_no = self.request.data.get('roll_no')
        # email = self.request.data.get('email')
        if not name or not roll_no:
            raise ValidationError("Candidate name and roll number are required.")
            
        # ✅ Check if the candidate is already registered for the same position in the same election
        if Candidate.objects.filter(
            roll_no=roll_no,
            position=position
        ).exists():
            raise ValidationError("This candidate is already registered for this position in this election.")
            
        # ✅ Check if the candidate is already registered for another position in the same election
        existing_candidate = Candidate.objects.filter(
        roll_no=roll_no,
        position__election=position.election
        ).exclude(position=position).first()  # ✅ Correct

            
        if existing_candidate:
            raise ValidationError(f"This candidate is already registered for {existing_candidate.position.title} in this election.")
            
        # Save the candidate
        serializer.save(position=position)

    def perform_update(self, serializer):
        """Ensure candidate updates maintain the correct position"""
        candidate = self.get_object()
        position_id = self.kwargs.get('position_pk')
        roll_no = self.request.data.get('roll_no')
        # email = self.request.data.get('email')
        
        # Ensure the position of the candidate is not being changed
        if position_id and candidate.position.id != int(position_id):
            raise ValidationError("Position cannot be changed for a candidate.")
            
        if roll_no and roll_no != candidate.roll_no:
            # Check if the roll number is already used by another candidate for the same position
            if Candidate.objects.filter(
                roll_no=roll_no, 
                position=candidate.position
            ).exclude(pk=candidate.pk).exists():
                raise ValidationError("A candidate with this roll number already exists for this position.")
                
            # Check if the roll number is already used by another candidate for a different position in the same election
            if Candidate.objects.filter(
                roll_no=roll_no,
                position__election=candidate.position.election
            ).exclude(position=candidate.position).exclude(pk=candidate.pk).exists():
                raise ValidationError("This candidate is already registered for another position in this election.")

        
        serializer.save()
    
    def destroy(self, request, *args, **kwargs):
        """Delete a candidate"""
        candidate = self.get_object()
        self.perform_destroy(candidate)
        return Response({"message": "Candidate deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        
    @action(detail=True, methods=['get'])
    def list_candidates(self, request, election_pk, position_pk):
        candidates = self.get_queryset()
        serializer = self.get_serializer(candidates, many=True)
        return Response(serializer.data)

#✅ **Vote Handling**
class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = [IsAuthenticated]  # ✅ Require login
    def get_queryset(self):
        """
        Returns votes, optionally filtered by election.
        Example: /api/votes/?election_id=3
        """
        queryset = Vote.objects.select_related('candidate__position__election').all()  # ✅ Optimize queries
        election_id = self.request.query_params.get('election_id')

        if election_id:
            queryset = queryset.filter(candidate__position__election__id=election_id)  # ✅ Filter votes by election

        return queryset
    # def create(self, request, *args, **kwargs):
    #     """
    #     Custom vote submission logic
    #     """
    #     votes_data = request.data
    #     if not isinstance(votes_data, list):
    #         return Response({"error": "Expected a list of votes"}, status=status.HTTP_400_BAD_REQUEST)

    #     voter = request.user  # ✅ Ensure voter is logged in

    #     created_votes = []
    #     for vote_data in votes_data:
    #         candidate_id = vote_data.get("candidate")
    #         candidate = get_object_or_404(Candidate, id=candidate_id)

    #         # ✅ Prevent duplicate votes
    #         if Vote.objects.filter(voter=voter, candidate=candidate).exists():
    #             return Response({"error": "You have already voted for this candidate."}, status=status.HTTP_400_BAD_REQUEST)

    #         # ✅ Create the vote
    #         vote = Vote.objects.create(voter=voter, candidate=candidate)
    #         created_votes.append(VoteSerializer(vote).data)

    #     return Response(created_votes, status=status.HTTP_201_CREATED)
    def create(self, request, *args, **kwargs):
        """
        Custom vote submission logic
        """
        votes_data = request.data
        if not isinstance(votes_data, list):
            return Response({"error": "Expected a list of votes"}, status=status.HTTP_400_BAD_REQUEST)

        voter = request.user  # ✅ Ensure voter is logged in
        created_votes = []

        for vote_data in votes_data:
            candidate_id = vote_data.get("candidate")
            candidate = get_object_or_404(Candidate, id=candidate_id)

            # ✅ Determine position and election
            position = candidate.position
            election = position.election  
            # ✅ Ensure the election is active
            now = timezone.now()+ timedelta(hours=5, minutes=30)# Adjusting to IST
            # print("active elction", election.start_date, election.end_date, now)
            if not (election.start_date <= now <= election.end_date):
                return Response({"error": f"Election '{election.title}' is not active."}, 
                               status=status.HTTP_400_BAD_REQUEST)

            # ✅ Prevent duplicate votes for the same position
            if Vote.objects.filter(voter=voter, candidate__position=position).exists():
                return Response({"error": f"You have already voted for {position.title}."}, status=status.HTTP_400_BAD_REQUEST)
            # # Group votes by election to enforce election-level constraints for future use
            # election_votes = {}
            # # ✅ Track votes by election to enforce maximum votes per election
            # if election.id not in election_votes:
            #     election_votes[election.id] = []
            # election_votes[election.id].append(candidate)
            
            # # ✅ Check if voter has exceeded maximum votes for this position
            # position_votes = Vote.objects.filter(
            #     voter=voter, 
            #     candidate__position=position
            # ).count()
            
            # if position_votes >= position.max_votes_per_voter:
            #     return Response(
            #         {"error": f"You have already cast the maximum number of votes ({position.max_votes_per_voter}) for {position.title}."},
            #         status=status.HTTP_400_BAD_REQUEST
            #     )

            # ✅ Create the vote
            vote = Vote.objects.create(voter=voter, candidate=candidate)
            created_votes.append(VoteSerializer(vote).data)

        return Response(created_votes, status=status.HTTP_201_CREATED)

from django.utils import timezone
from django.db.models.functions import TruncMonth
from django.db.models import Count
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

from .models import Election, Position, Candidate, Vote
from datetime import timedelta
class AdminDashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]  # 🔥authentication

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get overall election statistics including hourly and monthly vote trends"""
        #change this to env file not isstaff
        if not request.user.is_staff and not Election.objects.filter(created_by=request.user).exists():
            return Response({"error": "You do not have permission to view dashboard statistics."}, 
                           status=status.HTTP_403_FORBIDDEN)

        now = timezone.now()

        # ✅ Get overall statistics
        total_elections = Election.objects.count()
        active_elections = Election.objects.filter(start_date__lte=now, end_date__gte=now).count()
        completed_elections = Election.objects.filter(end_date__lt=now).count()
        upcoming_elections = Election.objects.filter(start_date__gt=now).count()
        total_positions = Position.objects.count()
        total_candidates = Candidate.objects.filter(approved=True).count()
        total_votes = Vote.objects.count()

        # ✅ Generate Monthly Voting Trend
        monthly_votes = {}
        for i in range(6):  # Last 6 months
            month = now - timedelta(days=30 * i)
            month_label = month.strftime('%b %Y')
            vote_count = Vote.objects.filter(timestamp__year=month.year, timestamp__month=month.month).count()
            monthly_votes[month_label] = vote_count

        # ✅ Generate Hourly Voting Trend for the Last 24 Hours
        hourly_votes = {}
        last_24_hours = now - timezone.timedelta(hours=24)
        for i in range(24):  # Last 24 hours
            hour = last_24_hours + timezone.timedelta(hours=i)
            hour_label = hour.strftime('%I %p')  # e.g., "10 AM"
            vote_count = Vote.objects.filter(timestamp__hour=hour.hour, timestamp__date=hour.date()).count()
            hourly_votes[hour_label] = vote_count

        return Response({
            "total_elections": total_elections,
            "active_elections": active_elections,
            "completed_elections": completed_elections,
            "upcoming_elections": upcoming_elections,
            "total_positions": total_positions,
            "total_candidates": total_candidates,
            "total_votes": total_votes,
            "voting_trend": {
                "months": list(monthly_votes.keys())[::-1],  # Reverse order for correct display
                "vote_counts": list(monthly_votes.values())[::-1],
                "hours": list(hourly_votes.keys()),
                "hourly_vote_counts": list(hourly_votes.values())
            }
        })
    #for future use
    @action(detail=False, methods=['get'])
    def fraud_detection(self, request):
        """Detect potential voting fraud patterns"""
        # ✅ Only allow admin access
        if not request.user.is_staff:
            return Response({"error": "You do not have permission to access fraud detection."}, 
                           status=status.HTTP_403_FORBIDDEN)
            
        # Find rapid voting patterns (multiple votes in short time)
        rapid_voters = Vote.objects.values('voter__username').annotate(
            vote_count=Count('id')
        ).filter(vote_count__gt=5)  # Users who voted more than 5 times
        
        # Find any unusual voting patterns
        unusual_patterns = []
        
        return Response({
            "rapid_voters": list(rapid_voters),
            "unusual_patterns": unusual_patterns,
            "status": "Fraud detection complete"
        })