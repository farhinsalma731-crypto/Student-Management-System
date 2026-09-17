from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Student(models.Model):
    COURSE_CHOICES = [
        ("CS", "Computer Science"),
        ("EE", "Electrical Engineering"),
        ("ME", "Mechanical Engineering"),
        ("CE", "Civil Engineering"),
        ("BA", "Business Administration"),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True)
    course = models.CharField(max_length=2, choices=COURSE_CHOICES, default="CS")
    age = models.PositiveIntegerField(
        validators=[MinValueValidator(15), MaxValueValidator(100)]
    )
    enrollment_date = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ["-id"]

    def __str__(self):
        return f"{self.name} ({self.email})"
