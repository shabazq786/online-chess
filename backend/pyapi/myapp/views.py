from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from django.db.models import F
from django.contrib.auth.hashers import make_password,check_password
from django.db.models import PositiveIntegerField, Value
from django.shortcuts import get_object_or_404
from django.db import connection
from myapp.models import User, Post, Comment, Rate, Game
import time
import uuid
import base64
import json

@csrf_exempt
def index(request):
  response = json.dumps([{}])
  return HttpResponse(response, content_type='text/json')

def validate_user(request,username):
  if request.method == 'POST':
    try:
      payload = json.loads(request.body)
      password = payload['password']
      user = User.objects.get(username=username)
      avatar = user.avatar
      if check_password(password, user.password):
        response = json.dumps([{'succes':'user validated', 'avatar':str(avatar)}])
      else:
        response = json.dumps([{'error':'invalid password'}])
    except:
      response = json.dumps([{'error':"username doesn't exist"}])
    return HttpResponse(response, content_type='text/json')
  else:
    response = json.dumps([{'error':'unable to validate user'}])
    return HttpResponse(response,status='404',content_type='text/json')

def add_user(request):
  if request.method == 'POST':
    try:
      payload = json.loads(request.body)
      username = payload['username']
      email = payload['email']
      password = payload['password']
      avatar = payload['avatar']
      user_id = uuid.uuid4().hex[:10]
      hashed_password = make_password(password)
      user = User(user_id,username, email, hashed_password,avatar)
      user_query = User.objects.filter(username=username).exists()
      email_query = User.objects.filter(email=email).exists()
      if user_query:
        response = json.dumps([{ 'error': 'username exists'}])   
      elif email_query:
        response = json.dumps([{ 'error': 'email exists'}])  
      else:
        user.save()
        response = json.dumps([{ 'success': 'User added successfully!'}])
    except:
      response = json.dumps([{ 'error': 'User could not be added!'}])
    return HttpResponse(response, content_type='text/json')
  else:
    response = json.dumps([{ 'error': 'User could not be added!'}])
    return HttpResponse(response,status='404',content_type='text/json')

def add_posts(request):
  if request.method == 'POST':

    try:
      payload = json.loads(request.body)
      post_id = uuid.uuid4().hex[:10]
      title = payload['title']
      body = payload['body']
      posted_by = payload['posted_by']
      posted_date = int(time.time())
      post = Post(post_id,title,body,posted_by,posted_date,
      posted_by,posted_date)
      post.save()
      response = json.dumps([{ 'success': 'Post added successfully!'}])
    except:
      response = json.dumps([{ 'error': 'Post could not be added!'}])
    return HttpResponse(response, content_type='text/json')
  else:
    response = json.dumps([{ 'error': 'Post could not be added!'}])
    return HttpResponse(response,status='404',content_type='text/json')

def get_posts(request, page, pageSize, match = ""):
  if request.method == 'GET':
    try:
      offset = page*pageSize - pageSize
      limit = page*pageSize
      post1 = Post.objects.all().filter(title__icontains=match).order_by('-last_posted_date')
      post2 = Post.objects.all().filter(body__icontains=match).order_by('-last_posted_date')
      post3 = Post.objects.all().filter(posted_by__icontains=match).order_by('-last_posted_date')
      post4 = Post.objects.all().filter(last_posted_by__icontains=match).order_by('-last_posted_date')
      post = (post1 | post2 | post3 | post4)[offset:limit]
      print(post)
      response = serializers.serialize('json', post)
    except:
      response = json.dumps([{ 'error': "Couldn't retreive posts"}])
    return HttpResponse(response, content_type='text/json')
  else:
    response = json.dumps([{ 'error': "Couldn't retreive posts"}])
    return HttpResponse(response,status='404',content_type='text/json')

