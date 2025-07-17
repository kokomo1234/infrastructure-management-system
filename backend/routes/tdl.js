const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all TDL records
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM TDL');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching TDL records:', error);
    res.status(500).json({ error: 'Failed to fetch TDL records' });
  }
});

// GET TDL by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM TDL WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'TDL record not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching TDL record:', error);
    res.status(500).json({ error: 'Failed to fetch TDL record' });
  }
});

// POST create new TDL
router.post('/', async (req, res) => {
  const { id, region, SDS, esp_plan, nb_cab, charge_ac, charge_dc, charge_gen, charge_clim, adresse, ville, code_postal } = req.body;
  
  try {
    const [result] = await db.execute(
      'INSERT INTO TDL (id, region, SDS, esp_plan, nb_cab, charge_ac, charge_dc, charge_gen, charge_clim, adresse, ville, code_postal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, region, SDS, esp_plan, nb_cab, charge_ac, charge_dc, charge_gen, charge_clim, adresse, ville, code_postal]
    );
    res.status(201).json({ message: 'TDL record created successfully', id: id });
  } catch (error) {
    console.error('Error creating TDL record:', error);
    res.status(500).json({ error: 'Failed to create TDL record' });
  }
});

// PUT update TDL
router.put('/:id', async (req, res) => {
  const { region, SDS, esp_plan, nb_cab, charge_ac, charge_dc, charge_gen, charge_clim, adresse, ville, code_postal } = req.body;
  
  try {
    const [result] = await db.execute(
      'UPDATE TDL SET region = ?, SDS = ?, esp_plan = ?, nb_cab = ?, charge_ac = ?, charge_dc = ?, charge_gen = ?, charge_clim = ?, adresse = ?, ville = ?, code_postal = ? WHERE id = ?',
      [region, SDS, esp_plan, nb_cab, charge_ac, charge_dc, charge_gen, charge_clim, adresse, ville, code_postal, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'TDL record not found' });
    }
    
    res.json({ message: 'TDL record updated successfully' });
  } catch (error) {
    console.error('Error updating TDL record:', error);
    res.status(500).json({ error: 'Failed to update TDL record' });
  }
});

// DELETE TDL
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM TDL WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'TDL record not found' });
    }
    
    res.json({ message: 'TDL record deleted successfully' });
  } catch (error) {
    console.error('Error deleting TDL record:', error);
    res.status(500).json({ error: 'Failed to delete TDL record' });
  }
});

module.exports = router;
