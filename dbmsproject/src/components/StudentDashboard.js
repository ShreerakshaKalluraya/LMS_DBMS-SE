import React, { useEffect, useState } from 'react';

const StudentDashboard = () => {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    const [courses, setCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!userId) {
            console.error("User ID not found in localStorage");
            setMessage("User not authenticated.");
            return;
        }

        fetch(`http://localhost:5000/api/courses/${userId}`)
            .then((response) => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text); });
                }
                return response.json();
            })
            .then((data) => {
                setCourses(data.availableCourses);
                setEnrolledCourses(data.enrolledCourses);
            })
            .catch((error) => {
                console.error('Error fetching courses:', error);
                alert('Failed to fetch courses. Please check the console for more details.');
            });
    }, [userId]);

    const handleEnroll = (courseId, courseName) => {
        fetch('http://localhost:5000/enroll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                course_id: courseId,
                course_name: courseName
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Enrollment failed');
                }
                return response.json();
            })
            .then((data) => {
                alert(`Enrolled in course ${data.courseName} successfully!`);
                setEnrolledCourses([...enrolledCourses, { course_id: courseId, course_name: data.courseName }]);
                setCourses(courses.filter(course => course.course_id !== courseId));
            })
            .catch((error) => {
                console.error('Error enrolling in course:', error);
                alert('Error enrolling in course. Please try again.');
            });
    };

    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            padding: '20px',
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>Welcome, {username}</h2>

            <h3 style={{ marginTop: '20px', color: '#555' }}>Available Courses</h3>
            <ul style={{ listStyleType: 'none', padding: '0' }}>
                {courses.length > 0 ? courses.map(course => (
                    <li key={course.course_id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px',
                        marginBottom: '10px',
                        backgroundColor: '#fff',
                        borderRadius: '5px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                        <span>{course.course_name}</span>
                        <button
                            onClick={() => handleEnroll(course.course_id, course.course_name)}
                            style={{
                                padding: '6px 12px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Enroll
                        </button>
                    </li>
                )) : <p>No available courses at the moment.</p>}
            </ul>

            <h3 style={{ marginTop: '20px', color: '#555' }}>Enrolled Courses</h3>
            <ul style={{ listStyleType: 'none', padding: '0' }}>
                {enrolledCourses.length > 0 ? enrolledCourses.map(course => (
                    <li key={course.course_id} style={{
                        padding: '10px',
                        marginBottom: '10px',
                        backgroundColor: '#e3f2fd',
                        borderRadius: '5px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                        {course.course_name}
                    </li>
                )) : <p>You haven't enrolled in any courses yet.</p>}
            </ul>

            {message && <p style={{ color: 'red', marginTop: '20px' }}>{message}</p>}
        </div>
    );
};

export default StudentDashboard;
