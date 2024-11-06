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

// Connect to SQL database
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
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email = ?`;
    db.query(query, [email], async (err, results) => {
        if (err || results.length === 0) {
            res.status(401).json({ success: false, message: 'Login failed' });
        } else {
            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                const token = jwt.sign({ id: user.id }, SECRET_KEY);
                res.json({ success: true, token, message: 'Login successful' });
            } else {
                res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
        }
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
