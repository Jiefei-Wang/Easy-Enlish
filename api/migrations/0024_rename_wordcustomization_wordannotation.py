# Generated by Django 4.1.4 on 2023-03-04 04:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0023_wordcustomization'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='WordCustomization',
            new_name='WordAnnotation',
        ),
    ]
