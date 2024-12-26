from django.db import models

from django.db import models

class FaceRecognition(models.Model):
    mssv = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100, default="unknown")
    id_card = models.CharField(max_length=100, default="unknown")

    class Meta:
        ordering = ['mssv']
    
    def __str__(self):
        return f"{self.name} ({self.mssv})"
    
class Attendance(models.Model):
    student = models.ForeignKey(FaceRecognition, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20)


    
