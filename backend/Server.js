const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
