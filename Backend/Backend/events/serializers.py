from rest_framework import serializers
from .models import Event, Agenda, Speaker

class AgendaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agenda
        fields = ['time', 'topic']

class SpeakerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Speaker
        fields = ['name', 'bio']

class EventSerializer(serializers.ModelSerializer):
    agenda = AgendaSerializer(many=True, read_only=True)
    speakers = SpeakerSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = '__all__'
