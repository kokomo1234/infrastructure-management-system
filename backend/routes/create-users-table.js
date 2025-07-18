const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../config/database');

const router = express.Router();

// POST /api/create-users-table/execute - Create users table and admin user
router.post('/execute', async (req, res) => {
  try {
    console.log('🚀 Starting users table creation...');
    
    // Step 1: Create users table
    console.log('📋 Creating users table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` VARCHAR(36) NOT NULL PRIMARY KEY,
        \`email\` VARCHAR(255) UNIQUE NOT NULL,
        \`password_hash\` VARCHAR(255) NOT NULL,
        \`first_name\` VARCHAR(100) NOT NULL,
        \`last_name\` VARCHAR(100) NOT NULL,
        \`department\` VARCHAR(100) NULL,
        \`position\` VARCHAR(100) NULL,
        \`is_active\` BOOLEAN DEFAULT TRUE,
        \`last_login\` TIMESTAMP NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX \`idx_users_email\` (\`email\`),
        INDEX \`idx_users_department\` (\`department\`),
        INDEX \`idx_users_active\` (\`is_active\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('✅ Users table created successfully');
    
    // Step 2: Create work_orders table
    console.log('📋 Creating work_orders table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS \`work_orders\` (
        \`id\` VARCHAR(36) NOT NULL PRIMARY KEY,
        \`title\` VARCHAR(255) NOT NULL,
        \`description\` TEXT,
        \`status\` ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
        \`priority\` ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
        \`assigned_to\` VARCHAR(36) NULL,
        \`created_by\` VARCHAR(36) NOT NULL,
        \`site_id\` CHAR(2) NULL,
        \`equipment_type\` VARCHAR(50) NULL,
        \`equipment_id\` BIGINT UNSIGNED NULL,
        \`scheduled_date\` DATE NULL,
        \`completed_date\` DATE NULL,
        \`estimated_hours\` DECIMAL(5,2) NULL,
        \`actual_hours\` DECIMAL(5,2) NULL,
        \`notes\` TEXT,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX \`idx_work_orders_status\` (\`status\`),
        INDEX \`idx_work_orders_priority\` (\`priority\`),
        INDEX \`idx_work_orders_assigned_to\` (\`assigned_to\`),
        INDEX \`idx_work_orders_created_by\` (\`created_by\`),
        INDEX \`idx_work_orders_site_id\` (\`site_id\`),
        FOREIGN KEY (\`assigned_to\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL,
        FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
        FOREIGN KEY (\`site_id\`) REFERENCES \`TDL\`(\`id\`) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('✅ Work orders table created successfully');
    
    // Step 3: Create initial admin user
    console.log('👤 Creating initial admin user...');
    const adminId = crypto.randomUUID();
    const adminEmail = 'admin@infrastructure.com';
    const adminPassword = 'Admin123!';
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
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
      ON DUPLICATE KEY UPDATE
        \`updated_at\` = NOW()
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
    
    console.log('✅ Initial admin user created successfully');
    
    // Step 4: Verify creation
    const [userCount] = await db.execute('SELECT COUNT(*) as count FROM users');
    const [workOrderCount] = await db.execute('SELECT COUNT(*) as count FROM work_orders');
    
    console.log('🎉 Database setup completed successfully!');
    
    res.json({
      status: 'success',
      message: 'Users table and authentication system created successfully',
      data: {
        users_table_created: true,
        work_orders_table_created: true,
        admin_user_created: true,
        admin_credentials: {
          email: adminEmail,
          password: adminPassword,
          warning: 'Change this password after first login!'
        },
        statistics: {
          total_users: userCount[0].count,
          total_work_orders: workOrderCount[0].count
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
    console.error('❌ Users table creation failed:', error);
    res.status(500).json({
      error: 'Failed to create users table',
      code: 'TABLE_CREATION_ERROR',
      message: error.message,
      sql_state: error.sqlState || 'unknown',
      sql_message: error.sqlMessage || 'unknown'
    });
  }
});

// GET /api/create-users-table/status - Check if users table exists
router.get('/status', async (req, res) => {
  try {
    const [tables] = await db.execute(`SHOW TABLES LIKE 'users'`);
    const usersTableExists = tables.length > 0;
    
    let userCount = 0;
    let adminExists = false;
    
    if (usersTableExists) {
      const [users] = await db.execute('SELECT COUNT(*) as count FROM users');
      userCount = users[0].count;
      
      const [admins] = await db.execute(
        'SELECT COUNT(*) as count FROM users WHERE email = ?',
        ['admin@infrastructure.com']
      );
      adminExists = admins[0].count > 0;
    }
    
    res.json({
      status: 'success',
      data: {
        users_table_exists: usersTableExists,
        user_count: userCount,
        admin_exists: adminExists,
        setup_required: !usersTableExists,
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
