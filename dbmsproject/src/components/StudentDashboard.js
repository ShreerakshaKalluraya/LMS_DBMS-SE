import React from 'react';

const StudentDashboard = () => {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    return (
        <div className="student-dashboard">
            <style>
                {`
                    /* Container for the dashboard */
                    .student-dashboard {
                        background-color: #f5f5f5;
                        min-height: 100vh;
                        font-family: 'Arial', sans-serif;
                        padding: 20px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    }

                    /* Greeting section */
                    .greeting-section {
                        text-align: center;
                        background-color: #007bff;
                        color: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        margin-bottom: 30px;
                    }

                    .greeting-section h2 {
                        font-size: 2rem;
                        margin: 0;
                    }

                    .greeting-section .username {
                        font-weight: bold;
                    }

                    .greeting-section .role-text {
                        font-size: 1.2rem;
                        margin-top: 10px;
                    }

                    .role {
                        font-style: italic;
                        font-weight: bold;
                        color: #fbbf24;
                    }

                    /* Details section */
                    .details-section {
                        text-align: center;
                        background-color: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        width: 100%;
                        max-width: 500px;
                    }

                    .details-section h3 {
                        font-size: 1.5rem;
                        margin-bottom: 15px;
                    }

                    .role-description {
                        font-size: 1.2rem;
                        color: #555;
                    }

                    .role-description strong {
                        color: #007bff;
                    }
                `}
            </style>

            <div className="greeting-section">
                <h2>Welcome, <span className="username">{username}!</span></h2>
                <p className="role-text">You are logged in as a <span className="role">{role}</span>.</p>
            </div>
            <div className="details-section">
                <h3>Your Role Details</h3>
                <p className="role-description">Your role: <strong>{role}</strong></p>
            </div>
        </div>
    );
};

export default StudentDashboard;