def get_posts_count(request,match=""):
  if request.method == 'GET':
    try:
      post1 = Post.objects.all().filter(title__icontains=match)
      post2 = Post.objects.all().filter(body__icontains=match)
      post3 = Post.objects.all().filter(posted_by__icontains=match)
      post4 = Post.objects.all().filter(last_posted_by__icontains=match)
      posts_count = (post1 | post2 | post3 | post4).count()
      response = json.dumps([{'posts_count':posts_count}])
    except:
      response = json.dumps([{ 'error': "Couldn't retreive posts count"}])
    return HttpResponse(response, content_type='text/json')
  else:
    response = json.dumps([{ 'error': "Couldn't retreive posts count"}])
    return HttpResponse(response,status='404',content_type='text/json')

def get_posts_body(request, post_id):
  if request.method == 'GET':
    try:
      post = get_object_or_404(Post, post_id=post_id)
      user = get_object_or_404(User,username=post.posted_by)
      avatar = str(user.avatar)
      response = json.dumps([{'title':post.title, 'body':post.body, 'posted_by':post.posted_by, 'posted_date':post.posted_date, 'edited':post.edited,'avatar':avatar}])
    except:
      response = json.dumps([{ 'error': "Couldn't retrieve posts body"}])
    return HttpResponse(response, content_type='text/json')
  else:
    response = json.dumps([{ 'error': "Couldn't retrieve posts body"}])
    return HttpResponse(response,status='404',content_type='text/json')

def add_comment(request):
  if request.method == 'POST':
    try:
      payload = json.loads(request.body)
      comment_id = uuid.uuid4().hex[:10]
      post_id = payload['post_id']
      body = payload['body']
      posted_by = payload['posted_by']
      parent_id = payload['parent_id']
      posted_date = int(time.time())

      post = get_object_or_404(Post, post_id=post_id)
      post.last_posted_by = posted_by
      post.last_posted_date = posted_date
      post.replies = F('replies') + 1
      post.save()

      comment = Comment(comment_id, post_id, body, posted_by,posted_date,parent_id)
      comment.save()

      response = json.dumps([{ 'success': 'Comment added successfully!', 'commentid': comment_id}])
    except:
      response = json.dumps([{ 'error': 'Comment  could not be added!'}])
    return HttpResponse(response, content_type='text/json')
  else:
    response = json.dumps([{ 'error': 'Comment could not be added!'}])
    return HttpResponse(response,status='404',content_type='text/json')

def get_comments(request, username, post_id, parent_id,pageNumber, pageSize):
  if request.method == 'GET':
    try:
      offset = pageNumber * pageSize - pageSize
      limit = pageNumber * pageSize
      comments = []
      cursor = connection.cursor()
      cursor.execute('''SELECT "myapp_comment"."comment_id", "myapp_comment"."post_id_id" AS post_id,
        "myapp_comment"."body", "myapp_comment"."posted_by", "myapp_comment"."posted_date",
        "myapp_comment"."parent_id", "myapp_comment"."edited", 
        COALESCE(SUM(myapp_rate.likes),0) AS likes, COALESCE(SUM(myapp_rate.dislikes),0) AS dislikes,
        -1 As rated, "" As avatar
        FROM myapp_comment LEFT JOIN myapp_rate ON myapp_comment.comment_id = myapp_rate.comment_id_id
        WHERE ("myapp_comment"."parent_id" = %s AND "post_id" = %s)
        GROUP BY myapp_comment.comment_id
        ORDER BY "myapp_comment"."posted_date" DESC''',(parent_id,post_id))

      row_headers=[x[0] for x in cursor.description]
      comments = cursor.fetchall()
      cursor.close()
      data = []
      comments = comments[offset:limit]
      comments = [list(row) for row in comments]
      for comment in comments:
        rate = Rate.objects.filter(username=username,comment_id=comment[0])
        user = get_object_or_404(User,username=comment[3])
        if user.avatar:
          avatar = str(user.avatar)
          comment[10] = avatar
        if rate.exists():
          if (rate[0].likes):
            rating = 1
          elif rate[0].dislikes:
            rating = 0
          else:
            rating = -1
          comment[9] = rating

      for comment in reversed(comments):
        comment = tuple(comment)
        data.append(dict(zip(row_headers,comment)))
      response = json.dumps(data)
    except:
      response = json.dumps([{ 'error': "Couldn't retrieve comments"}])
    return HttpResponse(response, content_type='text/json')
  else:
    response = json.dumps([{ 'error': "Couldn't retrieve comments"}])
    return HttpResponse(response,status='404',content_type='text/json')

