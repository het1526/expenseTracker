// expense-backend/config/db.js
const mysql = require("mysql2");

// Using a simple pool. For local XAMPP default user is 'root' with empty password.
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // if you set a root password in XAMPP, put it here
  database: "expense_tracker",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// export a promise-based pool for async/await queries
const db = pool.promise();

module.exports = db;
