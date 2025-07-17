const express = require('express');
const router = express.Router();
const db = require('../config/database');
const fs = require('fs');
const path = require('path');

// Migration status tracking
let migrationStatus = {
  isRunning: false,
  completed: false,
  error: null,
  progress: [],
  startTime: null,
  endTime: null
};

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

// GET /api/migration/rollback - Rollback migration (if needed)
router.post('/rollback', async (req, res) => {
  try {
    // This would implement rollback logic
    res.json({
      status: 'success',
      message: 'Rollback functionality not implemented yet - contact administrator'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Rollback failed',
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

    // Step 2: Enhance TDL table
    migrationStatus.progress.push({
      step: 'Enhancing TDL table with site management fields',
      timestamp: new Date().toISOString(),
      status: 'running'
    });

    await db.execute(`
      ALTER TABLE \`TDL\` 
      ADD COLUMN IF NOT EXISTS \`name\` VARCHAR(255) NOT NULL DEFAULT 'Site TDL' AFTER \`region\`,
      ADD COLUMN IF NOT EXISTS \`class\` VARCHAR(10) NOT NULL DEFAULT '1' AFTER \`name\`,
      ADD COLUMN IF NOT EXISTS \`phase\` VARCHAR(50) NOT NULL DEFAULT 'Triphasé' AFTER \`class\`,
      ADD COLUMN IF NOT EXISTS \`voltage\` VARCHAR(50) NOT NULL DEFAULT '347/600' AFTER \`phase\`,
      ADD COLUMN IF NOT EXISTS \`power_factor\` DECIMAL(3,2) NOT NULL DEFAULT 0.95 AFTER \`voltage\`,
      ADD COLUMN IF NOT EXISTS \`status\` VARCHAR(50) NOT NULL DEFAULT 'Actif' AFTER \`power_factor\`,
      ADD COLUMN IF NOT EXISTS \`total_capacity_kw\` DECIMAL(10,2) NULL AFTER \`status\`,
      ADD COLUMN IF NOT EXISTS \`used_capacity_kw\` DECIMAL(10,2) NULL AFTER \`total_capacity_kw\`,
      ADD COLUMN IF NOT EXISTS \`emergency_percentage\` INT DEFAULT 80 AFTER \`used_capacity_kw\`,
      ADD COLUMN IF NOT EXISTS \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER \`emergency_percentage\`,
      ADD COLUMN IF NOT EXISTS \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER \`created_at\`
    `);

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

    await db.execute(`
      ALTER TABLE \`AC\`
      ADD COLUMN IF NOT EXISTS \`current_load\` DECIMAL(10,2) DEFAULT 0 AFTER \`output_ac\`,
      ADD COLUMN IF NOT EXISTS \`pair_id\` VARCHAR(255) NULL AFTER \`current_load\`,
      ADD COLUMN IF NOT EXISTS \`is_redundant\` BOOLEAN DEFAULT FALSE AFTER \`pair_id\`,
      ADD COLUMN IF NOT EXISTS \`efficiency\` DECIMAL(5,2) NULL AFTER \`is_redundant\`,
      ADD COLUMN IF NOT EXISTS \`manufacturer\` VARCHAR(255) NULL AFTER \`efficiency\`,
      ADD COLUMN IF NOT EXISTS \`installation_date\` DATE NULL AFTER \`manufacturer\`,
      ADD COLUMN IF NOT EXISTS \`last_maintenance\` DATE NULL AFTER \`installation_date\`,
      ADD COLUMN IF NOT EXISTS \`next_maintenance\` DATE NULL AFTER \`last_maintenance\`,
      ADD COLUMN IF NOT EXISTS \`specifications\` JSON NULL AFTER \`next_maintenance\`,
      ADD COLUMN IF NOT EXISTS \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER \`specifications\`,
      ADD COLUMN IF NOT EXISTS \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER \`created_at\`
    `);

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

    await db.execute(`
      CREATE TABLE IF NOT EXISTS \`users\` (
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

    await db.execute(`
      CREATE TABLE IF NOT EXISTS \`work_orders\` (
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
      'ALTER TABLE `TDL` ADD INDEX IF NOT EXISTS `idx_tdl_region` (`region`)',
      'ALTER TABLE `TDL` ADD INDEX IF NOT EXISTS `idx_tdl_status` (`status`)',
      'ALTER TABLE `AC` ADD INDEX IF NOT EXISTS `idx_ac_tdl` (`TDL_id`)',
      'ALTER TABLE `AC` ADD INDEX IF NOT EXISTS `idx_ac_type` (`type`)',
      'ALTER TABLE `work_orders` ADD INDEX IF NOT EXISTS `idx_work_orders_status` (`status`)'
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
