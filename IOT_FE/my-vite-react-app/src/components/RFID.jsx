import React from "react";
import { useNavigate } from 'react-router-dom';

const RFID = () => {
    const navigate = useNavigate();
    return (
        <div>
            <p> </p>
            <div style={{ margin: '20px' }}>
                <button onClick={() => navigate('/')}
                    style={btn_facregStyle}
                    onMouseDown={(e) => Object.assign(e.target.style, btn_regPressedStyle)}
                    onMouseLeave={(e) => Object.assign(e.target.style, btn_facregStyle)}
                    onMouseEnter={(e) => Object.assign(e.target.style, btn_regHoverStyle)}>
                    Trang chủ
                </button>
            </div>
            <div style={{ margin: '20px' }}>
                <button onClick={() => navigate('/attendance')}
                    style={btn_rfid}
                    onMouseDown={(e) => Object.assign(e.target.style, btn_regPressedStyle)}
                    onMouseLeave={(e) => Object.assign(e.target.style, btn_rfid)}
                    onMouseEnter={(e) => Object.assign(e.target.style, btn_regHoverStyle)}>
                    Danh sách đã điểm danh
                </button>
            </div>
        </div>
    )
}
const btn_facregStyle = {
    position: 'fixed',
    top: '60%',
    left: '35%',
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
    transition: 'all 0.2s ease-in-out',
};
const btn_rfid = {
    position: 'fixed',
    top: '60%',
    left: '55%',
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
    transition: 'all 0.2s ease-in-out',
};
const btn_regPressedStyle = {
    transform: 'scale(0.98)',
    boxShadow: '3px 3px 0 #ffffff',
};
const btn_regHoverStyle = {
    boxShadow: '6px 6px 0 #000000',
    transform: 'scale(1.05)',
};
export default RFID;