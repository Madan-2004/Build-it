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
    permission_classes = []  # 🔥 Removed authentication

    def get_queryset(self):
        position_id = self.kwargs.get('position_pk')
        if position_id:
            return Candidate.objects.filter(position_id=position_id)
        return super().get_queryset()

    def perform_create(self, serializer):
        position_id = self.kwargs.get('position_pk')
        position = get_object_or_404(Position, pk=position_id)

        user = self.request.data.get('user', None)
        name = self.request.data.get('name', None)

        if user:
            serializer.save(position=position, user_id=user)
        elif name:
            serializer.save(position=position, name=name)
        else:
            raise ValidationError("Candidate must have either a user or a name.")

    @action(detail=True, methods=['get'])
    def list_candidates(self, request, election_pk, position_pk):
        candidates = self.get_queryset()
        serializer = self.get_serializer(candidates, many=True)
        return Response(serializer.data)
# ✅ **Vote Handling**


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

            # ✅ Determine election from candidate
            election = candidate.position.election  

            # ✅ Prevent duplicate votes for this election
            if Vote.objects.filter(voter=voter, candidate__position__election=election).exists():
                return Response({"error": "You have already voted in this election."}, status=status.HTTP_400_BAD_REQUEST)

            # ✅ Create the vote
            vote = Vote.objects.create(voter=voter, candidate=candidate)
            created_votes.append(VoteSerializer(vote).data)

        return Response(created_votes, status=status.HTTP_201_CREATED)

# ✅ **Fetch Election Stats (Admin Dashboard)**
class AdminDashboardViewSet(viewsets.ViewSet):
    permission_classes = []  # 🔥 Removed authentication

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get overall election statistics"""
        total_elections = Election.objects.count()
        active_elections = Election.objects.filter(start_date__lte=timezone.now(), end_date__gte=timezone.now()).count()
        total_positions = Position.objects.count()
        total_candidates = Candidate.objects.count()
        total_votes = Vote.objects.count()

        return Response({
            "total_elections": total_elections,
            "active_elections": active_elections,
            "total_positions": total_positions,
            "total_candidates": total_candidates,
            "total_votes": total_votes
        })
