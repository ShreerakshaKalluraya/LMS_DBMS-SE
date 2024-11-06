import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';

import InstructorDashboard from './components/InstructorDashboard';

import StudentDashboard from './components/StudentDashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/instructor" element={<InstructorDashboard />} />
                <Route path="/student" element={<StudentDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
