# Generated by Django 4.0.6 on 2022-11-25 04:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_alter_glossarywords_adddate'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userinfo',
            name='id',
        ),
        migrations.AlterField(
            model_name='userinfo',
            name='user',
            field=models.CharField(max_length=100, primary_key=True, serialize=False),
        ),
    ]
