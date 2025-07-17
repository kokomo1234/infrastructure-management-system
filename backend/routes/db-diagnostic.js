const express = require('express');
const db = require('../config/database');

const router = express.Router();

// GET /api/db-diagnostic/schema - Check database schema
router.get('/schema', async (req, res) => {
  try {
    // Get all tables in the database
    const [tables] = await db.execute(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
    `);
    
    const tableSchemas = {};
    
    // Get schema for each table
    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      const [columns] = await db.execute(`
        SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, EXTRA
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?
        ORDER BY ORDINAL_POSITION
      `, [tableName]);
      
      tableSchemas[tableName] = columns;
    }
    
    res.json({
      status: 'success',
      data: {
        database_name: process.env.DB_NAME || 'unknown',
        table_count: tables.length,
        tables: tables.map(t => t.TABLE_NAME),
        schemas: tableSchemas,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Database schema check error:', error);
    res.status(500).json({
      error: 'Failed to check database schema',
      code: 'SCHEMA_CHECK_ERROR',
      message: error.message
    });
  }
});

// GET /api/db-diagnostic/users - Check users table specifically
router.get('/users', async (req, res) => {
  try {
    // Check if users table exists
    const [tables] = await db.execute(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'
    `);
    
    if (tables.length === 0) {
      return res.json({
        status: 'success',
        data: {
          users_table_exists: false,
          message: 'Users table does not exist'
        }
      });
    }
    
    // Get users table schema
    const [columns] = await db.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, EXTRA, COLUMN_KEY
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'
      ORDER BY ORDINAL_POSITION
    `);
    
    // Get sample data (first 3 rows, excluding password fields)
    const [sampleData] = await db.execute(`
      SELECT * FROM users LIMIT 3
    `);
    
    // Remove password fields from sample data for security
    const safeSampleData = sampleData.map(row => {
      const safeRow = { ...row };
      delete safeRow.password;
      delete safeRow.password_hash;
      return safeRow;
    });
    
    res.json({
      status: 'success',
      data: {
        users_table_exists: true,
        column_count: columns.length,
        columns: columns,
        row_count_sample: sampleData.length,
        sample_data: safeSampleData,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Users table check error:', error);
    res.status(500).json({
      error: 'Failed to check users table',
      code: 'USERS_CHECK_ERROR',
      message: error.message
    });
  }
});

// POST /api/db-diagnostic/create-admin - Create admin user with detected schema
router.post('/create-admin', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const crypto = require('crypto');
    
    // Check users table schema
    const [columns] = await db.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, COLUMN_KEY
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'
      ORDER BY ORDINAL_POSITION
    `);
    
    if (columns.length === 0) {
      return res.status(404).json({
        error: 'Users table not found',
        code: 'TABLE_NOT_FOUND'
      });
    }
    
    const columnNames = columns.map(col => col.COLUMN_NAME);
    const hasPasswordHash = columnNames.includes('password_hash');
    const hasPassword = columnNames.includes('password');
    const hasId = columnNames.includes('id');
    const hasEmail = columnNames.includes('email');
    
    // Check if admin already exists
    const [existingAdmin] = await db.execute(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      ['admin@infrastructure.com']
    );
    
    if (existingAdmin.length > 0) {
      return res.json({
        status: 'success',
        message: 'Admin user already exists',
        data: {
          admin_exists: true,
          admin_email: 'admin@infrastructure.com'
        }
      });
    }
    
    // Create admin user
    const adminId = crypto.randomUUID();
    const adminEmail = 'admin@infrastructure.com';
    const adminPassword = 'Admin123!';
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    // Build INSERT query based on schema
    const passwordField = hasPasswordHash ? 'password_hash' : 'password';
    let insertQuery, insertValues;
    
    if (hasId) {
      insertQuery = `
        INSERT INTO users (id, email, ${passwordField}, first_name, last_name, department, position, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
      `;
      insertValues = [adminId, adminEmail, hashedPassword, 'Admin', 'System', 'Administration', 'System Administrator'];
    } else {
      insertQuery = `
        INSERT INTO users (email, ${passwordField}, first_name, last_name, department, position, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
      `;
      insertValues = [adminEmail, hashedPassword, 'Admin', 'System', 'Administration', 'System Administrator'];
    }
    
    await db.execute(insertQuery, insertValues);
    
    res.json({
      status: 'success',
      message: 'Admin user created successfully',
      data: {
        admin_email: adminEmail,
        admin_password: adminPassword,
        schema_used: {
          password_field: passwordField,
          has_id: hasId,
          columns: columnNames
        },
        warning: 'Change admin password after first login!'
      }
    });
    
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      error: 'Failed to create admin user',
      code: 'CREATE_ADMIN_ERROR',
      message: error.message
    });
  }
});

module.exports = router;
