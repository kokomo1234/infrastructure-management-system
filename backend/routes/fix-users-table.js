const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../config/database');

const router = express.Router();

// POST /api/fix-users-table/execute - Add missing columns to users table and create admin
router.post('/execute', async (req, res) => {
  try {
    console.log('🔧 Starting users table column fixes...');
    
    // Step 1: Add missing columns to users table
    console.log('📋 Adding missing columns to users table...');
    
    // Add password_hash column
    try {
      await db.execute(`
        ALTER TABLE \`users\` 
        ADD COLUMN \`password_hash\` VARCHAR(255) NOT NULL DEFAULT '' AFTER \`email\`
      `);
      console.log('✅ Added password_hash column');
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        throw error;
      }
      console.log('ℹ️ password_hash column already exists');
    }
    
    // Add position column
    try {
      await db.execute(`
        ALTER TABLE \`users\` 
        ADD COLUMN \`position\` VARCHAR(100) NULL AFTER \`department\`
      `);
      console.log('✅ Added position column');
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        throw error;
      }
      console.log('ℹ️ position column already exists');
    }
    
    // Add last_login column
    try {
      await db.execute(`
        ALTER TABLE \`users\` 
        ADD COLUMN \`last_login\` TIMESTAMP NULL AFTER \`position\`
      `);
      console.log('✅ Added last_login column');
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        throw error;
      }
      console.log('ℹ️ last_login column already exists');
    }
    
    // Add updated_at column
    try {
      await db.execute(`
        ALTER TABLE \`users\` 
        ADD COLUMN \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER \`created_at\`
      `);
      console.log('✅ Added updated_at column');
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        throw error;
      }
      console.log('ℹ️ updated_at column already exists');
    }
    
    // Step 2: Create admin user with proper password hash
    console.log('👤 Creating admin user...');
    const adminId = crypto.randomUUID();
    const adminEmail = 'admin@infrastructure.com';
    const adminPassword = 'Admin123!';
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    // Check if admin already exists
    const [existingAdmin] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [adminEmail]
    );
    
    if (existingAdmin.length > 0) {
      // Update existing admin with password hash
      await db.execute(`
        UPDATE \`users\` 
        SET 
          \`password_hash\` = ?,
          \`first_name\` = 'Admin',
          \`last_name\` = 'System',
          \`department\` = 'Administration',
          \`position\` = 'System Administrator',
          \`is_active\` = TRUE,
          \`updated_at\` = NOW()
        WHERE \`email\` = ?
      `, [hashedPassword, adminEmail]);
      
      console.log('✅ Updated existing admin user with password hash');
    } else {
      // Create new admin user
      await db.execute(`
        INSERT INTO \`users\` (
          \`id\`, 
          \`email\`, 
          \`password_hash\`, 
          \`first_name\`, 
          \`last_name\`, 
          \`department\`, 
          \`position\`, 
          \`is_active\`, 
          \`created_at\`, 
          \`updated_at\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        adminId,
        adminEmail,
        hashedPassword,
        'Admin',
        'System',
        'Administration',
        'System Administrator',
        true
      ]);
      
      console.log('✅ Created new admin user');
    }
    
    // Step 3: Verify the fix
    const [userCount] = await db.execute('SELECT COUNT(*) as count FROM users');
    const [adminCheck] = await db.execute(
      'SELECT id, email, first_name, last_name, department FROM users WHERE email = ?',
      [adminEmail]
    );
    
    console.log('🎉 Users table fix completed successfully!');
    
    res.json({
      status: 'success',
      message: 'Users table columns fixed and admin user created successfully',
      data: {
        columns_added: ['password_hash', 'position', 'last_login', 'updated_at'],
        admin_user_ready: true,
        admin_credentials: {
          email: adminEmail,
          password: adminPassword,
          warning: 'Change this password after first login!'
        },
        admin_user_details: adminCheck[0] || null,
        statistics: {
          total_users: userCount[0].count
        },
        next_steps: [
          'Test authentication with admin credentials',
          'Access the dashboard to verify complete functionality',
          'Change admin password after first login'
        ],
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Users table fix failed:', error);
    res.status(500).json({
      error: 'Failed to fix users table',
      code: 'TABLE_FIX_ERROR',
      message: error.message,
      sql_state: error.sqlState || 'unknown',
      sql_message: error.sqlMessage || 'unknown'
    });
  }
});

// GET /api/fix-users-table/status - Check users table column status
router.get('/status', async (req, res) => {
  try {
    const [columns] = await db.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'
      ORDER BY ORDINAL_POSITION
    `);
    
    const requiredColumns = ['password_hash', 'position', 'last_login', 'updated_at'];
    const existingColumns = columns.map(col => col.COLUMN_NAME);
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    
    const [userCount] = await db.execute('SELECT COUNT(*) as count FROM users');
    const [adminCheck] = await db.execute(
      'SELECT COUNT(*) as count FROM users WHERE email = ?',
      ['admin@infrastructure.com']
    );
    
    res.json({
      status: 'success',
      data: {
        existing_columns: existingColumns,
        missing_columns: missingColumns,
        columns_complete: missingColumns.length === 0,
        user_count: userCount[0].count,
        admin_exists: adminCheck[0].count > 0,
        fix_required: missingColumns.length > 0,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      error: 'Failed to check status',
      code: 'STATUS_CHECK_ERROR',
      message: error.message
    });
  }
});

module.exports = router;