def get_comments_count(request, post_id):
  if request.method == 'GET':
    try:
      comments_count = Comment.objects.filter(post_id=post_id,parent_id="None").count()
      response = json.dumps([{'comments_count':comments_count}])
    except:
      response = json.dumps([{ 'error': "Couldn't retrieve comments count"}])
    return HttpResponse(response, content_type='text/json')
  else:
    response = json.dumps([{ 'error': "Couldn't retrieve comments count"}])
    return HttpResponse(response,status='404',content_type='text/json')

def get_replies_count(request, post_id, parent_id):
  if request.method == 'GET':
    try:
      replies_count = Comment.objects.filter(post_id=post_id,parent_id=parent_id).count()
      response = json.dumps([{'count':replies_count}])
    except:
      response = json.dumps([{ 'error': "Couldn't retrieve replies count"}])
    return HttpResponse(response, content_type='text/json')
  else:
    response = json.dumps([{ 'error': "Couldn't retrieve replies count"}])
    return HttpResponse(response,status='404',content_type='text/json')

def edit_post(request, post_id):
  if request.method == 'PUT':
    try:
      payload = json.loads(request.body)
      title = payload['title']
      body = payload['body']
      post = get_object_or_404(Post, post_id=post_id)
      post.body = body
      post.title = title
      post.posted_date = int(time.time())
      post.last_posted_date = int(time.time())
      post.edited = 'edited'
      post.save()
      response = json.dumps([{'sucess':"post edited"}])
    except:
      response = json.dumps([{ 'error': "Couldn't post comment"}])
    return HttpResponse(response, content_type='text/json')
  else:
    response = json.dumps([{ 'error': "Couldn't post comment"}])
    return HttpResponse(response,status='404',content_type='text/json')

def delete_post(request, post_id):
  
  if request.method == 'DELETE':
    try:
      post = get_object_or_404(Post, post_id=post_id)
      post.delete()

      response = json.dumps([{'sucess':"post deleted"}])
    except:
      response = json.dumps([{ 'error': "couldn't delete post"}])
    return HttpResponse(response, content_type='text/json')
  else:
    response = json.dumps([{ 'error': "couldn't delete post"}])
    return HttpResponse(response,status='404',content_type='text/json')

def edit_comment(request, comment_id):
  if request.method == 'PUT':
    try:
      payload = json.loads(request.body)
      body = payload['text']
      comment = get_object_or_404(Comment, comment_id=comment_id)
      comment.body = body
      comment.edited = 'edited'
      comment.posted_date = int(time.time())
      comment.save()
      post = get_object_or_404(Post, post_id=comment.post_id.post_id)
      post.last_posted_by = comment.posted_by
      post.last_posted_date = comment.posted_date 
      post.save()
      response = json.dumps([{'sucess':"comment edited"}])
    except:
      response = json.dumps([{ 'error': "Couldn't edit comment"}])
    return HttpResponse(response, content_type='text/json')
  else:
    response = json.dumps([{ 'error': "Couldn't edit comment"}])
    return HttpResponse(response,status='404',content_type='text/json')

def recur(parent,post):
  comments = Comment.objects.filter(parent_id=parent.comment_id)
  for comment in comments:
    recur(comment,post)
  parent.delete()
  post.replies = F('replies') - 1

def delete_comment(request, comment_id):
  if request.method == 'DELETE':
    try:
      comment = get_object_or_404(Comment, comment_id=comment_id)
      post = get_object_or_404(Post, post_id=comment.post_id.post_id)
      recur(comment,post)
      last_comment = Comment.objects.filter(post_id=post.post_id).last()
      post.replies = Comment.objects.filter(post_id=post.post_id).count()
      if last_comment is None:
        post.last_posted_by = post.posted_by
        post.last_posted_date = post.posted_date
      else:
        post.last_posted_by = last_comment.posted_by
        post.last_posted_date = last_comment.posted_date
      post.save()
      response = json.dumps([{'sucess':"comment deleted"}])
    except:
      response = json.dumps([{ 'error': "couldn't delete comment"}])
    return HttpResponse(response, content_type='text/json')
  else:
    response = json.dumps([{ 'error': "couldn't delete comment"}])
    return HttpResponse(response,status='404',content_type='text/json')

