const mysql = require('mysql2');
require('dotenv').config();

// Parse DATABASE_URL or use individual variables as fallback
let poolConfig;

if (process.env.DATABASE_URL) {
  try {
    // Parse DATABASE_URL (format: mysql://user:password@host:port/database)
    const url = new URL(process.env.DATABASE_URL);
    poolConfig = {
      host: url.hostname,
      port: parseInt(url.port) || 3306, // Convert string to number
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1), // Remove leading '/'
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      acquireTimeout: 60000,
      timeout: 60000
    };
    
    // Debug log (remove in production)
    console.log('Database config:', {
      host: poolConfig.host,
      port: poolConfig.port,
      user: poolConfig.user,
      database: poolConfig.database
    });
  } catch (error) {
    console.error('Error parsing DATABASE_URL:', error);
    throw error;
  }
} else {
  // Fallback to individual environment variables
  poolConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 3306, // Convert to number
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000
  };
}

const pool = mysql.createPool(poolConfig);

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected successfully');
    connection.release();
  }
});

const promisePool = pool.promise();

module.exports = promisePool;
