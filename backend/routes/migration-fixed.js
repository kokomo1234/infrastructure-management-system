const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Migration status tracking
let migrationStatus = {
  isRunning: false,
  completed: false,
  error: null,
  progress: [],
  startTime: null,
  endTime: null
};

// Helper function to check if column exists
async function columnExists(tableName, columnName) {
  try {
    const [columns] = await db.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = ? 
        AND COLUMN_NAME = ?
    `, [tableName, columnName]);
    return columns.length > 0;
  } catch (error) {
    return false;
  }
}

// Helper function to check if table exists
async function tableExists(tableName) {
  try {
    const [tables] = await db.execute(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = ?
    `, [tableName]);
    return tables.length > 0;
  } catch (error) {
    return false;
  }
}

// GET /api/migration/status - Check migration status
router.get('/status', (req, res) => {
  res.json({
    status: 'success',
    data: migrationStatus
  });
});

// POST /api/migration/execute - Execute the database migration
router.post('/execute', async (req, res) => {
  if (migrationStatus.isRunning) {
    return res.status(409).json({
      status: 'error',
      message: 'Migration is already running'
    });
  }

  if (migrationStatus.completed) {
    return res.status(409).json({
      status: 'error',
      message: 'Migration has already been completed'
    });
  }

  // Reset migration status
  migrationStatus = {
    isRunning: true,
    completed: false,
    error: null,
    progress: [],
    startTime: new Date().toISOString(),
    endTime: null
  };

  // Send immediate response
  res.json({
    status: 'success',
    message: 'Migration started',
    data: { migrationId: Date.now() }
  });

  // Execute migration asynchronously
  executeMigration();
});

// GET /api/migration/verify - Verify database schema after migration
router.get('/verify', async (req, res) => {
  try {
    const verification = await verifyMigration();
    res.json({
      status: 'success',
      data: verification
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Verification failed',
      error: error.message
    });
  }
});

