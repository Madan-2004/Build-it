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
    head = UsersSerializer()  # Show full head details
    members = serializers.SerializerMethodField()  # Get members' details
    council = CouncilSerializer()  # Show full council details

    class Meta:
        model = Club
        fields = "__all__"

    def get_members(self, obj):
        members = ClubMembership.objects.filter(club=obj)
        return ClubMembershipSerializer(members, many=True).data
