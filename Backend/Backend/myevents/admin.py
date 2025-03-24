from django.contrib import admin
from .models import Event, EventCategory, EventInventory, InventoryItemEvents



@admin.register(EventCategory)
class EventCategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'club', 'start_date', 'end_date', 'status', 'fees')
    list_filter = ('status', 'club', 'categories')
    search_fields = ('title', 'description', 'location')
    date_hierarchy = 'start_date'
    filter_horizontal = ('categories',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'club')
        }),
        ('Event Details', {
            'fields': ('location', 'start_date', 'end_date', 'image','pdf')
        }),
        ('Registration Info', {
            'fields': ('register_link', 'fees', 'contact')
        }),
        ('Categories & Status', {
            'fields': ('categories', 'status')
        }),
        ('Metadata', {
            'classes': ('collapse',),
            'fields': ('created_at', 'updated_at')
        })
    )

admin.site.register(EventInventory)
admin.site.register(InventoryItemEvents)    