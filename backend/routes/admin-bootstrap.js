const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/database');

const router = express.Router();

// POST /api/admin-bootstrap/create - Create admin user with minimal requirements
router.post('/create', async (req, res) => {
  try {
    console.log('Admin bootstrap: Starting admin user creation...');
    
    // First, let's see what we're working with
    const [tables] = await db.execute(`SHOW TABLES`);
    console.log('Available tables:', tables);
    
    // Check if users table exists
    const userTableExists = tables.some(table => 
      Object.values(table)[0].toLowerCase() === 'users'
    );
    
    if (!userTableExists) {
      console.log('Users table does not exist, creating it...');
      
      // Create a simple users table
      await db.execute(`
        CREATE TABLE users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          department VARCHAR(100) NULL,
          position VARCHAR(100) NULL,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      console.log('Users table created successfully');
    }
    
    // Get the actual table structure
    const [columns] = await db.execute(`DESCRIBE users`);
    console.log('Users table columns:', columns);
    
    // Check if admin user already exists
    const [existingUsers] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      ['admin@infrastructure.com']
    );
    
    if (existingUsers.length > 0) {
      console.log('Admin user already exists');
      return res.json({
        status: 'success',
        message: 'Admin user already exists',
        data: {
          admin_email: 'admin@infrastructure.com',
          admin_exists: true
        }
      });
    }
    
    // Create admin user with hashed password
    const adminPassword = 'Admin123!';
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    console.log('Creating admin user...');
    
    // Use a simple INSERT that should work with most schemas
    const [result] = await db.execute(`
      INSERT INTO users (email, password, first_name, last_name, department, position, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      'admin@infrastructure.com',
      hashedPassword,
      'Admin',
      'System',
      'Administration',
      'System Administrator',
      true
    ]);
    
    console.log('Admin user created successfully, ID:', result.insertId);
    
    res.json({
      status: 'success',
      message: 'Admin user created successfully',
      data: {
        admin_email: 'admin@infrastructure.com',
        admin_password: adminPassword,
        admin_id: result.insertId,
        warning: 'Change this password after first login!',
        table_structure: columns.map(col => ({
          field: col.Field,
          type: col.Type,
          null: col.Null,
          key: col.Key,
          default: col.Default
        }))
      }
    });
    
  } catch (error) {
    console.error('Admin bootstrap error:', error);
    res.status(500).json({
      error: 'Failed to create admin user',
      code: 'ADMIN_BOOTSTRAP_ERROR',
      message: error.message,
      sql_state: error.sqlState || 'unknown',
      sql_message: error.sqlMessage || 'unknown'
    });
  }
});

// GET /api/admin-bootstrap/status - Check admin user status
router.get('/status', async (req, res) => {
  try {
    // Check if users table exists
    const [tables] = await db.execute(`SHOW TABLES`);
    const userTableExists = tables.some(table => 
      Object.values(table)[0].toLowerCase() === 'users'
    );
    
    if (!userTableExists) {
      return res.json({
        status: 'success',
        data: {
          users_table_exists: false,
          admin_exists: false,
          needs_bootstrap: true
        }
      });
    }
    
    // Check for admin user
    const [adminUsers] = await db.execute(
      'SELECT id, email, first_name, last_name, department, is_active FROM users WHERE email = ?',
      ['admin@infrastructure.com']
    );
    
    // Get table structure
    const [columns] = await db.execute(`DESCRIBE users`);
    
    res.json({
      status: 'success',
      data: {
        users_table_exists: true,
        admin_exists: adminUsers.length > 0,
        admin_user: adminUsers[0] || null,
        needs_bootstrap: adminUsers.length === 0,
        table_structure: columns.map(col => ({
          field: col.Field,
          type: col.Type,
          null: col.Null,
          key: col.Key,
          default: col.Default
        }))
      }
    });
    
  } catch (error) {
    console.error('Admin status check error:', error);
    res.status(500).json({
      error: 'Failed to check admin status',
      code: 'STATUS_CHECK_ERROR',
      message: error.message
    });
  }
});

module.exports = router;
