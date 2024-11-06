import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
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
            const response = await axios.post('http://localhost:5000/register', formData);
            setMessage(response.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 1000); 
            setMessage(response.data.message);
            if (response.data.success) {
                navigate('/login');
            }
        } catch (error) {
            setMessage('Registration failed');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <label>Username:</label>
                <input type="text" name="username" onChange={handleChange} required />
                <label>Email:</label>
                <input type="email" name="email" onChange={handleChange} required />
                <label>Password:</label>
                <input type="password" name="password" onChange={handleChange} required />
                <button type="submit">Register</button>
            </form>
            <p>{message}</p>
            <p>
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
};

export default Register;
