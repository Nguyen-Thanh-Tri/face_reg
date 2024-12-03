from django.shortcuts import render
from django.http import StreamingHttpResponse, HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import cv2
import numpy as np
import urllib.request
import json
import os
import requests
import face_recognition
from pathlib import Path
from django.conf import settings
import time
from .models import Attendance, FaceRecognition
from django.core.exceptions import ObjectDoesNotExist
import shutil
from PIL import Image
from datetime import timedelta
from django.utils import timezone
######

                

    
today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
today_end = today_start + timedelta(days=1)
font = cv2.FONT_HERSHEY_SIMPLEX
camera_status = True
camera = None
url = "http://192.168.83.125/cam"
recognizer = cv2.face.LBPHFaceRecognizer_create()
detector = cv2.CascadeClassifier(cv2.data.haarcascades +"haarcascade_frontalface_default.xml")
@csrf_exempt
def toggle_pc_cam(request):
    global camera_status
    if request.method == 'POST':
        data = json.loads(request.body)
        status = data.get('status')
        
        if status == 'on':
            start_camera()  
            camera_status = True
            print("Camera turned ON")
        elif status == 'off':
            stop_camera()
            camera_status = False
            print("Camera turned OFF")
        
        return JsonResponse({'status': camera_status})
    return JsonResponse({'error': 'Invalid request'}, status=400)

students = [
    {"id": "1", "name": "khoa", "checkIn": "", "RFID": "E37C1B0F"},
    {"id": "2", "name": "tri", "checkIn": "", "RFID": "81267627"},
    {"id": "3", "name": "Minh", "checkIn": "", "RFID": "F31F5A30"},
    {"id": "4", "name": "QUan", "checkIn": "", "RFID": "D3067934"},
]
@csrf_exempt
def rfid(request):
    print("Has receive ")
    if request.method =="POST":
        try:
            data = json.loads(request.body)
            rfid = data.get('rfid')

            students =FaceRecognition.objects.filter(id_card = rfid)
            if students:
                attendance_exists = Attendance.objects.filter(
                student=FaceRecognition.objects.get(id_card=rfid),
                timestamp__gte=today_start, #greater than or equal
                timestamp__lt=today_end #Less than
                ).exists()
                if not attendance_exists:
                    Attendance(student=FaceRecognition.objects.get(id_card=rfid), status='Yes').save()
                
                return JsonResponse({"message": "Student check-in updated successfully!"}, status=200)
            else:
                return JsonResponse({"message": "Student not found"}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON data"}, status=400)
    else:
        return JsonResponse({"message": "Invalid request method"}, status=405)


def start_camera():
    global camera
    if camera is None:
        camera = cv2.VideoCapture(2)

def stop_camera():
    global camera
    if camera is not None:
        camera.release()
        camera = None

recognized_names_global = []

def genCam():
    global recognized_names_global
    global cam
    
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.read('trainer/trainer.yml')

    cam = cv2.VideoCapture(0)

    while True:
        ret, img = cam.read()
        img = cv2.flip(img, 1)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = detector.detectMultiScale(
            gray,
            scaleFactor=1.1, 
            minNeighbors=5, 
            minSize=(30, 30))
        
        recognized_names_global = []

        for (x,y,w,h) in faces:
            id, confidence = recognizer.predict(gray[y:y+h,x:x+w])
            
            if (40 <confidence < 100):
                face_record = FaceRecognition.objects.filter(mssv=id).first()
                if face_record:
                    ids = face_record.name
                    attendance_exists = Attendance.objects.filter(
                    student=FaceRecognition.objects.get(mssv=id),
                    timestamp__gte=today_start, #greater than or equal
                    timestamp__lt=today_end #Less than
                    ).exists()
                    if not attendance_exists:
                        Attendance(student=FaceRecognition.objects.get(mssv=id), status='Yes').save()
                else :
                    ids = "unknown"
                confidence = "  {0}%".format(round(100 - confidence))

            else:
                id = "unknown"
                confidence = "  {0}%".format(round(100 - confidence))

            cv2.rectangle(img, (x, y), (x+w, y+h), (0, 0, 255), 2)
            cv2.putText(img, str(ids), (x,y-10), font, 0.75, (0,0,255), 2)
            cv2.putText(img, str(confidence), (x +5, y+h+5), font, 0.75, (0, 0, 255), 2)

        ret, jpeg = cv2.imencode('.jpg', img)
        if not ret:
            continue
        
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n\r\n')


def get_pc_cam(request):
    return StreamingHttpResponse(genCam(), content_type='multipart/x-mixed-replace; boundary=frame')

def pc_cam(request):
    return render(request, "video_processing/pc_cam.html", {'camera_status': camera_status})

def genESP():
    global recognized_names_global
    recognizer.read('trainer/trainer.yml')
    
    print (today_start)
    print(today_end)
    while True:
        img = urllib.request.urlopen(url)
        try:
            img_np = np.array(bytearray(img.read()), dtype=np.uint8)
            frame = cv2.imdecode(img_np, -1)
            frame = cv2.flip(frame, 1)
        except cv2.error as e:
            print(f"Lỗi OpenCV: {e}")
            continue
        try:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = detector.detectMultiScale(
                gray,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(20,20)
            )

            for (x,y,w,h) in faces:
                id, confidence = recognizer.predict(gray[y:y+h,x:x+w])
                print(id)
                if (40 <confidence < 100):
                    face_record = FaceRecognition.objects.filter(mssv=id).first()
                    print(id)
                    if face_record:
                        ids = face_record.name
                        attendance_exists = Attendance.objects.filter(
                        student=FaceRecognition.objects.get(mssv=id),
                        timestamp__gte=today_start, #greater than or equal
                        timestamp__lt=today_end #Less than
                        ).exists()
                        if not attendance_exists:
                            Attendance(student=FaceRecognition.objects.get(mssv=id), status='Yes').save()
                    else :
                        ids = "unknown"
                    confidence = "  {0}%".format(round(100 - confidence))
                else:
                    ids = "unknown"
                    confidence = "  {0}%".format(round(100 - confidence))

                cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 0, 255), 2)
                cv2.putText(frame, str(ids), (x,y-10), font, 0.75, (0,0,255), 2)
                cv2.putText(frame, str(confidence), (x +5, y+h+5), font, 0.75, (0, 0, 255), 2)

            ret, jpeg = cv2.imencode('.jpg', frame)
            if ret:
                frame = jpeg.tobytes()
            
            yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
            
        except Exception as e:
            error_message = f"Error: {e}"
            print(error_message)
            yield (b'--frame\r\n'
                   b'Content-Type: text/plain\r\n\r\n' + error_message.encode() + b'\r\n\r\n')
