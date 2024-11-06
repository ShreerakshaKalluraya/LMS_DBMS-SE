import React, { useEffect, useState } from 'react';

const Dashboard = () => {
    const [user, setUser] = useState({
        username: '',
        role: ''
    });

    useEffect(() => {
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');

        // Check if values are available in localStorage
        console.log("Username from localStorage:", username);
        console.log("Role from localStorage:", role);

        if (username && role) {
            setUser({ username, role });
        } else {
            console.log('User data missing in localStorage');
        }
    }, []);

    return (
        <div>
            <h2>Welcome to the Dashboard</h2>
            {/* Check if user details are available */}
            {user.username && user.role ? (
                <>
                    <p>You have successfully logged in as <strong>{user.username}</strong>.</p>
                    <p>Your role: <strong>{user.role}</strong></p>
                </>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};

export default Dashboard;
