const express = require('express');
const router = express.Router();
const db = require('../config/database');

// POST /api/migration/fix-capacity - Fix the capacity calculation
router.post('/fix-capacity', async (req, res) => {
  try {
    console.log('🔧 Starting capacity calculation fix...');
    
    // Step 1: Update TDL names with meaningful values (if not already done)
    await db.execute(`
      UPDATE \`TDL\` 
      SET \`name\` = CONCAT('Site TDL ', \`id\`) 
      WHERE \`name\` = 'Site TDL' OR \`name\` IS NULL
    `);
    
    console.log('✅ TDL names updated');

    // Step 2: Calculate capacity values using proper string comparison
    // First, let's see what TDL_id values we have in AC table
    const [acTdlIds] = await db.execute(`
      SELECT DISTINCT TDL_id, COUNT(*) as count 
      FROM \`AC\` 
      WHERE TDL_id IS NOT NULL 
      GROUP BY TDL_id
    `);
    
    console.log('AC TDL_id values:', acTdlIds);

    // Step 3: Update capacity for each TDL site individually
    const [tdlSites] = await db.execute(`SELECT id FROM \`TDL\``);
    
    for (const site of tdlSites) {
      // Calculate total capacity for this specific TDL site
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

    // Step 4: Verify the results
    const [verificationResults] = await db.execute(`
      SELECT 
        id, 
        name, 
        total_capacity_kw, 
        used_capacity_kw, 
        remaining_capacity_kw,
        (SELECT COUNT(*) FROM AC WHERE AC.TDL_id = TDL.id) as ac_equipment_count
      FROM \`TDL\`
    `);

    console.log('✅ Capacity calculation completed successfully');

    res.json({
      status: 'success',
      message: 'Capacity calculation fixed successfully',
      data: {
        updated_sites: verificationResults,
        ac_tdl_mapping: acTdlIds
      }
    });

  } catch (error) {
    console.error('❌ Capacity calculation fix failed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Capacity calculation fix failed',
      error: error.message
    });
  }
});

// GET /api/migration/capacity-status - Check current capacity values
router.get('/capacity-status', async (req, res) => {
  try {
    // Get current TDL capacity values
    const [tdlCapacities] = await db.execute(`
      SELECT 
        id, 
        name, 
        charge_ac,
        total_capacity_kw, 
        used_capacity_kw, 
        remaining_capacity_kw
      FROM \`TDL\`
    `);

    // Get AC equipment mapping
    const [acMapping] = await db.execute(`
      SELECT 
        TDL_id,
        nom,
        type,
        output_ac
      FROM \`AC\`
      WHERE TDL_id IS NOT NULL
      ORDER BY TDL_id, nom
    `);

    // Get summary by TDL
    const [summary] = await db.execute(`
      SELECT 
        t.id,
        t.name,
        COUNT(a.id) as ac_count,
        SUM(a.output_ac) as total_ac_output
      FROM \`TDL\` t
      LEFT JOIN \`AC\` a ON t.id = a.TDL_id
      GROUP BY t.id, t.name
    `);

    res.json({
      status: 'success',
      data: {
        tdl_capacities: tdlCapacities,
        ac_equipment: acMapping,
        summary: summary
      }
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to get capacity status',
      error: error.message
    });
  }
});

module.exports = router;