def update_ratings(request):
  if request.method == 'PUT':
    try:
      payload = json.loads(request.body)
      username = payload['username']
      comment_id = payload['comment_id']
      rated = payload['rate']

      counts = Rate.objects.filter(username=username,comment_id=comment_id).count()
      if counts:
        rate = Rate.objects.get(username=username,comment_id=comment_id)
        if rated == 'likes':
          if rate.likes == 1:
            rate.likes = 0
          elif rate.dislikes == 1:
            rate.likes = 1
            rate.dislikes = 0
          else:
            rate.likes = 1
        else:
          if rate.dislikes == 1:
            rate.dislikes = 0
          elif rate.likes == 1:
            rate.dislikes = 1
            rate.likes = 0
          else:
            rate.dislikes = 1
        rate.save()
      else:
        rate_id = uuid.uuid4().hex[:10]
        if rated == 'likes':
          rate = Rate(rate_id,username,comment_id,1,0)
        else:
          rate = Rate(rate_id,username,comment_id,0,1)
        rate.save()
      response = json.dumps([{'sucess':"updated comment rating"}])
    except:
      response = json.dumps([{ 'error': "couldn't update comment rating"}])
    return HttpResponse(response, content_type='text/json')
  else:
    response = json.dumps([{ 'error': "couldn't update comment rating"}])
    return HttpResponse(response,status='404',content_type='text/json')

def add_game(request):
  if request.method == 'POST':
    print("SS")
    try:
      payload = json.loads(request.body)
      game_id = uuid.uuid4().hex[:10]
      player = payload['player']
      opponent = payload['opponent']
      result = payload['result']
      date = int(time.time())
      game = Game(game_id,player,opponent,date,result)
      game.save()
      print(player)
      response = json.dumps([{ 'success': 'Game added successfully!'}])
    except:
      response = json.dumps([{ 'error': 'Game could not be added!'}])
    return HttpResponse(response, content_type='text/json')
  else:
    response = json.dumps([{ 'error': 'Game could not be added!'}])
    return HttpResponse(response,status='404',content_type='text/json')

def get_games(request, page, pageSize, username):
  if request.method == 'GET':
    try:
      offset = page*pageSize - pageSize
      limit = page*pageSize
      Game1 = Game.objects.all().filter(player=username).order_by('-date')
      Game2 = Game.objects.all().filter(opponent=username).order_by('-date')
      game = (Game1 | Game2)[offset:limit]
      response = serializers.serialize('json', game)
    except:
      response = json.dumps([{ 'error': "Couldn't retreive games"}])
    return HttpResponse(response, content_type='text/json')
  else:
    response = json.dumps([{ 'error': "Couldn't retreive games"}])
    return HttpResponse(response,status='404',content_type='text/json')

def get_games_count(request,username):
  if request.method == 'GET':
    try:
      Game1 = Game.objects.all().filter(player=username)
      Game2 = Game.objects.all().filter(opponent=username)

      Games_count = (Game1 | Game2).count()
      Draw_count = (Game1.filter(result="Draw") | Game2.filter(result="Draw")).count()
      Win_count = Game1.filter(result="Win").count()
      Lose_count = Game2.filter(result="Win").count()

      response = json.dumps([{
        'Games_count':Games_count,
        'Draw_count':Draw_count,
        'Win_count':Win_count,
        'Lose_count':Lose_count
      }])
    except:
      response = json.dumps([{ 'error': "Couldn't retreive Games count"}])
    return HttpResponse(response, content_type='text/json')
  else:
    response = json.dumps([{ 'error': "Couldn't retreive Games count"}])
    return HttpResponse(response,status='404',content_type='text/json')

