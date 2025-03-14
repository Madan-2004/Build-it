from rest_framework import serializers
from .models import Club, Users, Council, ClubMembership


class CouncilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Council
        fields = "__all__"


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ["id", "name", "email", "image"]


class ClubMembershipSerializer(serializers.ModelSerializer):
    user = UsersSerializer()  # Show full user details
    status = serializers.CharField()  # Show membership status (head/member)

    class Meta:
        model = ClubMembership
        fields = ["user", "status"]


class ClubSerializer(serializers.ModelSerializer):
    head = UsersSerializer(required=False, allow_null=True)  # Show full head details
    # members = serializers.SerializerMethodField()  # Get members' details
    # council = CouncilSerializer()  # Show full council details

    head_id = serializers.PrimaryKeyRelatedField(
        queryset=Users.objects.all(), source="head", write_only=True, required=False
    )
    members = serializers.SerializerMethodField()
    council = serializers.PrimaryKeyRelatedField(queryset=Council.objects.all())  # ✅ This accepts an ID

    class Meta:
        model = Club
        fields = "__all__"

    def get_members(self, obj):
        members = ClubMembership.objects.filter(club=obj)
        return ClubMembershipSerializer(members, many=True).data
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'club', 'title', 'description', 'image', 'created_at']
        read_only_fields = ['club']  # Make club read-only
        # Or use extra_kwargs = {'club': {'required': False}} to make it optional
    def create(self, validated_data):
        # Add any special processing for creation here if needed
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        # Special handling for image field - don't overwrite with None
        if 'image' not in validated_data:
            # If image isn't provided, keep the existing one
            validated_data.pop('image', None)
        
        return super().update(instance, validated_data)