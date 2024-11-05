import React, { useEffect, useState } from 'react';

const AttendancePage = () => {
    const [studentList, setList] = useState([]);
    const [attendanceInfo, setAttendanceInfo] = useState({
        list:'',
        attendedStudents: 0,
        totalStudents: 0,
        attendanceSummary: '',
    });
    // const videoSrc = "http://127.0.0.1:8000/video/stream/";
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
            setList(data.list);
            console.log('Dữ liệu danh sách sinh viên:', studentList);
            setAttendanceInfo({
                attendedStudents: data.attended_students,
                totalStudents: data.total_students,
                attendanceSummary: data.attendance_summary,
            });
        } catch (error) {
            console.error(error);
            setList(['Có lỗi xảy ra!']);
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
            <h1>Thông tin điểm danh:</h1>
            <p>Đã điểm danh: {attendanceInfo.attendedStudents}</p>
            <p>Tổng số sinh viên: {attendanceInfo.totalStudents}</p>
            <p>Tóm tắt điểm danh: {attendanceInfo.attendanceSummary}</p>

            <table style={{ margin: '20px auto', borderCollapse: 'collapse', width: '80%' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #000', padding: '10px' }}>Mã Sinh Viên</th>
                        <th style={{ border: '1px solid #000', padding: '10px' }}>Tên Sinh Viên</th>
                        <th style={{ border: '1px solid #000', padding: '10px' }}>Trạng Thái</th>
                    </tr>
                </thead>
                <tbody>
                    {studentList.length > 0 ? (
                        studentList.map((student) => (
                            <tr key={student.mssv}>
                                <td style={{ border: '1px solid #000', padding: '10px' }}>{student.mssv}</td>
                                <td style={{ border: '1px solid #000', padding: '10px' }}>{student.name}</td>
                                <td style={{ border: '1px solid #000', padding: '10px' }}>{student.status}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{ border: '1px solid #000', padding: '10px' }}>Không có dữ liệu</td>
                        </tr>
                    )}
                </tbody>
            </table>
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
