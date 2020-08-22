from django.db import models
import uuid
from datetime import datetime

class User(models.Model):
  user_id = models.CharField(max_length=50, primary_key=True, unique=True, null=False)
  username = models.CharField(max_length=50, null=False)
  email = models.EmailField(max_length=50, null=False)
  password = models.CharField(max_length=250, null=False)
  avatar = models.ImageField(upload_to = 'images/',default="")

class Post(models.Model):
  post_id = models.CharField(max_length=50, primary_key=True,unique=True, null=False)
  title = models.CharField(max_length=300, null=False)
  body = models.CharField(max_length=3000, null=False)
  posted_by = models.CharField(max_length=50, null=False)
  posted_date = models.PositiveIntegerField(default=0, null=False)
  last_posted_by = models.CharField(max_length=50, null=False)
  last_posted_date = models.PositiveIntegerField(default=0, null=False)
  replies = models.PositiveIntegerField(default=0, null=False)
  edited = models.CharField(max_length=10,default='posted',null=False)

class Comment(models.Model):
  comment_id = models.CharField(max_length=50, primary_key=True, unique=True, null=False)
  post_id = models.ForeignKey(Post,on_delete=models.CASCADE)
  body = models.CharField(max_length=1000, null=False)
  posted_by = models.CharField(max_length=50, null=False)
  posted_date = models.PositiveIntegerField(default=0, null=False)
  parent_id = models.CharField(max_length=50)
  edited = models.CharField(max_length=10,default='posted',null=False)


class Rate(models.Model):
  rate_id = models.CharField(max_length=50, primary_key=True, null=False)
  username = models.CharField(max_length=50, null=False)
  comment_id = models.ForeignKey(Comment,on_delete=models.CASCADE)
  likes = models.PositiveIntegerField(default=0, null=False)
  dislikes = models.PositiveIntegerField(default=0, null=False)

class Game(models.Model):
  game_id = models.CharField(max_length=50, primary_key=True, null=False)
  player = models.CharField(max_length=50, null=False, default="")
  opponent = models.CharField(max_length=50, null=False)
  date = models.PositiveIntegerField(default=0, null=False)
  result = models.CharField(max_length=4, null=False)





