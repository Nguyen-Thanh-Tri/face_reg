# Generated by Django 5.1.1 on 2024-12-25 07:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('video_processing', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='facerecognition',
            options={'ordering': ['mssv']},
        ),
        migrations.AlterField(
            model_name='facerecognition',
            name='mssv',
            field=models.IntegerField(primary_key=True, serialize=False),
        ),
    ]