async function executeMigration() {
  try {
    migrationStatus.progress.push({
      step: 'Starting migration',
      timestamp: new Date().toISOString(),
      status: 'info'
    });

    // Step 1: Check current database state
    migrationStatus.progress.push({
      step: 'Checking current database state',
      timestamp: new Date().toISOString(),
      status: 'running'
    });

    const [currentTables] = await db.execute(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
    `);

    migrationStatus.progress.push({
      step: `Found ${currentTables.length} existing tables`,
      timestamp: new Date().toISOString(),
      status: 'success'
    });

    // Step 2: Enhance TDL table - Add columns one by one
    migrationStatus.progress.push({
      step: 'Enhancing TDL table with site management fields',
      timestamp: new Date().toISOString(),
      status: 'running'
    });

    const tdlColumns = [
      { name: 'name', definition: 'VARCHAR(255) NOT NULL DEFAULT \'Site TDL\' AFTER `region`' },
      { name: 'class', definition: 'VARCHAR(10) NOT NULL DEFAULT \'1\' AFTER `name`' },
      { name: 'phase', definition: 'VARCHAR(50) NOT NULL DEFAULT \'Triphasé\' AFTER `class`' },
      { name: 'voltage', definition: 'VARCHAR(50) NOT NULL DEFAULT \'347/600\' AFTER `phase`' },
      { name: 'power_factor', definition: 'DECIMAL(3,2) NOT NULL DEFAULT 0.95 AFTER `voltage`' },
      { name: 'status', definition: 'VARCHAR(50) NOT NULL DEFAULT \'Actif\' AFTER `power_factor`' },
      { name: 'total_capacity_kw', definition: 'DECIMAL(10,2) NULL AFTER `status`' },
      { name: 'used_capacity_kw', definition: 'DECIMAL(10,2) NULL AFTER `total_capacity_kw`' },
      { name: 'emergency_percentage', definition: 'INT DEFAULT 80 AFTER `used_capacity_kw`' },
      { name: 'created_at', definition: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER `emergency_percentage`' },
      { name: 'updated_at', definition: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`' }
    ];

    for (const column of tdlColumns) {
      if (!(await columnExists('TDL', column.name))) {
        await db.execute(`ALTER TABLE \`TDL\` ADD COLUMN \`${column.name}\` ${column.definition}`);
      }
    }

    migrationStatus.progress.push({
      step: 'TDL table enhanced successfully',
      timestamp: new Date().toISOString(),
      status: 'success'
    });

    // Step 3: Fix TDL data types
    migrationStatus.progress.push({
      step: 'Fixing TDL data types',
      timestamp: new Date().toISOString(),
      status: 'running'
    });

    await db.execute(`
      ALTER TABLE \`TDL\`
      MODIFY COLUMN \`adresse\` VARCHAR(255) NOT NULL,
      MODIFY COLUMN \`ville\` VARCHAR(255) NOT NULL,
      MODIFY COLUMN \`code_postal\` VARCHAR(20) NOT NULL
    `);

    migrationStatus.progress.push({
      step: 'TDL data types fixed',
      timestamp: new Date().toISOString(),
      status: 'success'
    });

    // Step 4: Enhance AC table
    migrationStatus.progress.push({
      step: 'Enhancing AC table with advanced equipment tracking',
      timestamp: new Date().toISOString(),
      status: 'running'
    });

    const acColumns = [
      { name: 'current_load', definition: 'DECIMAL(10,2) DEFAULT 0 AFTER `output_ac`' },
      { name: 'pair_id', definition: 'VARCHAR(255) NULL AFTER `current_load`' },
      { name: 'is_redundant', definition: 'BOOLEAN DEFAULT FALSE AFTER `pair_id`' },
      { name: 'efficiency', definition: 'DECIMAL(5,2) NULL AFTER `is_redundant`' },
      { name: 'manufacturer', definition: 'VARCHAR(255) NULL AFTER `efficiency`' },
      { name: 'installation_date', definition: 'DATE NULL AFTER `manufacturer`' },
      { name: 'last_maintenance', definition: 'DATE NULL AFTER `installation_date`' },
      { name: 'next_maintenance', definition: 'DATE NULL AFTER `last_maintenance`' },
      { name: 'specifications', definition: 'JSON NULL AFTER `next_maintenance`' },
      { name: 'created_at', definition: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER `specifications`' },
      { name: 'updated_at', definition: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`' }
    ];

    for (const column of acColumns) {
      if (!(await columnExists('AC', column.name))) {
        await db.execute(`ALTER TABLE \`AC\` ADD COLUMN \`${column.name}\` ${column.definition}`);
      }
    }

    migrationStatus.progress.push({
      step: 'AC table enhanced successfully',
      timestamp: new Date().toISOString(),
      status: 'success'
    });

    // Step 5: Create users table
    migrationStatus.progress.push({
      step: 'Creating users management table',
      timestamp: new Date().toISOString(),
      status: 'running'
    });

    if (!(await tableExists('users'))) {
      await db.execute(`
        CREATE TABLE \`users\` (
          \`id\` VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
          \`email\` VARCHAR(255) NOT NULL UNIQUE,
          \`password_hash\` VARCHAR(255) NOT NULL,
          \`first_name\` VARCHAR(100) NULL,
          \`last_name\` VARCHAR(100) NULL,
          \`display_name\` VARCHAR(255) NULL,
          \`phone\` VARCHAR(50) NULL,
          \`department\` VARCHAR(100) NULL,
          \`position\` VARCHAR(100) NULL,
          \`is_active\` BOOLEAN DEFAULT TRUE,
          \`last_login\` TIMESTAMP NULL,
          \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
    }

    migrationStatus.progress.push({
      step: 'Users table created successfully',
      timestamp: new Date().toISOString(),
      status: 'success'
    });

    // Step 6: Create work orders table
    migrationStatus.progress.push({
      step: 'Creating work orders table',
      timestamp: new Date().toISOString(),
      status: 'running'
    });

    if (!(await tableExists('work_orders'))) {
      await db.execute(`
        CREATE TABLE \`work_orders\` (
          \`id\` VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
          \`title\` VARCHAR(255) NOT NULL,
          \`description\` TEXT NULL,
          \`priority\` ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
          \`status\` ENUM('draft', 'open', 'in_progress', 'completed', 'cancelled') DEFAULT 'open',
          \`type\` VARCHAR(100) NULL,
          \`site_id\` VARCHAR(10) NULL,
          \`site_type\` ENUM('TDL', 'TSF') NULL,
          \`equipment_type\` VARCHAR(50) NULL,
          \`equipment_id\` BIGINT UNSIGNED NULL,
          \`assigned_to\` VARCHAR(36) NULL,
          \`created_by\` VARCHAR(36) NOT NULL,
          \`scheduled_date\` TIMESTAMP NULL,
          \`due_date\` TIMESTAMP NULL,
          \`completed_date\` TIMESTAMP NULL,
          \`estimated_hours\` DECIMAL(5,2) NULL,
          \`actual_hours\` DECIMAL(5,2) NULL,
          \`cost\` DECIMAL(10,2) NULL,
          \`notes\` TEXT NULL,
          \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
    }

    migrationStatus.progress.push({
      step: 'Work orders table created successfully',
      timestamp: new Date().toISOString(),
      status: 'success'
    });

    // Step 7: Add performance indexes
    migrationStatus.progress.push({
      step: 'Adding performance indexes',
      timestamp: new Date().toISOString(),
      status: 'running'
    });

    const indexes = [
      'ALTER TABLE `TDL` ADD INDEX `idx_tdl_region` (`region`)',
      'ALTER TABLE `TDL` ADD INDEX `idx_tdl_status` (`status`)',
      'ALTER TABLE `AC` ADD INDEX `idx_ac_tdl` (`TDL_id`)',
      'ALTER TABLE `AC` ADD INDEX `idx_ac_type` (`type`)',
      'ALTER TABLE `work_orders` ADD INDEX `idx_work_orders_status` (`status`)'
    ];

    for (const indexQuery of indexes) {
      try {
        await db.execute(indexQuery);
      } catch (error) {
        // Ignore duplicate index errors
        if (!error.message.includes('Duplicate key name')) {
          throw error;
        }
      }
    }

    migrationStatus.progress.push({
      step: 'Performance indexes added',
      timestamp: new Date().toISOString(),
      status: 'success'
    });

    // Step 8: Update existing data
    migrationStatus.progress.push({
      step: 'Updating existing data with meaningful values',
      timestamp: new Date().toISOString(),
      status: 'running'
    });

    await db.execute(`UPDATE \`TDL\` SET \`name\` = CONCAT('Site TDL ', \`id\`) WHERE \`name\` = 'Site TDL'`);

    // Calculate capacity values
    await db.execute(`
      UPDATE \`TDL\` t SET 
        \`total_capacity_kw\` = (
          SELECT COALESCE(SUM(a.output_ac), 0) / 1000 
          FROM \`AC\` a WHERE a.TDL_id = t.id
        ),
        \`used_capacity_kw\` = t.charge_ac / 1000
      WHERE \`total_capacity_kw\` IS NULL
    `);

    migrationStatus.progress.push({
      step: 'Existing data updated successfully',
      timestamp: new Date().toISOString(),
      status: 'success'
    });

    // Step 9: Final verification
    const verification = await verifyMigration();
    
    migrationStatus.progress.push({
      step: 'Migration verification completed',
      timestamp: new Date().toISOString(),
      status: 'success',
      details: verification
    });

    // Mark migration as completed
    migrationStatus.isRunning = false;
    migrationStatus.completed = true;
    migrationStatus.endTime = new Date().toISOString();

    migrationStatus.progress.push({
      step: 'MIGRATION COMPLETED SUCCESSFULLY',
      timestamp: new Date().toISOString(),
      status: 'success'
    });

  } catch (error) {
    migrationStatus.isRunning = false;
    migrationStatus.error = error.message;
    migrationStatus.progress.push({
      step: 'Migration failed',
      timestamp: new Date().toISOString(),
      status: 'error',
      error: error.message
    });
  }
}

async function verifyMigration() {
  // Check TDL table structure
  const [tdlColumns] = await db.execute('DESCRIBE `TDL`');
  
  // Check AC table structure
  const [acColumns] = await db.execute('DESCRIBE `AC`');
  
  // Check new tables
  const [newTables] = await db.execute(`
    SELECT TABLE_NAME 
    FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN ('users', 'work_orders')
  `);
  
  // Check data integrity
  const [dataCounts] = await db.execute(`
    SELECT 
      (SELECT COUNT(*) FROM \`TDL\`) as tdl_count,
      (SELECT COUNT(*) FROM \`AC\`) as ac_count,
      (SELECT COUNT(*) FROM \`DC\`) as dc_count
  `);
  
  // Test TDL-AC relationship
  const [relationshipTest] = await db.execute(`
    SELECT t.id, t.name, COUNT(a.id) as equipment_count
    FROM TDL t 
    LEFT JOIN AC a ON t.id = a.TDL_id 
    GROUP BY t.id, t.name
    LIMIT 3
  `);

  return {
    tdl_columns: tdlColumns.length,
    ac_columns: acColumns.length,
    new_tables: newTables.map(t => t.TABLE_NAME),
    data_counts: dataCounts[0],
    relationship_test: relationshipTest,
    verification_time: new Date().toISOString()
  };
}

module.exports = router;
