"""pyapi URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from myapp import views

urlpatterns = [
  path('', views.index),
  path('users/', views.add_user),
  path('users/user=<str:username>', views.validate_user),
  path('forum/posts/', views.add_posts),
  path('forum/posts/like=<str:match>&page=<int:page>&limit=<int:pageSize>', views.get_posts),
  path('forum/posts/like=&page=<int:page>&limit=<int:pageSize>', views.get_posts),
  path('forum/posts/like=<str:match>/count', views.get_posts_count),
  path('forum/posts/like=/count', views.get_posts_count),
  path('forum/posts/postid', views.add_comment),
  path('forum/posts/postid=<str:post_id>&username=<str:username>&parent=<str:parent_id>&page=<int:pageNumber>&limit=<int:pageSize>',views.get_comments),
  path('forum/posts/postid=<str:post_id>&parent=<parent_id>/count', views.get_replies_count),
  path('forum/posts/postid=<str:post_id>/count', views.get_comments_count),
  path('forum/posts/postid=<str:post_id>/edit', views.edit_post),
  path('forum/posts/postid=<str:post_id>/delete', views.delete_post),
  path('forum/posts/postid=<str:post_id>', views.get_posts_body),
  path('forum/posts/commentid=<str:comment_id>/edit', views.edit_comment),
  path('forum/posts/commentid=<str:comment_id>/delete', views.delete_comment),
  path('forum/posts/comments/ratingsedit', views.update_ratings),
  path('Game/', views.add_game),
  path('Stats/username=<str:username>&page=<int:page>&limit=<int:pageSize>', views.get_games),
  path('Stats/username=<str:username>/count', views.get_games_count)
]