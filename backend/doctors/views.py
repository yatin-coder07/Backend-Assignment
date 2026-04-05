from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Doctor
from .serializers import DoctorSerializer


class create_doctor(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DoctorSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class get_doctors(APIView):

    def get(self, request):
        queryset = Doctor.objects.all()

        specialization = request.GET.get("specialization")
        if specialization:
            queryset = queryset.filter(specialization=specialization)

        serializer = DoctorSerializer(queryset, many=True)
        return Response(serializer.data)


class get_doctor(APIView):

    def get(self, request, id):
        try:
            doctor = Doctor.objects.get(id=id)
        except Doctor.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = DoctorSerializer(doctor)
        return Response(serializer.data)


class update_doctor(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, id):
        try:
            doctor = Doctor.objects.get(id=id)
        except Doctor.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        if doctor.user != request.user:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        serializer = DoctorSerializer(doctor, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class delete_doctor(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            doctor = Doctor.objects.get(id=id)
        except Doctor.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        if doctor.user != request.user:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        doctor.delete()
        return Response({"message": "Deleted successfully"}, status=status.HTTP_200_OK)