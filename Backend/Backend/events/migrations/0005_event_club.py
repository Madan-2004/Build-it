# Generated by Django 5.1.4 on 2025-03-22 13:20

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0012_projectinventory_inventoryitem'),
        ('events', '0004_alter_agenda_event_alter_speaker_event'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='club',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='events', to='app.club'),
        ),
    ]
