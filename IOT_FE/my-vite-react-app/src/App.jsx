import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RFID from './components/RFID';
import Home from './components/Home';
import FaceReg from './components/FaceReg';
import RegisterPage from './components/RegisterPage';
import AttendancePage from './components/AttendancePage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="facereg" element={<FaceReg />} />
                <Route path="rfidreg" element={<RFID />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/attendance" element={<AttendancePage />} />
            </Routes>
        </Router>
    );
};

export default App;
