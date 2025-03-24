from django.contrib import admin
from .models import Event, Agenda, Speaker, EventInventory, InventoryItemEvents
admin.site.register(Event)
admin.site.register(Agenda)
admin.site.register(Speaker)
admin.site.register(EventInventory)
admin.site.register(InventoryItemEvents)
# Register your models here.
