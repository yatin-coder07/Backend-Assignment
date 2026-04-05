from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Patient
from .serializers import PatientSerializer


class create_patient(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PatientSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class get_patients(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        patients = Patient.objects.all()
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)


class get_patient(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        try:
            patient = Patient.objects.get(id=id)
        except Patient.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

       

        serializer = PatientSerializer(patient)
        return Response(serializer.data)


class update_patient(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, id):
        try:
            patient = Patient.objects.get(id=id)
        except Patient.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        if patient.user != request.user:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        serializer = PatientSerializer(patient, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class delete_patient(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            patient = Patient.objects.get(id=id)
        except Patient.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        if patient.user != request.user:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        patient.delete()
        return Response({"message": "Deleted successfully"}, status=status.HTTP_200_OK)