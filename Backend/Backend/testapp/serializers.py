from rest_framework import serializers
from django.utils import timezone
from .models import Election, Position, Candidate, Vote
from django.utils import timezone
from django.utils.timezone import localtime
from datetime import timedelta
from .utils import decode_voter_email  # ✅ Import the decoding function


from rest_framework import serializers
from .models import Candidate

class CandidateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=True)  # Ensure name is always provided
    # name = serializers.CharField(required=False, allow_blank=True, allow_null=True)  # ✅ Fix here
    votes_count = serializers.SerializerMethodField()  # ✅ Compute votes dynamically
    roll_no = serializers.CharField(default="Unknown Roll No")  # ✅ Default roll number
    Department = serializers.CharField(default="CSE")  # ✅ Default Department
    degree = serializers.ChoiceField(choices=[("BTech", "BTech"), ("MTech", "MTech"), ("PHD", "PHD"),("MSC","MSC")], default="BTech")  # ✅ Degree choices

    class Meta:
        model = Candidate
        fields = ['id', 'position', 'name', 'roll_no', 'Department', 'degree', 'photo', 'approved', 'votes_count']
        read_only_fields = ['votes_count']

    # def get_votes_count(self, obj):
    #     return obj.votes.count()
    def get_votes_count(self, obj):
        return Vote.objects.filter(candidate=obj).count()


    def validate(self, data):
        if not data.get('name'):
            raise serializers.ValidationError("Candidate must have a name.")
        return data


class PositionSerializer(serializers.ModelSerializer):
    candidates = serializers.SerializerMethodField()  # ✅ Retrieve candidates manually
    batch_restriction = serializers.ListField(
        child=serializers.CharField(), required=False  # ✅ Store as a list
    )
    branch_restriction = serializers.ListField(
        child=serializers.CharField(), required=False  # ✅ Store as a list
    )
    degree_restriction = serializers.ListField(
        child=serializers.CharField(), required=False  # Store as a list
    )

    class Meta:
        model = Position
        fields = [
            'id', 'election', 'title', 'description',
             'batch_restriction', 'branch_restriction', 'degree_restriction', 'candidates'
        ]

    def get_candidates(self, obj):
        candidates = obj.candidates.filter(approved=True)
        candidates = sorted(
            candidates,
            key=lambda x: Vote.objects.filter(candidate=x).count(),
            reverse=True
        )
        return CandidateSerializer(candidates, many=True).data

    def validate_batch_restriction(self, value):
        """Ensure batch restriction is a list and contains valid choices"""
        valid_choices = ["All Batches", "1st Year", "2nd Year", "3rd Year", "4th Year"]
        if not all(batch in valid_choices for batch in value):
            raise serializers.ValidationError("Invalid batch selection.")
        return value

    def validate_branch_restriction(self, value):
        """Ensure Department restriction is a list and contains valid choices"""
        valid_choices = ["All Branches", "CSE", "MECH", "CIVIL", "EE", "EP", "SSE", "MEMS", "MC","CHE","MTech", "MSC", "PHD"]
        if not all(Department in valid_choices for Department in value):
            raise serializers.ValidationError("Invalid Department selection.")
        return value
    
    def validate_degree_restriction(self, value):
        """Ensure degree restriction is a list and contains valid choices"""
        valid_choices = ["B.Tech", "MTech", "MSC", "PHD"]
        if not all(degree in valid_choices for degree in value):
            raise serializers.ValidationError("Invalid degree selection.")
        return value


class ElectionSerializer(serializers.ModelSerializer):
    positions = PositionSerializer(many=True, read_only=True)
    is_active = serializers.SerializerMethodField()
    is_upcoming = serializers.SerializerMethodField()
    is_completed = serializers.SerializerMethodField()
    candidates_count = serializers.SerializerMethodField()
    votes_count = serializers.SerializerMethodField()
    has_voted = serializers.SerializerMethodField() 
    voter_files = serializers.SerializerMethodField()

    class Meta:
        model = Election
        fields = ['id', 'title', 'description', 'start_date', 'end_date', 'created_by',
                  'is_active', 'is_upcoming', 'is_completed', 'candidates_count', 'votes_count', 'positions', 'has_voted', 'display_results', 'display_election', 'voter_files']
        read_only_fields = ['created_by', 'is_active', 'is_upcoming', 'is_completed', 'candidates_count', 'votes_count', 'has_voted','voter_files']
    
    def get_has_voted(self, obj):
        """Check if the current user has voted in this election."""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Vote.objects.filter(voter=request.user, candidate__position__election=obj).exists()
        return False  # If not authenticated, assume they haven't voted
    

    def get_is_active(self, obj):
        now = timezone.now() + timedelta(hours=5, minutes=30)  # Current time in UTC
        start_date_local = localtime(obj.start_date)  # Convert start_date to local timezone (IST)
        end_date_local = localtime(obj.end_date)  # Convert end_date to local timezone (IST)
        print(obj.title)
        print(start_date_local)
        print(end_date_local)
        print(now)
        
        # Check if the current time is within the election time frame
        return start_date_local <= now <= end_date_local

    def get_is_upcoming(self, obj):
        now = timezone.now()+ timedelta(hours=5, minutes=30)  # Current time in UTC
        start_date_local = localtime(obj.start_date)  # Convert start_date to local timezone (IST)
        
        # Check if the election start time is still in the future
        return now < start_date_local

    def get_is_completed(self, obj):
        now = timezone.now()+ timedelta(hours=5, minutes=30)  # Current time in UTC
        end_date_local = localtime(obj.end_date)  # Convert end_date to local timezone (IST)
        
        # Check if the election end time has passed
        return now > end_date_local


    def get_candidates_count(self, obj):
        return sum(position.candidates.filter(approved=True).count() for position in obj.positions.all())


    def get_votes_count(self, obj):
        return Vote.objects.filter(candidate__position__election=obj).count()
    
    def get_voter_files(self, obj):
        # Return the voter file URLs if they exist
        voter_files = obj.voter_files.all()
        return [{'id': vf.id, 'file': vf.file.url} for vf in voter_files]



