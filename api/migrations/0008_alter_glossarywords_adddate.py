# Generated by Django 4.0.6 on 2022-11-25 03:30

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_alter_glossarywords_adddate'),
    ]

    operations = [
        migrations.AlterField(
            model_name='glossarywords',
            name='addDate',
            field=models.DateTimeField(default=datetime.datetime(2022, 11, 25, 3, 30, 19, 357027, tzinfo=utc)),
            preserve_default=False,
        ),
    ]
