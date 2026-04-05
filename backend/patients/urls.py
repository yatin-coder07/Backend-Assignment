from django.urls import path
from .views import (
    create_patient,
    get_patients,
    get_patient,
    update_patient,
    delete_patient,
)

urlpatterns = [
    path('', get_patients.as_view()),                
    path('create/', create_patient.as_view()),       
    path('get/<int:id>/', get_patient.as_view()),       
    path('update/<int:id>/', update_patient.as_view()),    
    path('delete/<int:id>/', delete_patient.as_view()),   
]