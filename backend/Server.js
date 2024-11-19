const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5000;
const SECRET_KEY = 'your-secret-key';

// Connect to MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Raksha@2004',
    database: 'lms'
});

db.connect(err => {
    if (err) throw err;
    console.log('Database connected!');
});

// Register Route
// Register Route
app.post('/', async (req, res) => {
    const { username, email, password, role } = req.body;
    const saltRounds = 10;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user into database
        const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
        db.query(query, [username, email, hashedPassword, role], (error, results) => {
            if (error) {
                // Check if the error is due to the trigger
                if (error.code === 'ER_SIGNAL_EXCEPTION') {
                    return res.status(400).json({ message: error.sqlMessage, success: false });
                }
                res.status(500).json({ message: 'Registration failed', success: false });
                return;
            }
            res.status(200).json({ message: 'Registration successful', success: true });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error occurred during registration', success: false });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query MySQL database for user by email
        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], async (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error occurred while fetching user data' });
            }

            if (results.length === 0) {
                return res.status(400).json({ message: 'User not found' });
            }

            const user = results[0];

            // Compare the password with the hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Create a JWT token
            const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });

            // Send the response with the token, username, and role
            res.json({
                success: true,
                token,
                message: 'Login successful',
                username: user.username,  // Send username
                role: user.role,          // Send role
                userId: user.user_id,          // Send the actual user ID field here
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Add a new course
app.post('/add-course', (req, res) => {
    const { course_name, description, instructor_id } = req.body;
    
    const sql = 'INSERT INTO courses (course_name, description, instructor_id) VALUES (?, ?, ?)';
    db.query(sql, [course_name, description, instructor_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to add course' });
        }
        res.status(200).json({ message: 'Course added successfully' });
    });
});

// Get courses by instructor ID
app.get('/instructor-courses/:instructor_id', (req, res) => {
    const instructor_id = req.params.instructor_id;

    const sql = 'SELECT * FROM courses WHERE instructor_id = ?';
    db.query(sql, [instructor_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to fetch courses' });
        }
        res.status(200).json(results);
    });
});

app.get('/student-courses/:user_id', (req, res) => {
    const user_id = req.params.user_id;

    const sql = 'SELECT * FROM enrollments WHERE user_id = ?';
    db.query(sql, [user_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to fetch courses' });
        }
        res.status(200).json(results);
    });
});

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API endpoint for uploading material
app.post('/upload-material/:courseId', upload.single('material'), (req, res) => {
    const courseId = req.params.courseId;
    const materialUrl = `uploads/${req.file.filename}`;
    console.log('Received :',req.file.filename);
    const sql = 'UPDATE courses SET materials = ? WHERE course_id = ?';
    db.query(sql, [materialUrl, courseId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error uploading material', error: err });
        }
        res.json({ message: 'Material uploaded successfully', materialUrl });
    });
});
// Endpoint to enroll a user in a course
app.post('/enroll', (req, res) => {
    const { user_id, course_id, course_name } = req.body;
    console.log('Received enrollment data:', req.body); // Log the received data

    if (!user_id || !course_id || !course_name) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const sql = 'INSERT INTO enrollments (user_id, course_id, course_name) VALUES (?, ?, ?)';
    db.query(sql, [user_id, course_id, course_name], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Failed to enroll in course', error: err });
        }
        res.status(200).json({ message: 'Enrollment successful', courseName: course_name });
    });
});


