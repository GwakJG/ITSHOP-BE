const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '26257955as',
  database: 'myapp',
});

module.exports = db;
