require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createPool({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  waitForConnections: true,
});

module.exports = db;
