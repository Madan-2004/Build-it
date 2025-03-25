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
    members_count = serializers.SerializerMethodField()
    projects_count = serializers.SerializerMethodField()
    members = serializers.SerializerMethodField()
    
    # ✅ Added image field
    image = serializers.ImageField(required=False, allow_null=True)

    # Primary Key Fields
    head_id = serializers.PrimaryKeyRelatedField(
        queryset=Users.objects.all(), source="head", write_only=True, required=False
    )
    council = serializers.PrimaryKeyRelatedField(queryset=Council.objects.all())  # Accepts ID
    
    website = serializers.URLField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)

    class Meta:
        model = Club
        fields = [
            'id', 'name', 'head', 'head_id', 'description', 'members_count',
            'projects_count', 'members', 'council', 'website', 'email', 'image'
        ]

    def get_members(self, obj):
        """Retrieve and serialize the members of the club."""
        members = ClubMembership.objects.filter(club=obj)
        return ClubMembershipSerializer(members, many=True).data

    def get_members_count(self, obj):
        """Get the member count using the cached or direct count."""
        return getattr(obj, 'db_members_count', obj.members_count)

    def get_projects_count(self, obj):
        """Get the project count using the cached or direct count."""
        return getattr(obj, 'db_projects_count', obj.projects_count)

        
from .models import Project

from rest_framework import serializers
from .models import Project, ProjectImage

class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['id', 'image']

class ProjectSerializer(serializers.ModelSerializer):
    images = ProjectImageSerializer(many=True, read_only=True)
    image_uploads = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )
    is_ongoing = serializers.BooleanField(read_only=True)
    is_completed = serializers.BooleanField(read_only=True)
    status = serializers.ChoiceField(choices=Project.STATUS_CHOICES, required=False)

    class Meta:
        model = Project
        fields = [
            'id', 
            'club', 
            'title', 
            'description', 
            'start_date',
            'end_date',
            'status',
            'is_ongoing',
            'is_completed',
            'images', 
            'image_uploads', 
            'created_at'
        ]
        read_only_fields = ['club']

    def validate(self, data):
        """
        Validate the project dates.
        """
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        if end_date and start_date and end_date < start_date:
            raise serializers.ValidationError({
                "end_date": "End date cannot be before start date"
            })

        return data

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
            ProjectImage.objects.filter(project=project).delete()
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


from rest_framework import serializers
from .models import ProjectInventory, InventoryItem, Project


# ==============================
# 🚀 Inventory Item Serializer
# ==============================
class InventoryItemSerializer(serializers.ModelSerializer):
    """🔹 Serializer for InventoryItem model"""

    total_cost = serializers.ReadOnlyField()  # Computed field

    class Meta:
        model = InventoryItem
        fields = ['id', 'name', 'quantity', 'cost', 'consumable', 'total_cost', 'project_inventory']


# ==============================
# 🚀 Project Inventory Serializer
# ==============================
class ProjectInventorySerializer(serializers.ModelSerializer):
    """🔹 Serializer for ProjectInventory model"""

    # Include related `items` in the response
    items = InventoryItemSerializer(many=True, read_only=True)
    
    # Include the project title in the response
    project_title = serializers.CharField(source='project.title', read_only=True)
    
    remaining_budget = serializers.ReadOnlyField()  # Computed field

    class Meta:
        model = ProjectInventory
        fields = [
            'id', 
            'project', 
            'project_title',  
            'budget_allocated', 
            'budget_used', 
            'remaining_budget', 
            'items'
        ]