@csrf_exempt    
def attendance(request):

    if request.method == 'POST':

        total = FaceRecognition.objects.count()
        attended_count = Attendance.objects.filter(
            timestamp__gte=today_start,
            timestamp__lt=today_end
        ).values('student').distinct().count()

        list=[]
        students = FaceRecognition.objects.all()

        for student in students:
            try:
                attendanced= Attendance.objects.get(student_id=student.mssv,timestamp__gte=today_start, timestamp__lt=today_end)
                status ='Yes'
            except Attendance.DoesNotExist:
                status='No'

            list.append({
                'mssv':student.mssv,
                'name':student.name,
                'status':status
            })

        return JsonResponse({
            'list':list,
            'attended_students': attended_count,
            'total_students': total,
            'attendance_summary': f"{attended_count}/{total}"})

    return JsonResponse({'error': 'Invalid request'}, status=400)

##################################################################
def pc_cam_no_detect():
    global cam
    cam = cv2.VideoCapture(0)
    
    while True:
        ret, img = cam.read()
        img = cv2.flip(img, 1)
        gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
        faces = detector.detectMultiScale(
            gray,
            scaleFactor=1.2,
            minNeighbors=5,
            minSize=(20,20)
        )
        for (x,y,w,h) in faces:
            cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)
            
            ret, jpeg = cv2.imencode('.jpg', img)
            if ret:
                frame = jpeg.tobytes()
                yield (b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

    
    ##################################################################
def genESP_no_detect():
    global url

    while True:
        img = urllib.request.urlopen(url)
        img_np = np.array(bytearray(img.read()), dtype=np.uint8)
        frame = cv2.imdecode(img_np, -1)
        frame = cv2.flip(frame, 1)
        ret, jpeg = cv2.imencode('.jpg', frame)
        if not ret:
            continue
        
        frame = jpeg.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

def get_esp_no_detect(request):
    return StreamingHttpResponse(genESP_no_detect(), content_type='multipart/x-mixed-replace; boundary=frame')
##################################################################
def get_pc_cam_no_detect(request):
    return StreamingHttpResponse(pc_cam_no_detect(), content_type='multipart/x-mixed-replace; boundary=frame')
##################################################################
def get_esp_cam(request):
    return StreamingHttpResponse(genESP(), content_type='multipart/x-mixed-replace; boundary=frame')

def esp_cam(request):
    return render(request, "video_processing/esp_cam.html")

def index(request):
    return render(request, "video_processing/home.html")
###############################################################################
###############################################################################
@csrf_exempt
def train_faces(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        name_FE = body.get('name', '')
        mssv = body.get('id', '')
         

        face_encodings = []
        mssvs = []
        
        path = "dataset"
        imagePaths = [os.path.join(path, f) for f in os.listdir(path) if f.endswith('.jpg')]
        for imagePath in imagePaths:
            mssv= int(os.path.basename(imagePath).split('_')[0])
            print(mssv)
            PIL_img = Image.open(imagePath).convert('L')
            img_numpy = np.array(PIL_img,'uint8')
            faces = detector.detectMultiScale(img_numpy)

            for (x,y,w,h) in faces:
                face_encodings.append(img_numpy[y:y+h,x:x+w])
                mssvs.append(int(mssv))
    
        recognizer.train(face_encodings, np.array(mssvs))
        recognizer.write('trainer/trainer.yml')
        return JsonResponse({'status': 'OK'})
    return JsonResponse({'status': 'FAIL'})
##################################################################
##################################################################
@csrf_exempt
def deldata(request):
    if request.method=='POST':
        body=json.loads(request.body)
        name=body.get('name','')
        mssv=body.get('id','')

        dataset_dir = "dataset"
        for file_name in os.listdir(dataset_dir):
            
            if file_name.startswith(f"{mssv}_"):
                
                file_path = os.path.join(dataset_dir, file_name)
                try:
                    os.remove(file_path)  
                    print(f"Đã xóa: {file_path}")
                except Exception as e:
                    print(f"Lỗi khi xóa tệp {file_path}: {e}")
            
        try:
            deletedattend=Attendance.objects.filter(student_id=mssv).delete()
            deleted_count, _ = FaceRecognition.objects.filter(mssv=mssv).delete()

            if deleted_count > 0:
                print(f"Đã xóa {deleted_count} bản ghi với MSSV: {mssv}")
                return JsonResponse({'status': 'OK', 'message': f'Đã xóa {deleted_count} bản ghi với MSSV: {mssv}'})
            else:
                print(f"Không tìm thấy bản ghi nào với MSSV: {mssv}")
                return JsonResponse({'status': 'FAIL', 'message': f'Không tìm thấy bản ghi nào với MSSV: {mssv}'})
        except Exception as e:
            print(f"Lỗi khi xóa bản ghi với MSSV {mssv}: {e}")
            return JsonResponse({'status': 'FAIL', 'message': str(e)})
        
    return JsonResponse({'status': 'Phương thức không hợp lệ'}, status=405)
               
@csrf_exempt
def capture(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        name_FE = body.get('name', '')
        mssv = body.get('id', '')

        try:
            existing_user = FaceRecognition.objects.get(mssv=mssv)
            print(f"Người dùng với MSSV {mssv} đã tồn tại.")
            return 
        except ObjectDoesNotExist:
            pass
            
        dataset_dir = "dataset"
        if not os.path.exists(dataset_dir):
            os.makedirs(dataset_dir)

        stream_url = "http://127.0.0.1:8000/video/stream_esp_cam_no_detect/" #cam pc
        # stream_url = "http://127.0.0.1:8000/video/stream_esp_cam_no_detect/" #esp
        stream = requests.get(stream_url, stream=True) 

        face_count = 0  
        byte_data = b''
        try:
            while face_count < 30:
            
                for chunk in stream.iter_content(chunk_size=1024):
                    byte_data += chunk
                    a = byte_data.find(b'\xff\xd8')
                    b = byte_data.find(b'\xff\xd9')
                    if a != -1 and b != -1:
                        jpg_data = byte_data[a:b+2]
                        byte_data = byte_data[b+2:]
                        img_np = np.frombuffer(jpg_data, dtype=np.uint8)
                        frame = cv2.imdecode(img_np, cv2.IMREAD_COLOR)
                        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                        faces = detector.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
                        
                        if len(faces) == 0:
                            print("Không phát hiện khuôn mặt nào.")
                        
                        for (x, y, w, h) in faces:
                            face_img = frame[y:y+h, x:x+w]
                            face_count += 1
                            face_filename = os.path.join("dataset", f"{mssv}_{face_count}.jpg")
                            cv2.imwrite(face_filename, face_img)
                            
                    if face_count >= 30:
                        break
                time.sleep(1)
            new_face = FaceRecognition(mssv=mssv, name=name_FE)
            new_face.save()
            return JsonResponse({'status': 'Da Nhan'})
        except:
            
            for file_name in os.listdir(dataset_dir):
            
                if file_name.startswith(f"{mssv}_"):
                    
                    file_path = os.path.join(dataset_dir, file_name)
                    try:
                        os.remove(file_path)  
                        print(f"Đã xóa: {file_path}")
                    except Exception as e:
                        print(f"Lỗi khi xóa tệp {file_path}: {e}")
            return JsonResponse({'status': 'Co loi xay ra, vui long chup lai'})
    return JsonResponse({'status': 'Phương thức không hợp lệ'}, status=405)
##################################################################
##################################################################