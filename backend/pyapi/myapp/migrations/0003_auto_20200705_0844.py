# Generated by Django 3.0.8 on 2020-07-05 08:44

import datetime
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0002_auto_20200704_1002'),
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.CharField(blank=True, default=uuid.uuid4, max_length=50, primary_key=True, serialize=False, unique=True)),
                ('title', models.CharField(max_length=300)),
                ('body', models.CharField(max_length=3000)),
                ('posted_by', models.CharField(max_length=50)),
                ('posted_date', models.DateTimeField(default=datetime.datetime.now)),
                ('last_posted_by', models.CharField(max_length=50)),
                ('last_posted_date', models.DateTimeField(default=datetime.datetime.now)),
                ('replies', models.PositiveIntegerField(default=0)),
            ],
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=50),
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('comment_id', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=300)),
                ('body', models.CharField(max_length=1000)),
                ('posted_by', models.CharField(max_length=50)),
                ('posted_date', models.DateTimeField(default=datetime.datetime.now)),
                ('likes', models.PositiveIntegerField(default=0)),
                ('dislikes', models.PositiveIntegerField(default=0)),
                ('post_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='myapp.Post')),
            ],
        ),
    ]
