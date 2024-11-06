// backend/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Raksha@2004',
    database: 'lms',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the SQL server');
});

module.exports = db;
