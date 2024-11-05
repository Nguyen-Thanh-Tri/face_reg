from django.db import models

from django.db import models

class FaceRecognition(models.Model):
    mssv = models.CharField(max_length=50, primary_key=True, default="unknown")
    name = models.CharField(max_length=100, default="unknown")

    
class Attendance(models.Model):
    student = models.ForeignKey(FaceRecognition, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20)