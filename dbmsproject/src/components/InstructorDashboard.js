import React, { useState, useEffect } from 'react';

const InstructorDashboard = () => {
    const [formData, setFormData] = useState({ course_name: '', description: '', instructor_id: 1 }); // assuming instructor_id is 1
    const [courses, setCourses] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchCourses(); // Load courses on component mount
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addCourse = async () => {
        try {
            const response = await fetch('http://localhost:5000/add-course', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            setMessage(result.message);

            if (response.ok) {
                setFormData({ ...formData, course_name: '', description: '' });
                fetchCourses(); // Refresh course list after adding a new course
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred while adding the course');
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await fetch(`http://localhost:5000/instructor-courses/${formData.instructor_id}`);
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
