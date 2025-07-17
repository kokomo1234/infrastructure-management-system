const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all AC records
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT ac.*, f.nom as fabricant_nom, fou.nom as fournisseur_nom 
      FROM AC ac 
      LEFT JOIN Fabricant f ON ac.fabricant_id = f.id 
      LEFT JOIN Fournisseurs fou ON ac.fournisseur_id = fou.id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching AC records:', error);
    res.status(500).json({ error: 'Failed to fetch AC records' });
  }
});

// GET AC by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT ac.*, f.nom as fabricant_nom, fou.nom as fournisseur_nom 
      FROM AC ac 
      LEFT JOIN Fabricant f ON ac.fabricant_id = f.id 
      LEFT JOIN Fournisseurs fou ON ac.fournisseur_id = fou.id
      WHERE ac.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'AC record not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching AC record:', error);
    res.status(500).json({ error: 'Failed to fetch AC record' });
  }
});

// POST create new AC
router.post('/', async (req, res) => {
  const {
    nom, type, output_ac, TDL_id, TSF_id, Paire_id, port_sw, gateway, netmask,
    date_inst, voltage, phase, puissance_tot, Bypass, commentaire, ING, modèle,
    no_série, fournisseur_id, fabricant_id, ip, username, password, OOD, SLA
  } = req.body;
  
  try {
    const [result] = await db.execute(`
      INSERT INTO AC (
        nom, type, output_ac, TDL_id, TSF_id, Paire_id, port_sw, gateway, netmask,
        date_inst, voltage, phase, puissance_tot, Bypass, commentaire, ING, modèle,
        no_série, fournisseur_id, fabricant_id, ip, username, password, OOD, SLA
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      nom, type, output_ac, TDL_id, TSF_id, Paire_id, port_sw, gateway, netmask,
      date_inst, voltage, phase, puissance_tot, Bypass, commentaire, ING, modèle,
      no_série, fournisseur_id, fabricant_id, ip, username, password, OOD, SLA
    ]);
    
    res.status(201).json({ message: 'AC record created successfully', id: result.insertId });
  } catch (error) {
    console.error('Error creating AC record:', error);
    res.status(500).json({ error: 'Failed to create AC record' });
  }
});

// PUT update AC
router.put('/:id', async (req, res) => {
  const {
    nom, type, output_ac, TDL_id, TSF_id, Paire_id, port_sw, gateway, netmask,
    date_inst, voltage, phase, puissance_tot, Bypass, commentaire, ING, modèle,
    no_série, fournisseur_id, fabricant_id, ip, username, password, OOD, SLA
  } = req.body;
  
  try {
    const [result] = await db.execute(`
      UPDATE AC SET 
        nom = ?, type = ?, output_ac = ?, TDL_id = ?, TSF_id = ?, Paire_id = ?, 
        port_sw = ?, gateway = ?, netmask = ?, date_inst = ?, voltage = ?, phase = ?, 
        puissance_tot = ?, Bypass = ?, commentaire = ?, ING = ?, modèle = ?, 
        no_série = ?, fournisseur_id = ?, fabricant_id = ?, ip = ?, username = ?, 
        password = ?, OOD = ?, SLA = ?
      WHERE id = ?
    `, [
      nom, type, output_ac, TDL_id, TSF_id, Paire_id, port_sw, gateway, netmask,
      date_inst, voltage, phase, puissance_tot, Bypass, commentaire, ING, modèle,
      no_série, fournisseur_id, fabricant_id, ip, username, password, OOD, SLA,
      req.params.id
    ]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'AC record not found' });
    }
    
    res.json({ message: 'AC record updated successfully' });
  } catch (error) {
    console.error('Error updating AC record:', error);
    res.status(500).json({ error: 'Failed to update AC record' });
  }
});

// DELETE AC
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM AC WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'AC record not found' });
    }
    
    res.json({ message: 'AC record deleted successfully' });
  } catch (error) {
    console.error('Error deleting AC record:', error);
    res.status(500).json({ error: 'Failed to delete AC record' });
  }
});

module.exports = router;