# class VoteSerializer(serializers.ModelSerializer):
#     voter_id = serializers.IntegerField(source='voter.id', read_only=True)
#     voter_email = serializers.EmailField(source='voter.email', read_only=True)  # ✅ Fetch voter's email
#     candidate_name = serializers.SerializerMethodField()  # ✅ Fetch candidate's name
#     election_id = serializers.SerializerMethodField()

#     class Meta:
#         model = Vote
#         fields = ['id','voter_id','voter_email', 'candidate', 'candidate_name','election_id', 'timestamp']  # ✅ Add candidate_name
#         read_only_fields = ['voter_email', 'candidate_name', 'election_id']

#     def get_candidate_name(self, obj):
#         """Returns the candidate's name directly since user is removed."""
#         return obj.candidate.name  # ✅ Use name directly
#     def get_election_id(self, obj):
#         """Returns the election ID of the vote"""
#         return obj.candidate.position.election.id
class VoteSerializer(serializers.ModelSerializer):
    voter_id = serializers.IntegerField(source='voter.id', read_only=True)
    voter_email = serializers.EmailField(source='voter.email', read_only=True)
    candidate_name = serializers.CharField(source='candidate.name', read_only=True)
    election_id = serializers.SerializerMethodField()  # ✅ Fetch election ID
    election_name = serializers.SerializerMethodField()  # ✅ Fetch election name
    position_title = serializers.CharField(source='candidate.position.title', read_only=True)

    class Meta:
        model = Vote
        fields = ['id', 'voter_id', 'voter_email', 'candidate', 'candidate_name', 'position_title', 'election_id', 'election_name', 'timestamp']
        read_only_fields = ['voter_email', 'candidate_name', 'election_id', 'election_name', 'position_title']

    def get_election_id(self, obj):
        """Returns the election ID of the vote"""
        return obj.candidate.position.election.id  # ✅ Fetch election ID

    def get_election_name(self, obj):
        """Returns the election name of the vote"""
        return obj.candidate.position.election.title  # ✅ Fetch election name
    def validate(self, data):
        """
        Validate voter's email to ensure they meet batch & Department restrictions.
        """
        voter = self.context['request'].user  # ✅ Get the voter
        voter_info = decode_voter_email(voter.email)  # ✅ Decode email

        # Ensure degree and Department match the election rules
        candidate = data['candidate']
        position = candidate.position

        # ✅ Restrict based on Department
        if position.branch_restriction and "All Branches" not in position.branch_restriction:
            if voter_info["Department"] not in position.branch_restriction:
                raise serializers.ValidationError(f"Only {', '.join(position.branch_restriction)} departments can vote for {position.title}.")

        # ✅ Restrict based on batch
        if position.batch_restriction and "All Batches" not in position.batch_restriction:
            if voter_info["status"] not in position.batch_restriction:
                raise serializers.ValidationError(f"Only {', '.join(position.batch_restriction)} batches can vote for {position.title}.")

        return data
    
class ElectionResultSerializer(serializers.ModelSerializer):
    positions = serializers.SerializerMethodField()

    class Meta:
        model = Election
        fields = ['id', 'title', 'description', 'start_date', 'end_date', 'positions']

    def get_positions(self, obj):
        positions = obj.positions.all()
        result = []

        for position in positions:
            candidates = position.candidates.filter(approved=True)
            candidates_data = []

            for candidate in candidates:
                votes_count = candidate.votes.count()
                candidates_data.append({
                    'id': candidate.id,
                    'name': candidate.name,
                    'roll_no': candidate.roll_no,
                    'degree': candidate.degree,
                    'Department': candidate.Department,
                    'photo': candidate.photo.url if candidate.photo else None,
                    'votes_count': votes_count,
                    'approved': candidate.approved,
                    'created_at': candidate.created_at
                })

            # Sort candidates by votes count in descending order
            candidates_data.sort(key=lambda x: x['votes_count'], reverse=True)

            result.append({
                'id': position.id,
                'title': position.title,
                'description': position.description,
                'batch_restriction': position.batch_restriction,
                'branch_restriction': position.branch_restriction,
                'candidates': candidates_data,
                'total_votes': sum(c['votes_count'] for c in candidates_data)
            })

        return result
 

from rest_framework import serializers
from .models import VoterFile

class VoterFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = VoterFile
        fields = ["id", "file", "uploaded_at"]