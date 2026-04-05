from django.urls import path
from .views import register, login, refresh_access_token,get_logged_in_user

urlpatterns = [
    path('register/', register.as_view()),
    path('login/', login.as_view()),
    path('refresh/', refresh_access_token.as_view()),
    path('me/', get_logged_in_user.as_view())
]