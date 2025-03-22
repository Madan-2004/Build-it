from rest_framework import serializers
import json
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
    agendas = AgendaSerializer(many=True, required=False)  
    speakers = SpeakerSerializer(many=True, required=False)  

    class Meta:
        model = Event
        fields = "__all__"

    def create(self, validated_data):
        agendas_data = validated_data.pop("agendas", [])
        speakers_data = validated_data.pop("speakers", [])

        event = Event.objects.create(**validated_data)

        for agenda_data in agendas_data:
            Agenda.objects.create(event=event, **agenda_data)

        for speaker_data in speakers_data:
            Speaker.objects.create(event=event, **speaker_data)

        return event

    def update(self, instance, validated_data):
        agendas_data = validated_data.pop("agendas", [])
        speakers_data = validated_data.pop("speakers", [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value if value is not None else getattr(instance, attr))

        instance.save()

        if agendas_data:
            instance.agendas.all().delete()  # Remove old entries
            for agenda_data in agendas_data:
                Agenda.objects.create(event=instance, **agenda_data)

        if speakers_data:
            instance.speakers.all().delete()  # Remove old entries
            for speaker_data in speakers_data:
                Speaker.objects.create(event=instance, **speaker_data)

        return instance

    def to_internal_value(self, data):
        """
        Convert `agendas` and `speakers` from JSON strings to Python objects when using multipart/form-data.
        """
        data = data.copy()

        if "agendas" in data:
            try:
                data["agendas"] = json.loads(data["agendas"])
            except (TypeError, json.JSONDecodeError):
                raise serializers.ValidationError({"agendas": "Invalid JSON format"})

        if "speakers" in data:
            try:
                data["speakers"] = json.loads(data["speakers"])
            except (TypeError, json.JSONDecodeError):
                raise serializers.ValidationError({"speakers": "Invalid JSON format"})

        return super().to_internal_value(data)
