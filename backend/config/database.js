const mysql = require('mysql2');
require('dotenv').config();

// Parse DATABASE_URL or use individual variables as fallback
let poolConfig;

if (process.env.DATABASE_URL) {
  // Parse DATABASE_URL (format: mysql://user:password@host:port/database)
  const url = new URL(process.env.DATABASE_URL);
  poolConfig = {
    host: url.hostname,
    port: url.port || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1), // Remove leading '/'
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
} else {
  // Fallback to individual environment variables
  poolConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
}

const pool = mysql.createPool(poolConfig);

const promisePool = pool.promise();

module.exports = promisePool;
