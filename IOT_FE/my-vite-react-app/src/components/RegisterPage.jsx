import React, { useEffect, useState } from 'react';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    // const videoSrc = "http://127.0.0.1:8000/video/stream_pc_cam_no_detect/";
    const videoSrc = "http://127.0.0.1:8000/video/stream_esp_cam_no_detect/";

    const handleDel = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/video/deldata/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, id }),
            });
            const data = await response.json();

            alert(data.status);
        } catch (error) {
            console.error("error del", error);
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/video/capture/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, id }),
            });
            const data = await response.json();
            if (data.status === 'Da Nhan') {
                alert('Da Chup Anh Xong !');
            } else {
                alert(data.status);
            }
        } catch (error) {
            console.error('Error capturing image:', error);
        }
    };

    const handleTrain = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/video/train/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, id }),
            });
            const data = await response.json();
            if (data.status === 'OK') {
                alert('Da Train!');
            } else {
                alert(data.status);
            }
        } catch (error) {
            console.error('Error training model:', error);
        }
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Đăng ký khuôn mặt</h1>
            <div>
                <img src={videoSrc} width="640" height="480" alt="Camera Stream" />
            </div>


            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="MSSV"
                    required
                    style={{ padding: '10px', fontSize: '16px', marginRight: '10px' }}
                />
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tên"
                    required
                    style={{ padding: '10px', fontSize: '16px', marginRight: '10px' }}
                />
                <button type="submit" style={buttonStyle}>Chụp ảnh</button>
            </form>
            <button onClick={handleTrain} style={buttonStyle}>Huấn luyện</button>
            <button onClick={handleGoHome} style={buttonStyle}>Trang chủ</button>
            <button onClick={handleDel} type="submit" style={buttonStyle}>Xóa dữ liệu</button>
        </div>
    );
};

const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
};

export default RegisterPage;
