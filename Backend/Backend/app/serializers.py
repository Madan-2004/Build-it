from rest_framework import serializers
from .models import Club, Users, Council, ClubMembership,CouncilHead


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
    members_count = serializers.SerializerMethodField()
    projects_count = serializers.SerializerMethodField()

    head_id = serializers.PrimaryKeyRelatedField(
        queryset=Users.objects.all(), source="head", write_only=True, required=False
    )
    members = serializers.SerializerMethodField()
    council = serializers.PrimaryKeyRelatedField(queryset=Council.objects.all())  # ✅ This accepts an ID
    website = serializers.URLField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    class Meta:
        model = Club
        fields = ['id', 'name', 'head', 'head_id', 'description', 'members_count', 
              'projects_count', 'members', 'council', 'website', 'email']
    def get_members(self, obj):
        members = ClubMembership.objects.filter(club=obj)
        return ClubMembershipSerializer(members, many=True).data
    def get_members_count(self, obj):
        return getattr(obj, 'db_members_count', obj.members_count)

    def get_projects_count(self, obj):
        return getattr(obj, 'db_projects_count', obj.projects_count)
from .models import Project

from rest_framework import serializers
from .models import Project, ProjectImage

class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['id', 'image']

class ProjectSerializer(serializers.ModelSerializer):
    images = ProjectImageSerializer(many=True, read_only=True)  # Retrieve images
    image_uploads = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )  # Accept multiple images

    class Meta:
        model = Project
        fields = ['id', 'club', 'title', 'description', 'images', 'image_uploads', 'created_at']
        read_only_fields = ['club']  # Prevent changing club

    def create(self, validated_data):
        image_uploads = validated_data.pop("image_uploads", [])
        project = Project.objects.create(**validated_data)

        if len(image_uploads) > 5:
            raise serializers.ValidationError("A project can have a maximum of 5 images.")

        for image in image_uploads:
            ProjectImage.objects.create(project=project, image=image)

        return project

    def update(self, instance, validated_data):
        image_uploads = validated_data.pop("image_uploads", [])

        if len(image_uploads) > 5:
            raise serializers.ValidationError("A project can have a maximum of 5 images.")

        project = super().update(instance, validated_data)

        if image_uploads:
            ProjectImage.objects.filter(project=project).delete()  # Remove old images
            for image in image_uploads:
                ProjectImage.objects.create(project=project, image=image)

        return project
class CouncilHeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = CouncilHead
        fields = ["id", "name", "position", "email", "linkedin", "image"]

from .models import Inventory

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = ['budget_allocated', 'budget_used']  # Display as budget_utilized        