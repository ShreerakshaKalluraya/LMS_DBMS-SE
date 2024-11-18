import React, { useEffect, useState } from 'react';

const StudentDashboard = () => {
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');

    const [courses, setCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [quizzes, setQuizzes] = useState({});
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
                // Fetch quizzes for each enrolled course
                data.enrolledCourses.forEach(course => {
                    fetch(`http://localhost:5000/api/quizzes/${course.course_id}`)
                        .then((response) => {
                            if (!response.ok) {
                                return response.text().then(text => { throw new Error(text); });
                            }
                            return response.json();
                        })
                        .then((quizData) => {
                            setQuizzes(prevQuizzes => ({
                                ...prevQuizzes,
                                [course.course_id]: quizData
                            }));
                        })
                        .catch((error) => {
                            console.error('Error fetching quizzes:', error);
                            alert('Failed to fetch quizzes. Please check the console for more details.');
                        });
                });
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
                // Fetch the updated list of enrolled courses
                fetch(`http://localhost:5000/api/courses/${userId}`)
                    .then((response) => {
                        if (!response.ok) {
                            return response.text().then(text => { throw new Error(text); });
                        }
                        return response.json();
                    })
                    .then((data) => {
                        setEnrolledCourses(data.enrolledCourses);
                        setCourses(data.availableCourses);
                    })
                    .catch((error) => {
                        console.error('Error fetching updated courses:', error);
                        alert('Failed to fetch updated courses. Please check the console for more details.');
                    });
            })
            .catch((error) => {
                console.error('Error enrolling in course:', error);
                alert('Error enrolling in course. Please try again.');
            });
    };

    const handleQuizSubmit = (courseId, answers) => {
        const quizData = quizzes[courseId];
        let score = 0;

        quizData.forEach((quiz, index) => {
            if (quiz.correct_option === answers[index]) {
                score += 1;
            }
        });

        alert(`You scored ${score} out of ${quizData.length}`);
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
                        <div>{course.course_name}</div>
                        <div>
                            {/* Display uploaded material if exists */}
                            {course.materials ? (
                                <p>
                                    Material Uploaded:
                                    <a href={`http://localhost:5000/${course.materials}`} target="_blank" rel="noopener noreferrer">
                                        View
                                    </a>
                                </p>
                            ) : (
                                <p>No materials uploaded yet.</p>
                            )}
                        </div>

                        {/* Display quizzes if available */}
                        {quizzes[course.course_id] && (
                            <div>
                                <h4 style={{ marginTop: '10px', color: '#555' }}>Quizzes</h4>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target);
                                    const answers = quizzes[course.course_id].map((_, index) => formData.get(`quiz-${index}`));
                                    handleQuizSubmit(course.course_id, answers);
                                }}>
                                    {quizzes[course.course_id].map((quiz, index) => (
                                        <div key={quiz.quiz_id} style={{ marginBottom: '10px' }}>
                                            <p>{quiz.question}</p>
                                            <label>
                                                <input type="radio" name={`quiz-${index}`} value="a" />
                                                {quiz.option_a}
                                            </label>
                                            <label>
                                                <input type="radio" name={`quiz-${index}`} value="b" />
                                                {quiz.option_b}
                                            </label>
                                            <label>
                                                <input type="radio" name={`quiz-${index}`} value="c" />
                                                {quiz.option_c}
                                            </label>
                                            <label>
                                                <input type="radio" name={`quiz-${index}`} value="d" />
                                                {quiz.option_d}
                                            </label>
                                        </div>
                                    ))}
                                    <button type="submit" style={{
                                        padding: '6px 12px',
                                        backgroundColor: '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}>Submit Quiz</button>
                                </form>
                            </div>
                        )}
                    </li>
                )) : <p>You haven't enrolled in any courses yet.</p>}
            </ul>

            {message && <p style={{ color: 'red', marginTop: '20px' }}>{message}</p>}
        </div>
    );
};

export default StudentDashboard;