import React, { useState, useEffect } from 'react';

const InstructorDashboard = () => {
    const [formData, setFormData] = useState({ course_name: '', description: '', instructor_id: '' });
    const [courses, setCourses] = useState([]);
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null); // For handling file uploads

    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    const role = localStorage.getItem('role'); // Get role from localStorage
    const username = localStorage.getItem('username'); // Get username from localStorage

    useEffect(() => {
        if (userId) {
            setFormData((prevData) => ({ ...prevData, instructor_id: userId }));
            fetchCourses(userId);
        }
    }, [userId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);  // Store the selected file
    };

    const addCourse = async () => {
        try {
            const dataToSend = { ...formData, instructor_id: userId };

            const response = await fetch('http://localhost:5000/add-course', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const result = await response.json();
            setMessage(result.message);

            if (response.ok) {
                setFormData({ course_name: '', description: '', instructor_id: userId });
                fetchCourses(userId); // Refresh course list
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred while adding the course');
        }
    };

    const uploadMaterial = async (courseId) => {
        const formData = new FormData();
        formData.append('material', file);  // Append the selected file

        try {
            const response = await fetch(`http://localhost:5000/upload-material/${courseId}`, {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            setMessage(result.message);  // Show success or error message
            if (response.ok) {
                fetchCourses(userId);  // Refresh the course list after uploading the material
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred while uploading material');
        }
    };

    const fetchCourses = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/instructor-courses/${userId}`);
            const result = await response.json();
            if (response.ok) {
                setCourses(result);
            } else {
                setMessage('Failed to load courses');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred while fetching courses');
        }
    };
    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Welcome, {username}!</h2>
            <div style={styles.formContainer}>
                <h3 style={styles.subHeader}>Add New Course</h3>
                <form onSubmit={(e) => { e.preventDefault(); addCourse(); }} style={styles.form}>
                    <label htmlFor="course_name" style={styles.label}>Course Name:</label>
                    <input
                        type="text"
                        id="course_name"
                        name="course_name"
                        value={formData.course_name}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />

                    <label htmlFor="description" style={styles.label}>Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        style={styles.textarea}
                    ></textarea>

                    <button type="submit" style={styles.button}>Add Course</button>
                </form>
                {message && <p style={styles.message}>{message}</p>}
            </div>

            <h3 style={styles.subHeader}>Your Courses</h3>
            <div style={styles.coursesContainer}>
                {courses.length > 0 ? (
                    <ul style={styles.courseList}>
                        {courses.map((course) => (
                            <li key={course.course_id} style={styles.courseItem}>
                                <h4 style={styles.courseName}>{course.course_name}</h4>
                                <p style={styles.courseDescription}>{course.description}</p>

                                <div style={styles.uploadSection}>
                                    {/* Display uploaded material if exists */}
                                    {course.materials ? (
                                        <p>
                                            Material Uploaded: 
                                            <a href={`http://localhost:5000${course.materials}`} target="_blank" rel="noopener noreferrer" style={styles.link}>
                                                View
                                            </a>
                                        </p>
                                    ) : (
                                        <div>
                                            <input type="file" onChange={handleFileChange} style={styles.fileInput} />
                                            <button onClick={() => uploadMaterial(course.course_id)} style={styles.button}>Upload Material</button>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No courses available</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f4f7fa',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    header: {
        color: '#4CAF50',
        fontSize: '2rem',
        marginBottom: '1rem',
    },
    subHeader: {
        color: '#333',
        fontSize: '1.5rem',
        marginBottom: '1rem',
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '500px',
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '8px',
        fontWeight: 'bold',
    },
    input: {
        padding: '10px',
        marginBottom: '15px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '1rem',
    },
    textarea: {
        padding: '10px',
        marginBottom: '15px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '1rem',
        resize: 'vertical',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    message: {
        color: 'red',
        fontSize: '1rem',
        marginTop: '10px',
    },
    coursesContainer: {
        width: '100%',
        maxWidth: '900px',
    },
    courseList: {
        listStyleType: 'none',
        padding: 0,
    },
    courseItem: {
        backgroundColor: '#fff',
        marginBottom: '15px',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    courseName: {
        fontSize: '1.2rem',
        marginBottom: '10px',
        color: '#333',
    },
    courseDescription: {
        fontSize: '1rem',
        marginBottom: '15px',
        color: '#555',
    },
    uploadSection: {
        marginTop: '10px',
    },
    fileInput: {
        marginBottom: '10px',
    },
    link: {
        color: '#4CAF50',
        textDecoration: 'none',
    },
};

export default InstructorDashboard;
