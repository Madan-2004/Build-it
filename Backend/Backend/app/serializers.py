from rest_framework import serializers
from .models import Club, User, Council, ClubMembership


class CouncilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Council
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name", "email", "image"]


class ClubMembershipSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Show full user details
    status = serializers.CharField()  # Show membership status (head/member)

    class Meta:
        model = ClubMembership
        fields = ["user", "status"]


class ClubSerializer(serializers.ModelSerializer):
    head = UserSerializer()  # Show full head details
    members = serializers.SerializerMethodField()  # Get members' details
    council = CouncilSerializer()  # Show full council details

    class Meta:
        model = Club
        fields = "__all__"

    def get_members(self, obj):
        members = ClubMembership.objects.filter(club=obj)
        return ClubMembershipSerializer(members, many=True).data
