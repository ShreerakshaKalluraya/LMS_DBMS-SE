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
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000); 
            if (response.data.success) {
                // Store the token in local storage or a cookie
                localStorage.setItem('authToken', response.data.token);
                // Use the useNavigate hook to redirect
                navigate('/dashboard');
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
                <input type="email" name="email" onChange={handleChange} required />
                <label>Password:</label>
                <input type="password" name="password" onChange={handleChange} required />
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
