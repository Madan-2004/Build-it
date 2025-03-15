from rest_framework import serializers
from django.utils import timezone
from .models import Election, Position, Candidate, Vote
from django.utils import timezone
from django.utils.timezone import localtime
from datetime import timedelta


class CandidateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False)  # Allow storing name directly
    votes_count = serializers.SerializerMethodField()  # ✅ Compute votes dynamically
    roll_no = serializers.CharField(default="Unknown Roll No")  # ✅ Default roll number
    branch = serializers.CharField(default="CSE")  # ✅ Default branch
    degree = serializers.ChoiceField(choices=[("BTech", "BTech"), ("MTech", "MTech"), ("PhD", "PhD")], default="BTech")  # ✅ Degree choices

    class Meta:
        model = Candidate
        fields = ['id', 'position', 'user', 'name', 'roll_no', 'branch', 'degree', 'photo', 'approved', 'votes_count']
        read_only_fields = ['votes_count']

    def get_votes_count(self, obj):
        return obj.votes.count()

    def validate(self, data):
        if not data.get('user') and not data.get('name'):
            raise serializers.ValidationError("Candidate must have either a user or a name.")
        return data



class PositionSerializer(serializers.ModelSerializer):
    candidates = serializers.SerializerMethodField()  # ✅ Retrieve candidates manually

    class Meta:
        model = Position
        fields = ['id', 'election', 'title', 'description', 'max_candidates', 'max_votes_per_voter', 'candidates']

    def get_candidates(self, obj):
        candidates = obj.candidates.filter(approved=True)
        return CandidateSerializer(candidates, many=True).data


class ElectionSerializer(serializers.ModelSerializer):
    positions = PositionSerializer(many=True, read_only=True)
    is_active = serializers.SerializerMethodField()
    is_upcoming = serializers.SerializerMethodField()
    is_completed = serializers.SerializerMethodField()
    candidates_count = serializers.SerializerMethodField()
    votes_count = serializers.SerializerMethodField()

    class Meta:
        model = Election
        fields = ['id', 'title', 'description', 'start_date', 'end_date', 'created_by',
                  'is_active', 'is_upcoming', 'is_completed', 'candidates_count', 'votes_count', 'positions']
        read_only_fields = ['created_by', 'is_active', 'is_upcoming', 'is_completed', 'candidates_count', 'votes_count']

    

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
        return Candidate.objects.filter(position__election=obj).count()

    def get_votes_count(self, obj):
        return Vote.objects.filter(candidate__position__election=obj).count()



class VoteSerializer(serializers.ModelSerializer):
    voter_id = serializers.IntegerField(source='voter.id', read_only=True)
    voter_email = serializers.EmailField(source='voter.email', read_only=True)  # ✅ Fetch voter's email
    candidate_name = serializers.SerializerMethodField()  # ✅ Fetch candidate's name

    class Meta:
        model = Vote
        fields = ['id','voter_id','voter_email', 'candidate', 'candidate_name', 'timestamp']  # ✅ Add candidate_name
        read_only_fields = ['voter_email', 'candidate_name']

    def get_candidate_name(self, obj):
        """Returns candidate's full name or the name field if no user is assigned."""
        if obj.candidate.user:
            return obj.candidate.user.get_full_name()  # ✅ Get name from user model
        return obj.candidate.name  # ✅ Use manual name field if no user is linked
       



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
                candidate_name = candidate.user.get_full_name() if candidate.user else candidate.name
                candidates_data.append({
                    'id': candidate.id,
                    'name': candidate_name,
                    'votes_count': votes_count
                })

            # Sort candidates by votes count in descending order
            candidates_data.sort(key=lambda x: x['votes_count'], reverse=True)

            result.append({
                'id': position.id,
                'title': position.title,
                'max_votes_per_voter': position.max_votes_per_voter,
                'candidates': candidates_data,
                'total_votes': sum(c['votes_count'] for c in candidates_data)
            })

        return result