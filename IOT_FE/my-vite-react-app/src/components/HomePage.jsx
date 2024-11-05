import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    // const videoSrc = "http://127.0.0.1:8000/video/stream_pc/";
    const videoSrc = "http://127.0.0.1:8000/video/stream/";
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <div style={{ margin: '20px' }}>
                <button onClick={() => navigate('/register')}
                    style={btn_regStyle}
                    onMouseDown={(e) => Object.assign(e.target.style, btn_regPressedStyle)}
                    onMouseLeave={(e) => Object.assign(e.target.style, btn_regStyle)}
                    onMouseEnter={(e) => Object.assign(e.target.style, btn_regHoverStyle)}>
                    Đăng ký khuôn mặt
                </button>
            </div>
            <div style={{ margin: '20px' }}>
                <button onClick={() => navigate('/attendance')}
                    style={btn_List}
                    onMouseDown={(e) => Object.assign(e.target.style, btn_regPressedStyle)}
                    onMouseLeave={(e) => Object.assign(e.target.style, btn_List)}
                    onMouseEnter={(e) => Object.assign(e.target.style, btn_regHoverStyle)}>
                    Xem danh sách điểm danh
                </button>
            </div>

            <div>
                <img src={videoSrc} width="640" height="480" alt="Camera Stream" />
            </div>
        </div>
    );
};

const btn_regStyle = {
    position: 'fixed',
    right: '20px',
    width: '200px',
    height: '50px',
    padding: '10px',
    backgroundColor: '#ffffff',
    color: '#000000',
    border: '2px solid #000000',
    boxShadow: '3px 3px 0 #ffffff, 6px 6px 0 #000000',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'transform 0.1s ease',
};
const btn_List = {
    bottom: '20px',
    position: 'fixed',
    right: '20px',
    width: '200px',
    height: '50px',
    padding: '10px',
    backgroundColor: '#ffffff',
    color: '#000000',
    border: '2px solid #000000',
    boxShadow: '3px 3px 0 #ffffff, 6px 6px 0 #000000',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'transform 0.1s ease',
}
const btn_regPressedStyle = {
    transform: 'scale(0.98)',
    boxShadow: '3px 3px 0 #ffffff',
};
const btn_regHoverStyle = {
    boxShadow: '6px 6px 0 #000000',
    transform: 'scale(1.05)',
};

export default HomePage;
