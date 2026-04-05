from django.urls import path
from .views import (
    create_mapping,
    get_mappings,
    get_patient_doctors,
    delete_mapping,
)

urlpatterns = [
    path('', get_mappings.as_view()),                       
    path('create/', create_mapping.as_view()),                    
    path('patient/<int:patient_id>/', get_patient_doctors.as_view()),
    path('delete/<int:id>/', delete_mapping.as_view()),
]