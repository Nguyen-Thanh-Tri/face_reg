import React, { useEffect, useState } from 'react';

const AttendancePage = () => {
    const [recognizedNames, setRecognizedNames] = useState([]);
    const videoSrc = "http://127.0.0.1:8000/video/stream/";
    // const videoSrc = "http://127.0.0.1:8000/video/stream_pc/";

    const handleAttendance = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/video/attendance/', {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Đã xảy ra lỗi trong quá trình điểm danh');
            }
            const data = await response.json();
            setRecognizedNames(data.recognized_names);
        } catch (error) {
            console.error(error);
            setRecognizedNames(['Có lỗi xảy ra!']);
        }
    };

    useEffect(() => {
        handleAttendance();
        const interval = setInterval(handleAttendance, 5000);
        return () => clearInterval(interval); 
    }, []);

    const handleGoHome = () => {
        window.location.href = '/';
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Điểm danh</h1>
            <div>
                <img src={videoSrc} width="640" height="480" alt="Camera Stream" />
            </div>
            <p style={{ fontSize: '18px', marginTop: '20px' }}>
                Kết quả điểm danh: {recognizedNames.join(', ') || 'Chưa có ai điểm danh'}
            </p>
            <button onClick={handleGoHome} style={buttonStyle}>Trang chủ</button>
        </div>
        
    );
};

const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
};

export default AttendancePage;
