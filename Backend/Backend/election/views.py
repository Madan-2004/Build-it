from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Election, Candidate, Vote
import re


@api_view(["GET"])
@permission_classes([AllowAny])
def get_elections(request):
    elections = Election.objects.all().values("id", "title", "start_date", "end_date")
    return Response(list(elections))


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_candidates_for_student(request, election_id):
    user = request.user

    email_prefix = user.email.split("@")[0]

    # Regex pattern to match student email format (branch + year pattern)
    student_pattern = r"^([a-zA-Z]+)(\d{2})\d+$"
    match = re.match(student_pattern, email_prefix)

    if not match:
        return Response({"error": "Only students can view candidates"}, status=403)

    branch, year = match.groups()  # Extract branch and year
    year = int(year)  # Convert year to integer for filtering

    if Vote.objects.filter(user=user, election_id=election_id).exists():
        return Response(
            {"message": "You have already voted in this election."}, status=403
        )

    candidates = Candidate.objects.filter(
        election_id=election_id,
        eligible_years__contains=year,
        eligible_branches__contains=branch.upper(),
    )

    candidate_data = [
        {"id": c.id, "name": c.name, "position": c.position} for c in candidates
    ]

    return Response(candidate_data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cast_vote(request, election_id):
    user = request.user  # Authenticated user
    
    email_prefix = user.email.split('@')[0]
    student_pattern = r"^([a-zA-Z]+)(\d{2})\d+$"
    match = re.match(student_pattern, email_prefix)

    if not match:
        return Response({"error": "Only students can vote"}, status=403)

    branch, year = match.groups()
    year = int(year)  # Convert year to integer

    try:
        election = Election.objects.get(id=election_id)
    except Election.DoesNotExist:
        return Response({"error": "Election not found"}, status=404)

    votes_data = request.data.get("votes", [])  # Expecting an array of votes
    if not isinstance(votes_data, list) or len(votes_data) == 0:
        return Response({"error": "Invalid vote data format"}, status=400)

    votes_to_save = []
    voted_positions = set()

    for vote_item in votes_data:
        role = vote_item.get("role")
        candidate_id = vote_item.get("candidate_id")

        if not role or not candidate_id:
            return Response({"error": "Each vote must include a role and candidate_id"}, status=400)

        try:
            candidate = Candidate.objects.get(id=candidate_id, election=election, position=role)
        except Candidate.DoesNotExist:
            return Response({"error": f"Candidate {candidate_id} for role {role} not found"}, status=404)

        if year not in candidate.eligible_years or branch.upper() not in candidate.eligible_branches:
            return Response({"error": f"You are not eligible to vote for {candidate.name} in {role}"}, status=403)

        if role in voted_positions:
            return Response({"error": f"Duplicate vote detected for role {role}"}, status=400)

        if Vote.objects.filter(user=user, election=election, candidate__position=role).exists():
            return Response({"error": f"You have already voted for {role}"}, status=403)

        votes_to_save.append(Vote(user=user, election=election, candidate=candidate))
        voted_positions.add(role)

    Vote.objects.bulk_create(votes_to_save)

    return Response({"message": "Votes cast successfully"})
