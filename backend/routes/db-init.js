const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../config/database');

const router = express.Router();

// Custom middleware to allow initialization only if users table doesn't exist
const allowInitializationOnly = async (req, res, next) => {
  try {
    const [tables] = await db.execute(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'
    `);
    
    if (tables.length > 0) {
      // Check if any users exist
      const [users] = await db.execute('SELECT COUNT(*) as count FROM users');
      if (users[0].count > 0) {
        return res.status(403).json({
          error: 'Database already initialized',
          code: 'ALREADY_INITIALIZED',
          message: 'Users table exists and contains users. Initialization not allowed.'
        });
      }
    }
    
    next();
  } catch (error) {
    // If there's an error checking the table, allow initialization
    next();
  }
};

// GET /api/db-init/status - Check initialization status
router.get('/status', async (req, res) => {
  try {
    const [tables] = await db.execute(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN ('users', 'work_orders')
    `);
    
    const existingTables = tables.map(t => t.TABLE_NAME);
    const usersTableExists = existingTables.includes('users');
    const workOrdersTableExists = existingTables.includes('work_orders');
    
    let userCount = 0;
    let adminExists = false;
    
    if (usersTableExists) {
      const [users] = await db.execute('SELECT COUNT(*) as count FROM users');
      userCount = users[0].count;
      
      const [admins] = await db.execute(
        'SELECT COUNT(*) as count FROM users WHERE department = ?',
        ['Administration']
      );
      adminExists = admins[0].count > 0;
    }
    
    res.json({
      status: 'success',
      data: {
        users_table_exists: usersTableExists,
        work_orders_table_exists: workOrdersTableExists,
        user_count: userCount,
        admin_exists: adminExists,
        initialization_required: !usersTableExists || userCount === 0,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Database status check error:', error);
    res.status(500).json({
      error: 'Failed to check database status',
      code: 'STATUS_CHECK_ERROR',
      message: error.message
    });
  }
});

// POST /api/db-init/initialize - Initialize database with users table and admin user
router.post('/initialize', allowInitializationOnly, async (req, res) => {
  try {
    const initializationSteps = [];
    
    // Step 1: Create users table if it doesn't exist
    initializationSteps.push({
      step: 'Checking users table',
      timestamp: new Date().toISOString(),
      status: 'running'
    });
    
    const [userTables] = await db.execute(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'
    `);
    
    if (userTables.length === 0) {
      initializationSteps.push({
        step: 'Creating users table',
        timestamp: new Date().toISOString(),
        status: 'running'
      });
      
      await db.execute(`
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
      
      initializationSteps.push({
        step: 'Users table created successfully',
        timestamp: new Date().toISOString(),
        status: 'success'
      });
    } else {
      initializationSteps.push({
        step: 'Users table already exists',
        timestamp: new Date().toISOString(),
        status: 'success'
      });
    }
    
    // Step 2: Create work_orders table if it doesn't exist
    initializationSteps.push({
      step: 'Checking work_orders table',
      timestamp: new Date().toISOString(),
      status: 'running'
    });
    
    const [workOrderTables] = await db.execute(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'work_orders'
    `);
    
    if (workOrderTables.length === 0) {
      initializationSteps.push({
        step: 'Creating work_orders table',
        timestamp: new Date().toISOString(),
        status: 'running'
      });
      
      await db.execute(`
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
      
      initializationSteps.push({
        step: 'Work orders table created successfully',
        timestamp: new Date().toISOString(),
        status: 'success'
      });
    } else {
      initializationSteps.push({
        step: 'Work orders table already exists',
        timestamp: new Date().toISOString(),
        status: 'success'
      });
    }
    
    // Step 3: Check existing users table schema and adapt
    initializationSteps.push({
      step: 'Checking users table schema',
      timestamp: new Date().toISOString(),
      status: 'running'
    });
    
    const [userColumns] = await db.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'
    `);
    
    const columnNames = userColumns.map(col => col.COLUMN_NAME);
    const hasPasswordHash = columnNames.includes('password_hash');
    const hasPassword = columnNames.includes('password');
    const hasId = columnNames.includes('id');
    const hasEmail = columnNames.includes('email');
    
    initializationSteps.push({
      step: `Users table schema detected: ${columnNames.join(', ')}`,
      timestamp: new Date().toISOString(),
      status: 'success'
    });
    
    // Step 4: Create initial admin user with appropriate schema
    initializationSteps.push({
      step: 'Creating initial admin user',
      timestamp: new Date().toISOString(),
      status: 'running'
    });
    
    const adminId = crypto.randomUUID();
    const adminEmail = 'admin@infrastructure.com';
    const adminPassword = 'Admin123!';
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    // Adapt INSERT query based on existing schema
    let insertQuery;
    let insertValues;
    
    if (hasPasswordHash && hasId) {
      // New schema with password_hash and id
      insertQuery = `
        INSERT INTO users (id, email, password_hash, first_name, last_name, department, position, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
      `;
      insertValues = [adminId, adminEmail, hashedPassword, 'Admin', 'System', 'Administration', 'System Administrator'];
    } else if (hasPassword && hasId) {
      // Schema with password and id
      insertQuery = `
        INSERT INTO users (id, email, password, first_name, last_name, department, position, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
      `;
      insertValues = [adminId, adminEmail, hashedPassword, 'Admin', 'System', 'Administration', 'System Administrator'];
    } else if (hasPasswordHash && !hasId) {
      // Schema with password_hash but no id (auto-increment)
      insertQuery = `
        INSERT INTO users (email, password_hash, first_name, last_name, department, position, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
      `;
      insertValues = [adminEmail, hashedPassword, 'Admin', 'System', 'Administration', 'System Administrator'];
    } else if (hasPassword && !hasId) {
      // Schema with password but no id (auto-increment)
      insertQuery = `
        INSERT INTO users (email, password, first_name, last_name, department, position, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
      `;
      insertValues = [adminEmail, hashedPassword, 'Admin', 'System', 'Administration', 'System Administrator'];
    } else {
      throw new Error('Unsupported users table schema - missing required columns');
    }
    
    await db.execute(insertQuery, insertValues);
    
    initializationSteps.push({
      step: 'Initial admin user created successfully',
      timestamp: new Date().toISOString(),
      status: 'success'
    });
    
    // Step 5: Verify initialization
    const [finalUserCount] = await db.execute('SELECT COUNT(*) as count FROM users');
    
    initializationSteps.push({
      step: 'Database initialization completed',
      timestamp: new Date().toISOString(),
      status: 'success',
      details: {
        total_users: finalUserCount[0].count,
        admin_email: adminEmail,
        admin_password: adminPassword
      }
    });
    
    res.json({
      status: 'success',
      message: 'Database initialized successfully',
      data: {
        initialization_steps: initializationSteps,
        admin_credentials: {
          email: adminEmail,
          password: adminPassword,
          warning: 'Change this password after first login!'
        },
        next_steps: [
          'Test admin authentication with provided credentials',
          'Run full migration to enhance existing tables',
          'Change admin password after first login'
        ]
      }
    });
    
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({
      error: 'Database initialization failed',
      code: 'INITIALIZATION_ERROR',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// POST /api/db-init/reset - Reset database (development only)
router.post('/reset', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      error: 'Reset not allowed in production',
      code: 'PRODUCTION_RESET_FORBIDDEN'
    });
  }
  
  try {
    // Drop tables if they exist
    await db.execute('SET FOREIGN_KEY_CHECKS = 0');
    await db.execute('DROP TABLE IF EXISTS work_orders');
    await db.execute('DROP TABLE IF EXISTS users');
    await db.execute('SET FOREIGN_KEY_CHECKS = 1');
    
    res.json({
      status: 'success',
      message: 'Database reset completed',
      data: {
        dropped_tables: ['users', 'work_orders'],
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Database reset error:', error);
    res.status(500).json({
      error: 'Database reset failed',
      code: 'RESET_ERROR',
      message: error.message
    });
  }
});

module.exports = router;
