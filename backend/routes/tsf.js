const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all TSF records
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM TSF');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching TSF records:', error);
    res.status(500).json({ error: 'Failed to fetch TSF records' });
  }
});

// GET TSF by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM TSF WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'TSF record not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching TSF record:', error);
    res.status(500).json({ error: 'Failed to fetch TSF record' });
  }
});

// POST create new TSF
router.post('/', async (req, res) => {
  const { id, region, salle, esp_plan, nb_cab, charge_ac, charge_dc, charge_gen, charge_clim, adresse } = req.body;
  
  try {
    const [result] = await db.execute(
      'INSERT INTO TSF (id, region, salle, esp_plan, nb_cab, charge_ac, charge_dc, charge_gen, charge_clim, adresse) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, region, salle, esp_plan, nb_cab, charge_ac, charge_dc, charge_gen, charge_clim, adresse]
    );
    res.status(201).json({ message: 'TSF record created successfully', id: id });
  } catch (error) {
    console.error('Error creating TSF record:', error);
    res.status(500).json({ error: 'Failed to create TSF record' });
  }
});

// PUT update TSF
router.put('/:id', async (req, res) => {
  const { region, salle, esp_plan, nb_cab, charge_ac, charge_dc, charge_gen, charge_clim, adresse } = req.body;
  
  try {
    const [result] = await db.execute(
      'UPDATE TSF SET region = ?, salle = ?, esp_plan = ?, nb_cab = ?, charge_ac = ?, charge_dc = ?, charge_gen = ?, charge_clim = ?, adresse = ? WHERE id = ?',
      [region, salle, esp_plan, nb_cab, charge_ac, charge_dc, charge_gen, charge_clim, adresse, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'TSF record not found' });
    }
    
    res.json({ message: 'TSF record updated successfully' });
  } catch (error) {
    console.error('Error updating TSF record:', error);
    res.status(500).json({ error: 'Failed to update TSF record' });
  }
});

// DELETE TSF
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM TSF WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'TSF record not found' });
    }
    
    res.json({ message: 'TSF record deleted successfully' });
  } catch (error) {
    console.error('Error deleting TSF record:', error);
    res.status(500).json({ error: 'Failed to delete TSF record' });
  }
});

module.exports = router;
