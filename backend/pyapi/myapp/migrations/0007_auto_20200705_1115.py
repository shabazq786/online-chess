# Generated by Django 3.0.8 on 2020-07-05 11:15

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0006_auto_20200705_1058'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='comment_id',
            field=models.CharField(blank=True, default='CBE7C1', max_length=50, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='comment',
            name='posted_date',
            field=models.CharField(default=datetime.datetime(2020, 7, 5, 11, 15, 59, 325647), max_length=50),
        ),
        migrations.AlterField(
            model_name='post',
            name='last_posted_date',
            field=models.CharField(default=datetime.datetime(2020, 7, 5, 11, 15, 59, 325142), max_length=50),
        ),
        migrations.AlterField(
            model_name='post',
            name='post_id',
            field=models.CharField(blank=True, default='E0B591', max_length=50, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='posted_date',
            field=models.CharField(default=datetime.datetime(2020, 7, 5, 11, 15, 59, 325092), max_length=50),
        ),
        migrations.AlterField(
            model_name='user',
            name='user_id',
            field=models.CharField(blank=True, default='904627', max_length=50, primary_key=True, serialize=False, unique=True),
        ),
    ]