from rest_framework import serializers
from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ["id", "name", "email", "phone", "course", "age", "enrollment_date"]
        read_only_fields = ["id", "enrollment_date"]

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Name cannot be empty.")
        return value.strip()

    def validate_phone(self, value):
        if value and not value.replace("+", "").replace(" ", "").isdigit():
            raise serializers.ValidationError("Phone number must contain only digits.")
        return value
