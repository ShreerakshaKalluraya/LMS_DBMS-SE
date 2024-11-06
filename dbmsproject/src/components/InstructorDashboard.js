import React, { useState, useEffect } from 'react';
const InstructorDashboard = () => {
    const [formData, setFormData] = useState({ course_name: '', description: '', instructor_id: '' });
    const [courses, setCourses] = useState([]);
    const [message, setMessage] = useState('');

    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    const role = localStorage.getItem('role'); // Get role from localStorage
    const username = localStorage.getItem('username'); // Get username from localStorage

    useEffect(() => {
        if (userId) {
            setFormData((prevData) => ({ ...prevData, instructor_id: userId }));
            fetchCourses(userId);
        }
    }, [userId]); // This ensures that the form is updated and courses are fetched when userId changes.

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addCourse = async () => {
        try {
            const dataToSend = { ...formData, instructor_id: userId }; // Explicitly set instructor_id

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

    const fetchCourses = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/instructor-courses/${userId}`);
            const result = await response.json();
            if (response.ok) {
                setCourses(result); // Set courses data
            } else {
                setMessage('Failed to load courses');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred while fetching courses');
        }
    };

    return (
        <div>
            <h2>Instructor Dashboard</h2>
            <div className="form-container">
                <h3>Add New Course</h3>
                <form onSubmit={(e) => { e.preventDefault(); addCourse(); }}>
                    <label htmlFor="course_name">Course Name:</label>
                    <input type="text" id="course_name" name="course_name" value={formData.course_name} onChange={handleChange} required />

                    <label htmlFor="description">Description:</label>
                    <textarea id="description" name="description" rows="3" value={formData.description} onChange={handleChange}></textarea>

                    <button type="submit">Add Course</button>
                </form>
                {message && <p>{message}</p>}
            </div>

            <h3>Your Courses</h3>
            <div>
                {courses.length > 0 ? (
                    <ul>
                        {courses.map((course) => (
                            <li key={course.course_id}>
                                <h4>{course.course_name}</h4>
                                <p>{course.description}</p>
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

export default InstructorDashboard;
