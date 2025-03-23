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


# class EventSerializer(serializers.ModelSerializer):
#     poster = serializers.ImageField(required=False, allow_null=True)  # ✅ Supports image uploads
#     agenda = AgendaSerializer(required=False)  # No longer a list
#     speaker = SpeakerSerializer(required=False)  # No longer a list

#     class Meta:
#         model = Event
#         fields = "__all__"

#     def create(self, validated_data):
#         agenda_data = validated_data.pop("agenda", None)
#         speaker_data = validated_data.pop("speaker", None)

#         event = Event.objects.create(**validated_data)

#         if agenda_data:
#             Agenda.objects.create(event=event, **agenda_data)

#         if speaker_data:
#             Speaker.objects.create(event=event, **speaker_data)

#         return event

#     def update(self, instance, validated_data):
#         agenda_data = validated_data.pop("agenda", None)
#         speaker_data = validated_data.pop("speaker", None)

#         for attr, value in validated_data.items():
#             setattr(instance, attr, value if value is not None else getattr(instance, attr))

#         instance.save()

#         if agenda_data:
#             Agenda.objects.update_or_create(event=instance, defaults=agenda_data)

#         if speaker_data:
#             Speaker.objects.update_or_create(event=instance, defaults=speaker_data)

#         return instance

#     def to_internal_value(self, data):
#         """
#         Convert `agenda` and `speaker` from JSON strings to Python objects when using multipart/form-data.
#         """
#         data = data.copy()

#         if "agenda" in data:
#             try:
#                 data["agenda"] = json.loads(data["agenda"])
#             except (TypeError, json.JSONDecodeError):
#                 raise serializers.ValidationError({"agenda": "Invalid JSON format"})

#         if "speaker" in data:
#             try:
#                 data["speaker"] = json.loads(data["speaker"])
#             except (TypeError, json.JSONDecodeError):
#                 raise serializers.ValidationError({"speaker": "Invalid JSON format"})

#         return super().to_internal_value(data)
    
from rest_framework import serializers
import json
from app.models import Club  # Import Club model
from .models import Event, Agenda, Speaker

class EventSerializer(serializers.ModelSerializer):
    poster = serializers.ImageField(required=False, allow_null=True)  # ✅ Supports image uploads
    agenda = AgendaSerializer(required=False)  # No longer a list
    speaker = SpeakerSerializer(required=False)  # No longer a list
    club_name = serializers.CharField(write_only=True, required=False)  # Accept club name
    club = serializers.SerializerMethodField(read_only=True)  # Return club name instead of ID

    class Meta:
        model = Event
        fields = "__all__"
        extra_kwargs = {"club": {"read_only": True}}  # Ensure `club` is read-only

    def get_club(self, obj):
        """ Return club name instead of club ID """
        return obj.club.name if obj.club else None

    def create(self, validated_data):
        club_name = validated_data.pop("club_name", None)

        if club_name:
            try:
                club = Club.objects.get(name=club_name)
                validated_data["club"] = club
            except Club.DoesNotExist:
                raise serializers.ValidationError({"club_name": "Club not found"})

        agenda_data = validated_data.pop("agenda", None)
        speaker_data = validated_data.pop("speaker", None)

        event = Event.objects.create(**validated_data)

        if agenda_data:
            Agenda.objects.create(event=event, **agenda_data)
        if speaker_data:
            Speaker.objects.create(event=event, **speaker_data)

        return event

    def update(self, instance, validated_data):
        club_name = validated_data.pop("club_name", None)

        if club_name:
            try:
                club = Club.objects.get(name=club_name)
                validated_data["club"] = club
            except Club.DoesNotExist:
                raise serializers.ValidationError({"club_name": "Club not found"})

        agenda_data = validated_data.pop("agenda", None)
        speaker_data = validated_data.pop("speaker", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value if value is not None else getattr(instance, attr))

        instance.save()

        if agenda_data:
            Agenda.objects.update_or_create(event=instance, defaults=agenda_data)
        if speaker_data:
            Speaker.objects.update_or_create(event=instance, defaults=speaker_data)

        return instance

    def to_internal_value(self, data):
        """
        Convert `agenda` and `speaker` from JSON strings to Python objects when using multipart/form-data.
        """
        data = data.copy()

        if "agenda" in data:
            try:
                data["agenda"] = json.loads(data["agenda"])
            except (TypeError, json.JSONDecodeError):
                raise serializers.ValidationError({"agenda": "Invalid JSON format"})

        if "speaker" in data:
            try:
                data["speaker"] = json.loads(data["speaker"])
            except (TypeError, json.JSONDecodeError):
                raise serializers.ValidationError({"speaker": "Invalid JSON format"})

        return super().to_internal_value(data)
