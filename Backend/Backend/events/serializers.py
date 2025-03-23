from rest_framework import serializers
import json
from app.models import Club
from .models import Event, Agenda, Speaker

class AgendaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agenda
        fields = ["id", "time", "topic"]

class SpeakerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Speaker
        fields = ["id", "name", "bio"]

class EventSerializer(serializers.ModelSerializer):
    poster = serializers.ImageField(required=False, allow_null=True)
    agenda = AgendaSerializer(source='agendas', many=True, required=False, allow_null=True)
    speakers = SpeakerSerializer(many=True, required=False, allow_null=True)
    club_name = serializers.CharField(write_only=True, required=False)
    club = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Event
        fields = "__all__"
        extra_kwargs = {"club": {"read_only": True}}

    def get_club(self, obj):
        return obj.club.name if obj.club else None

    def create(self, validated_data):
        club_name = validated_data.pop("club_name", None)
        agenda_data = validated_data.pop("agendas", [])
        speakers_data = validated_data.pop("speakers", [])

        if club_name:
            try:
                club = Club.objects.get(name=club_name)
                validated_data["club"] = club
            except Club.DoesNotExist:
                raise serializers.ValidationError({"club_name": "Club not found"})

        event = Event.objects.create(**validated_data)

        # Create agenda items
        for item in agenda_data:
            Agenda.objects.create(event=event, **item)

        # Create speakers
        for speaker in speakers_data:
            Speaker.objects.create(event=event, **speaker)

        return event

    def update(self, instance, validated_data):
        club_name = validated_data.pop("club_name", None)
        agenda_data = validated_data.pop("agendas", None)
        speakers_data = validated_data.pop("speakers", None)

        if club_name:
            try:
                club = Club.objects.get(name=club_name)
                validated_data["club"] = club
            except Club.DoesNotExist:
                raise serializers.ValidationError({"club_name": "Club not found"})

        # Update event instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Handle agenda update
        if agenda_data is not None:
            instance.agendas.all().delete()
            for item in agenda_data:
                Agenda.objects.create(event=instance, **item)

        # Handle speakers update
        if speakers_data is not None:
            instance.speakers.all().delete()
            for speaker in speakers_data:
                Speaker.objects.create(event=instance, **speaker)

        return instance

    def to_internal_value(self, data):
        """
        Convert agenda and speakers from JSON strings to Python objects when using multipart/form-data.
        """
        data = data.copy()

        if "agenda" in data:
            try:
                data["agendas"] = json.loads(data.pop("agenda")) if data["agenda"] else []
            except (TypeError, json.JSONDecodeError):
                raise serializers.ValidationError({"agenda": "Invalid JSON format"})

        if "speakers" in data:
            try:
                data["speakers"] = json.loads(data.pop("speakers")) if data["speakers"] else []
            except (TypeError, json.JSONDecodeError):
                raise serializers.ValidationError({"speakers": "Invalid JSON format"})

        return super().to_internal_value(data)

    def to_representation(self, instance):
        """
        Customize the output representation of the event
        """
        representation = super().to_representation(instance)
        representation['agenda'] = AgendaSerializer(instance.agendas.all(), many=True).data
        representation['speakers'] = SpeakerSerializer(instance.speakers.all(), many=True).data
        return representation