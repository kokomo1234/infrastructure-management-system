const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
require('dotenv').config();

// Parse DATABASE_URL or use individual variables as fallback
let poolConfig;

if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    poolConfig = {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      acquireTimeout: 60000,
      timeout: 60000
    };
  } catch (error) {
    console.error('Error parsing DATABASE_URL:', error);
    throw error;
  }
} else {
  poolConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000
  };
}

const pool = mysql.createPool(poolConfig);
const promisePool = pool.promise();

async function initializeDatabase() {
  try {
    console.log('🚀 Starting database initialization...');
    
    // Check if users table exists
    const [tables] = await promisePool.execute(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'
    `);
    
    if (tables.length > 0) {
      console.log('✅ Users table already exists');
      
      // Check if admin user exists
      const [adminUsers] = await promisePool.execute(
        'SELECT id FROM users WHERE email = ? AND department = ?',
        ['admin@infrastructure.com', 'Administration']
      );
      
      if (adminUsers.length > 0) {
        console.log('✅ Admin user already exists');
        console.log('🎉 Database initialization complete!');
        process.exit(0);
      }
    } else {
      console.log('📋 Creating users table...');
      
      // Create users table
      await promisePool.execute(`
        CREATE TABLE users (
          id VARCHAR(36) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          department VARCHAR(100) NULL,
          position VARCHAR(100) NULL,
          is_active BOOLEAN DEFAULT TRUE,
          last_login TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_users_email (email),
          INDEX idx_users_department (department),
          INDEX idx_users_active (is_active)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      
      console.log('✅ Users table created successfully');
    }
    
    // Create initial admin user
    console.log('👤 Creating initial admin user...');
    
    const adminId = crypto.randomUUID();
    const adminEmail = 'admin@infrastructure.com';
    const adminPassword = 'Admin123!'; // Change this in production
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    await promisePool.execute(`
      INSERT INTO users (id, email, password_hash, first_name, last_name, department, position, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
    `, [
      adminId,
      adminEmail,
      hashedPassword,
      'Admin',
      'System',
      'Administration',
      'System Administrator'
    ]);
    
    console.log('✅ Initial admin user created successfully');
    console.log('📧 Admin Email:', adminEmail);
    console.log('🔑 Admin Password:', adminPassword);
    console.log('⚠️  IMPORTANT: Change the admin password after first login!');
    
    // Create work_orders table if it doesn't exist
    const [workOrderTables] = await promisePool.execute(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'work_orders'
    `);
    
    if (workOrderTables.length === 0) {
      console.log('📋 Creating work_orders table...');
      
      await promisePool.execute(`
        CREATE TABLE work_orders (
          id VARCHAR(36) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
          priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
          assigned_to VARCHAR(36) NULL,
          created_by VARCHAR(36) NOT NULL,
          site_id INT NULL,
          equipment_type VARCHAR(50) NULL,
          equipment_id INT NULL,
          scheduled_date DATE NULL,
          completed_date DATE NULL,
          estimated_hours DECIMAL(5,2) NULL,
          actual_hours DECIMAL(5,2) NULL,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_work_orders_status (status),
          INDEX idx_work_orders_priority (priority),
          INDEX idx_work_orders_assigned_to (assigned_to),
          INDEX idx_work_orders_created_by (created_by),
          INDEX idx_work_orders_site_id (site_id),
          FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
          FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      
      console.log('✅ Work orders table created successfully');
    } else {
      console.log('✅ Work orders table already exists');
    }
    
    console.log('🎉 Database initialization complete!');
    console.log('🔄 You can now run the full migration using the admin credentials');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await promisePool.end();
  }
}

// Run initialization
initializeDatabase();
