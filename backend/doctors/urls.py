from django.urls import path
from .views import (
    create_doctor,
    get_doctors,
    get_doctor,
    update_doctor,
    delete_doctor,
)

urlpatterns = [
    path('', get_doctors.as_view()),             
    path('create/', create_doctor.as_view()),          
    path('get/<int:id>/', get_doctor.as_view()),    
    path('update/<int:id>/', update_doctor.as_view()), 
    path('delete/<int:id>/', delete_doctor.as_view()),
]