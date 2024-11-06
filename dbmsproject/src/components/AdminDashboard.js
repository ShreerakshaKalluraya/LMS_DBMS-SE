import React from 'react';

const AdminDashboard = () => {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    return (
        <div>
            <h2>Welcome, {username}!</h2>
            <p>You are logged in as an Admin.</p>
            <p>Your role: {role}</p>
        </div>
    );
};

export default AdminDashboard;
