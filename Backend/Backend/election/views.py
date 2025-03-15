from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Election, Candidate, Vote
import re


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_elections(request):
    elections = Election.objects.all().values("id", "title", "start_date", "end_date")
    return Response(list(elections))


@api_view("GET")
@permission_classes([IsAuthenticated])
def get_candidates_for_student(request, election_id):
    user = request.user

    # Extract the email prefix
    email_prefix = user.email.split("@")[0]

    # Regex pattern to match student email format (branch + year pattern)
    student_pattern = r"^([a-zA-Z]+)(\d{2})\d+$"
    match = re.match(student_pattern, email_prefix)

    if not match:
        return Response({"error": "Only students can vote"}, status=403)
    
    branch,year=match.groups()
    
    year=int(year)
    
    candidates=Candidate.objects.filter(
        election_id=election_id,
        eligible_years__contains=year,
        eligible_branches__contains=branch.upper()
    )
    
    candidate_data=[{"id":c.id,"name":c.name,"position":c.position} for c in candidates]
    return Response(candidate_data)
