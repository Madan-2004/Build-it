from django.urls import path
from .views import (
    get_elections,# create_election, update_election, 
    # get_candidates_for_student, cast_vote
)

urlpatterns = [
    path('elections/', get_elections, name='get_elections'),  # Get all elections
    # path('elections/create/', create_election, name='create_election'),  # Create an election (Admin only)
    # path('elections/<int:election_id>/update/', update_election, name='update_election'),  # Update election
    # path('elections/<int:election_id>/candidates/', get_candidates_for_student, name='get_candidates_for_student'),  # Get candidates
    # path('elections/<int:election_id>/vote/', cast_vote, name='cast_vote'),  # Cast a vote
]
