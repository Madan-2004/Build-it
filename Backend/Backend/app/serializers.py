from rest_framework import serializers
from .models import Council, Club

class CouncilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Council
        fields = '__all__'

class ClubSerializer(serializers.ModelSerializer):
    council = CouncilSerializer()  # Nested serialization

    class Meta:
        model = Club
        fields = '__all__'
