from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Mapping, Patient
from .serializers import MappingSerializer


class create_mapping(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = MappingSerializer(data=request.data)

        if serializer.is_valid():
            patient = serializer.validated_data['patient']
            doctor = serializer.validated_data['doctor']

            if patient.user != request.user:
                return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

            if Mapping.objects.filter(patient=patient, doctor=doctor).exists():
                return Response({"error": "Mapping already exists"}, status=status.HTTP_400_BAD_REQUEST)

            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class get_mappings(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
         if request.user.role == "patient":
            mappings = Mapping.objects.filter(patient__user=request.user)

         elif request.user.role == "doctor":
            mappings = Mapping.objects.filter(doctor__user=request.user)

         else:
            mappings = Mapping.objects.none()
         serializer = MappingSerializer(mappings, many=True)
         return Response(serializer.data)


class get_patient_doctors(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, patient_id):
        try:
            patient = Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

       

        mappings = Mapping.objects.filter(patient=patient)
        serializer = MappingSerializer(mappings, many=True)
        return Response(serializer.data)


class delete_mapping(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            mapping = Mapping.objects.get(id=id)
        except Mapping.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

         
        if (
            mapping.patient.user != request.user
            and mapping.doctor.user != request.user
        ):
            return Response({"error": "Unauthorized"}, status=403)
        mapping.delete()
        return Response({"message": "Mapping removed"}, status=status.HTTP_200_OK)