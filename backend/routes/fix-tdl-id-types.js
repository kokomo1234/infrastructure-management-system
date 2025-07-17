const express = require('express');
const router = express.Router();
const db = require('../config/database');

// POST /api/migration/fix-tdl-types - Fix TDL ID data type discrepancy
router.post('/fix-tdl-types', async (req, res) => {
  try {
    console.log('🔧 Starting TDL ID type fix...');
    
    // Step 1: Check current state
    const [currentTdl] = await db.execute(`SELECT id FROM \`TDL\` ORDER BY id`);
    const [currentAc] = await db.execute(`SELECT TDL_id, nom FROM \`AC\` WHERE TDL_id IS NOT NULL`);
    
    console.log('Current TDL IDs:', currentTdl.map(t => t.id));
    console.log('Current AC TDL_ids:', currentAc.map(a => a.TDL_id));

    // Step 2: Create mapping from string TDL IDs to integers
    const tdlMapping = {
      'T1': 1,
      'T2': 2,
      'T3': 3
    };

    // Step 3: Update TDL table - change IDs from strings to integers
    console.log('📝 Updating TDL table IDs...');
    
    // First, temporarily disable foreign key checks
    await db.execute('SET FOREIGN_KEY_CHECKS = 0');
    
    // Create a temporary column for the new integer IDs
    await db.execute('ALTER TABLE `TDL` ADD COLUMN `new_id` INT NOT NULL DEFAULT 0');
    
    // Update the new_id column with integer values
    for (const [stringId, intId] of Object.entries(tdlMapping)) {
      await db.execute('UPDATE `TDL` SET `new_id` = ? WHERE `id` = ?', [intId, stringId]);
      console.log(`✅ Mapped TDL ${stringId} -> ${intId}`);
    }

    // Step 4: Update all foreign key references before changing primary key
    console.log('📝 Updating foreign key references...');
    
    // Update AC table TDL_id references
    const [acRecords] = await db.execute('SELECT id, TDL_id FROM `AC`');
    for (const ac of acRecords) {
      // If TDL_id is already an integer and matches our mapping, keep it
      // If it's a string, convert it
      let newTdlId = ac.TDL_id;
      
      // Check if we need to update based on our mapping
      const stringKey = Object.keys(tdlMapping).find(key => tdlMapping[key] === ac.TDL_id);
      if (!stringKey) {
        // This means TDL_id is already correct integer, no change needed
        console.log(`AC ${ac.id}: TDL_id ${ac.TDL_id} already correct`);
      }
    }

    // Update other tables that might reference TDL_id
    const tablesToUpdate = ['DC', 'GEN_TSW', 'HVAC', 'Besoin'];
    
    for (const tableName of tablesToUpdate) {
      try {
        // Check if table exists and has TDL_id column
        const [columns] = await db.execute(`
          SELECT COLUMN_NAME 
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = ? 
            AND COLUMN_NAME = 'TDL_id'
        `, [tableName]);
        
        if (columns.length > 0) {
          // Update string TDL_id references to integers
          for (const [stringId, intId] of Object.entries(tdlMapping)) {
            await db.execute(`UPDATE \`${tableName}\` SET TDL_id = ? WHERE TDL_id = ?`, [intId, stringId]);
          }
          console.log(`✅ Updated ${tableName} TDL_id references`);
        }
      } catch (error) {
        console.log(`⚠️  Table ${tableName} doesn't exist or doesn't have TDL_id column`);
      }
    }

    // Step 5: Drop the old primary key and rename new_id to id
    console.log('📝 Updating TDL primary key...');
    
    // Drop the old primary key
    await db.execute('ALTER TABLE `TDL` DROP PRIMARY KEY');
    
    // Drop the old id column
    await db.execute('ALTER TABLE `TDL` DROP COLUMN `id`');
    
    // Rename new_id to id and make it primary key
    await db.execute('ALTER TABLE `TDL` CHANGE `new_id` `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY');

    // Step 6: Update AC table to ensure TDL_id is INT
    console.log('📝 Ensuring AC.TDL_id is INT...');
    await db.execute('ALTER TABLE `AC` MODIFY COLUMN `TDL_id` INT NULL');

    // Step 7: Re-enable foreign key checks
    await db.execute('SET FOREIGN_KEY_CHECKS = 1');

    // Step 8: Now fix the capacity calculation with proper integer relationships
    console.log('📝 Calculating capacities with fixed relationships...');
    
    const [tdlSites] = await db.execute(`SELECT id FROM \`TDL\``);
    
    for (const site of tdlSites) {
      // Calculate total capacity for this TDL site
      const [capacityResult] = await db.execute(`
        SELECT COALESCE(SUM(output_ac), 0) as total_output
        FROM \`AC\` 
        WHERE TDL_id = ?
      `, [site.id]);
      
      const totalCapacityKw = capacityResult[0].total_output / 1000;
      
      // Get current charge_ac for used capacity
      const [currentCharge] = await db.execute(`
        SELECT charge_ac FROM \`TDL\` WHERE id = ?
      `, [site.id]);
      
      const usedCapacityKw = currentCharge[0].charge_ac / 1000;
      const remainingCapacityKw = totalCapacityKw - usedCapacityKw;
      
      // Update the TDL record
      await db.execute(`
        UPDATE \`TDL\` 
        SET 
          \`total_capacity_kw\` = ?,
          \`used_capacity_kw\` = ?,
          \`remaining_capacity_kw\` = ?
        WHERE id = ?
      `, [totalCapacityKw, usedCapacityKw, remainingCapacityKw, site.id]);
      
      console.log(`✅ Updated capacity for TDL ${site.id}: Total=${totalCapacityKw}kW, Used=${usedCapacityKw}kW, Remaining=${remainingCapacityKw}kW`);
    }

    // Step 9: Verify the results
    const [verificationResults] = await db.execute(`
      SELECT 
        t.id, 
        t.name, 
        t.total_capacity_kw, 
        t.used_capacity_kw, 
        t.remaining_capacity_kw,
        COUNT(a.id) as ac_equipment_count,
        SUM(a.output_ac) as total_ac_output
      FROM \`TDL\` t
      LEFT JOIN \`AC\` a ON t.id = a.TDL_id
      GROUP BY t.id, t.name, t.total_capacity_kw, t.used_capacity_kw, t.remaining_capacity_kw
    `);

    console.log('✅ TDL ID type fix completed successfully');

    res.json({
      status: 'success',
      message: 'TDL ID types fixed successfully - all IDs are now integers',
      data: {
        mapping_applied: tdlMapping,
        updated_sites: verificationResults
      }
    });

  } catch (error) {
    console.error('❌ TDL ID type fix failed:', error);
    
    // Try to re-enable foreign key checks in case of error
    try {
      await db.execute('SET FOREIGN_KEY_CHECKS = 1');
    } catch (fkError) {
      console.error('Failed to re-enable foreign key checks:', fkError);
    }
    
    res.status(500).json({
      status: 'error',
      message: 'TDL ID type fix failed',
      error: error.message
    });
  }
});

