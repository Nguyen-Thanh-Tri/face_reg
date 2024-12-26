import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FaceReg = () => {
    const navigate = useNavigate();
    // const videoSrc = "http://127.0.0.1:8000/video/stream_pc/";
    // const videoSrc = "http://127.0.0.1:8000/video/stream/";
    const [error, setError] = useState(false);
    const videoRef = useRef();
    useEffect(() => {
        const handleError = () => setError(true);

        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.addEventListener('error', handleError);
        }

        return () => {
            if (videoElement) {
                videoElement.removeEventListener('error', handleError);
            }
        };
    }, []);

    const handleReload = () => {
        window.location.reload();
    };
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <div style={{ margin: '20px' }}>
                <button onClick={() => {
                    navigate('/');
                    fetch('http://127.0.0.1:8000/video/stop/', {
                        method: 'GET',
                    })
                        .then((response) => {
                            if (response.ok) {
                                console.log('Camera stopped successfully');
                            } else {
                                console.error('Failed to stop the camera');
                            }
                        })
                        .catch((error) => console.error('Error:', error));

                }}
                    style={btn_regStyle}
                    onMouseDown={(e) => Object.assign(e.target.style, btn_regPressedStyle)}
                    onMouseLeave={(e) => Object.assign(e.target.style, btn_regStyle)}
                    onMouseEnter={(e) => Object.assign(e.target.style, btn_regHoverStyle)}>
                    Trang chủ
                </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                {error ? (
                    <div>
                        <p style={{ color: 'red' }}>Đã xảy ra lỗi. Vui lòng tải lại trang.</p>
                        <button onClick={handleReload} style={{ padding: '10px 20px', backgroundColor: '#f00', color: '#fff', border: 'none', borderRadius: '5px' }}>
                            Tải lại trang
                        </button>
                    </div>
                ) : (
                    <img
                        ref={videoRef}
                        src="http://127.0.0.1:8000/video/stream/"
                        // src="http://127.0.0.1:8000/video/stream_pc/"
                        alt="Camera Stream"
                        width="640"
                        height="480"
                        onError={() => setError(true)}
                    />
                )}
            </div>
        </div>
    );
};

const btn_regStyle = {
    position: 'fixed',
    left: '85%',
    transform: 'translate(-20%, -20%)',
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
const btn_regPressedStyle = {
    transform: 'scale(0.98)',
    boxShadow: '3px 3px 0 #ffffff',
};
const btn_regHoverStyle = {
    boxShadow: '6px 6px 0 #000000',
    transform: 'scale(1.05)',
};

export default FaceReg;
