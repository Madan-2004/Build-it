from django.contrib import admin
from .models import Event, Agenda, Speaker


# Inline for Agendas
class AgendaInline(admin.TabularInline):  # Can also use StackedInline for a different layout
    model = Agenda
    extra = 1  # Allows adding a new empty agenda by default


# Inline for Speakers
class SpeakerInline(admin.TabularInline):
    model = Speaker
    extra = 1  # Allows adding a new empty speaker by default


# Main Event Admin
@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "date", "venue", "category")  # Fields to display in the admin list
    search_fields = ("title", "venue", "category")  # Enables search
    list_filter = ("category", "date")  # Filters on the right panel
    ordering = ("-date",)  # Default ordering
    inlines = [AgendaInline, SpeakerInline]  # Enables in-place editing of related models