// GET /api/migration/tdl-types-status - Check current TDL ID types
router.get('/tdl-types-status', async (req, res) => {
  try {
    // Check TDL table structure
    const [tdlStructure] = await db.execute('DESCRIBE `TDL`');
    const idColumn = tdlStructure.find(col => col.Field === 'id');
    
    // Get current TDL data
    const [tdlData] = await db.execute(`SELECT id, name FROM \`TDL\` ORDER BY id`);
    
    // Check AC table structure
    const [acStructure] = await db.execute('DESCRIBE `AC`');
    const tdlIdColumn = acStructure.find(col => col.Field === 'TDL_id');
    
    // Get AC data with TDL relationships
    const [acData] = await db.execute(`
      SELECT a.id, a.nom, a.TDL_id, a.output_ac, t.name as tdl_name
      FROM \`AC\` a
      LEFT JOIN \`TDL\` t ON a.TDL_id = t.id
      ORDER BY a.TDL_id, a.nom
    `);

    // Test the relationship
    const [relationshipTest] = await db.execute(`
      SELECT 
        t.id,
        t.name,
        COUNT(a.id) as ac_count,
        SUM(a.output_ac) as total_output
      FROM \`TDL\` t
      LEFT JOIN \`AC\` a ON t.id = a.TDL_id
      GROUP BY t.id, t.name
      ORDER BY t.id
    `);

    res.json({
      status: 'success',
      data: {
        tdl_id_type: idColumn?.Type || 'unknown',
        ac_tdl_id_type: tdlIdColumn?.Type || 'unknown',
        tdl_sites: tdlData,
        ac_equipment: acData,
        relationship_test: relationshipTest
      }
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to get TDL types status',
      error: error.message
    });
  }
});

module.exports = router;
