# Generated by Django 4.1.4 on 2022-12-26 19:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_rename_defaultbookname_userinfo_glossarybook_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='wordpronounce',
            name='data',
        ),
    ]