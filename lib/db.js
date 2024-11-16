// lib/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Dodu8166..',
  database: 'crms1',
});

module.exports = pool;