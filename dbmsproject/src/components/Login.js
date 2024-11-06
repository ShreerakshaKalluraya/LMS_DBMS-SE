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
    
                // Debugging logs
                console.log("Stored username:", localStorage.getItem('username'));
                console.log("Stored role:", localStorage.getItem('role'));
    
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
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                
                <button type="submit">Login</button>
            </form>
            <p>{message}</p>
            <p>
                Don’t have an account? <Link to="/">Register</Link>
            </p>
        </div>
    );
};

export default Login;
