import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:5000/login', formData);
            setMessage(response.data.message);
    
            if (response.data.success) {
                // Check the response data
                console.log('Response Data:', response.data);
    
                // Store the token, username, and role in localStorage
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('username', response.data.username);  // Store username
                localStorage.setItem('role', response.data.role);          // Store role
                localStorage.setItem('userId',response.data.userId);
    
                // Debugging logs
                console.log("Stored username:", localStorage.getItem('username'));
                console.log("Stored role:", localStorage.getItem('role'));
                console.log("Stored id:", localStorage.getItem('userId'));
                // Redirect to dashboard after a brief delay
                setTimeout(() => {
                     // Redirect based on role
                if (response.data.role === 'admin') {
                    navigate('/admin'); // Redirect to admin page
                } else if (response.data.role === 'instructor') {
                    navigate('/instructor'); // Redirect to instructor page
                } else if (response.data.role === 'student') {
                    navigate('/student'); // Redirect to student page
                }
                }, 1000);
            } else {
                setMessage(response.data.message || 'Login failed');
            }
        } catch (error) {
            setMessage('Error occurred during login');
        }
    };
    

    return (
        <div style={styles.container}>
            <div style={styles.loginBox}>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                    <button type="submit" style={styles.button}>Login</button>
                </form>
                {message && <p style={styles.message}>{message}</p>}
                <Link to="/" style={styles.link}>Don’t have an account? Register</Link>
            </div>
        </div>
    );
};

// Styles
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0', // Light gray background for the whole page
    },
    loginBox: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        width: '300px', // Fixed width for the login box
        textAlign: 'center',
    },
    formGroup: {
        margin: '15px 0',
    },
    input: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        width: '100%',
    },
    button: {
        padding: '10px 15px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
    message: {
        marginTop: '15px',
        color: '#ff0000', // Red color for error messages
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
        marginTop: '10px',
    }
};


export default Login;
