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
const SECRET_KEY = '567';

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
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    db.query(query, [username, email, hashedPassword], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Registration failed' });
        } else {
            res.status(201).json({ success: true, message: 'Registration successful' });
        }
    });
});

// Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email = ? password= ?`;
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
