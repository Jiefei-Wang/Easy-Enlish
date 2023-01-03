# Generated by Django 4.1.4 on 2022-12-25 06:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_userinfo_defaultexercisebook_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='history',
            name='correctness',
        ),
        migrations.AddField(
            model_name='history',
            name='answer',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='history',
            name='bookName',
            field=models.CharField(default='', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='history',
            name='studyTime',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]