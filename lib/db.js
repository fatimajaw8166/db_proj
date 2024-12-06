// lib/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'power123',
  database: 'crms1',
  waitForConnections: true,
  connectionLimit: 10, // Increase this limit if necessary
  queueLimit: 0,
});

module.exports = pool;