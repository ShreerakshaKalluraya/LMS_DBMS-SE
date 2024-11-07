import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role:'',
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
            const response = await axios.post('http://localhost:5000/', formData);
            
            setMessage(response.data.message);
            setTimeout(() => {
                setMessage(response.data.message);
            if (response.data.success) {
                navigate('/login');
            }
               
            }, 3000);
            
        } catch (error) {
            setMessage('Registration failed');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.gradient}>
                    <h2 style={styles.header}>Register</h2>
                </div>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label}>Username:</label>
                    <input
                        type="text"
                        name="username"
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                    <label style={styles.label}>Email:</label>
                    <input
                        type="email"
                        name="email"
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                    <label style={styles.label}>Password:</label>
                    <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                    <label style={styles.label}>Role:</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        style={styles.select}
                    >
                        <option value="None">Select Role</option>
                        <option value="Student">Student</option>
                        <option value="Instructor">Instructor</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <button type="submit" style={styles.button}>Register</button>
                </form>
                {message && <p style={styles.message}>{message}</p>}
                <p style={styles.footerText}>
                    Already have an account? <Link to="/login" style={styles.link}>Log in</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
    },
    card: {
        width: '400px',
        padding: '2rem',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        backgroundColor: '#fff',
        textAlign: 'center',
    },
    gradient: {
        background: 'linear-gradient(to right, #6633ff, #9370DB)',
        padding: '1rem',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        marginBottom: '2rem',
    },
    header: {
        fontSize: '1.8rem',
        color: '#fff',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        margin: '0.5rem 0 0.2rem 0',
        fontSize: '0.9rem',
        color: '#555',
    },
    input: {
        padding: '0.5rem',
        marginBottom: '1rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '1rem',
    },
    select: {
        padding: '0.5rem',
        marginBottom: '1rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '1rem',
    },
    button: {
        padding: '0.75rem',
        border: 'none',
        borderRadius: '4px',
        background: 'linear-gradient(to right, #6633ff, #9370DB)',
        color: '#fff',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background 0.3s',
    },
    buttonHover: {
        background: 'linear-gradient(to right, #5526e6, #804dcd)',
    },
    message: {
        color: '#d9534f',
        fontSize: '0.9rem',
        marginTop: '1rem',
    },
    footerText: {
        marginTop: '1rem',
        fontSize: '0.9rem',
        color: '#777',
    },
    link: {
        color: '#6633ff',
        textDecoration: 'none',
    },
};

export default Register;
