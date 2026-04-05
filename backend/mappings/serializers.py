from rest_framework import serializers
from .models import Mapping

class MappingSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source="doctor.name", read_only=True)
    patient_name = serializers.CharField(source="patient.name", read_only=True)

    class Meta:
        model = Mapping
        fields = ["id", "patient", "doctor", "doctor_name", "patient_name"]