// Updated API endpoint to fetch available and enrolled courses
app.get('/api/courses/:userId', (req, res) => {
    const userId = req.params.userId;
    console.log(`Fetching available courses for user ID: ${userId}`);

    // Query to get available courses
    const availableCoursesQuery = `
        SELECT c.course_id, c.course_name, u.username AS instructor_name
        FROM courses c
        JOIN users u ON c.instructor_id = u.user_id
        WHERE c.course_id NOT IN (
            SELECT course_id FROM enrollments WHERE user_id = ?
        )
    `;

    // Query to get enrolled courses with materials
    const enrolledCoursesQuery = `
        SELECT c.course_id, c.course_name, u.username AS instructor_name, c.materials
        FROM enrollments e
        JOIN courses c ON e.course_id = c.course_id
        JOIN users u ON c.instructor_id = u.user_id
        WHERE e.user_id = ?
    `;

    // Execute both queries in parallel
    db.query(availableCoursesQuery, [userId], (err, availableResults) => {
        if (err) {
            console.error('Error fetching available courses:', err);
            return res.status(500).json({ error: err.message });
        }

        db.query(enrolledCoursesQuery, [userId], (err, enrolledResults) => {
            if (err) {
                console.error('Error fetching enrolled courses:', err);
                return res.status(500).json({ error: err.message });
            }

            res.json({
                availableCourses: availableResults,
                enrolledCourses: enrolledResults,
            });
        });
    });
});


app.post('/api/deleteCourse', (req, res) => {
    const { courseId } = req.body;

    // Validate input
    if (!courseId) {
        return res.status(400).json({ error: 'Course ID is required' });
    }

    // Call the stored procedure
    db.query('CALL DeleteCourse(?)', [courseId], (error, results) => {
        if (error) {
            console.error('Error executing the procedure:', error);
            return res.status(500).json({ error: 'An error occurred while deleting the course' });
        }

        // Check if the course was deleted
        if (results.affectedRows > 0) {
            return res.status(200).json({ message: 'Course deleted successfully' });
        } else {
            return res.status(404).json({ error: 'Course not found' });
        }
    });
});


// Get all users
app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.json(results);
    });
});

// Update user
app.put('/api/users/:id', (req, res) => {
    const { username, email, password, role } = req.body;
    const userId = req.params.id;
    db.query(
        'UPDATE users SET username = ?, email = ?, password = ?, role = ? WHERE user_id = ?',
        [username, email, password, role, userId],
        (err, results) => {
            if (err) {
                console.error('Error updating user:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            res.json({ message: 'User updated successfully' });
        }
    );
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;

    // Delete related records in the enrollments table
    db.query('DELETE FROM enrollments WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error deleting related enrollments:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        // Now delete the user
        db.query('DELETE FROM users WHERE user_id = ?', [userId], (err, results) => {
            if (err) {
                console.error('Error deleting user:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'User deleted successfully' });
        });
    });
});

//const bcrypt = require('bcrypt');
// Add a new quiz
app.post('/api/quizzes', (req, res) => {
    const { course_id, question, option_a, option_b, option_c, option_d, correct_option } = req.body;
    const query = 'INSERT INTO quizzes (course_id, question, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [course_id, question, option_a, option_b, option_c, option_d, correct_option], (err, results) => {
        if (err) {
            console.error('Error adding quiz:', err);
            return res.status(500).json({ message: 'Failed to add quiz', success: false });
        }
        res.json({ message: 'Quiz added successfully', success: true });
    });
});

// Fetch quizzes for a course
app.get('/api/quizzes/:courseId', (req, res) => {
    const courseId = req.params.courseId;
    const query = 'SELECT * FROM quizzes WHERE course_id = ?';
    db.query(query, [courseId], (err, results) => {
        if (err) {
            console.error('Error fetching quizzes:', err);
            return res.status(500).json({ message: 'Failed to fetch quizzes', success: false });
        }
        res.json(results);
    });
});

// Fetch quizzes for a course
app.get('/api/quizzes/:courseId', (req, res) => {
    const courseId = req.params.courseId;
    const query = 'SELECT * FROM quizzes WHERE course_id = ?';
    db.query(query, [courseId], (err, results) => {
        if (err) {
            console.error('Error fetching quizzes:', err);
            return res.status(500).json({ message: 'Failed to fetch quizzes', success: false });
        }
        res.json(results);
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
