const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all HVAC records
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM HVAC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching HVAC records:', error);
    res.status(500).json({ error: 'Failed to fetch HVAC records' });
  }
});

// GET HVAC by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM HVAC WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'HVAC record not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching HVAC record:', error);
    res.status(500).json({ error: 'Failed to fetch HVAC record' });
  }
});

// POST create new HVAC
router.post('/', async (req, res) => {
  const { type, tonnage, TDL_id, TSF_id } = req.body;
  
  try {
    const [result] = await db.execute(
      'INSERT INTO HVAC (type, tonnage, TDL_id, TSF_id) VALUES (?, ?, ?, ?)',
      [type, tonnage, TDL_id, TSF_id]
    );
    res.status(201).json({ message: 'HVAC record created successfully', id: result.insertId });
  } catch (error) {
    console.error('Error creating HVAC record:', error);
    res.status(500).json({ error: 'Failed to create HVAC record' });
  }
});

// PUT update HVAC
router.put('/:id', async (req, res) => {
  const { type, tonnage, TDL_id, TSF_id } = req.body;
  
  try {
    const [result] = await db.execute(
      'UPDATE HVAC SET type = ?, tonnage = ?, TDL_id = ?, TSF_id = ? WHERE id = ?',
      [type, tonnage, TDL_id, TSF_id, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'HVAC record not found' });
    }
    
    res.json({ message: 'HVAC record updated successfully' });
  } catch (error) {
    console.error('Error updating HVAC record:', error);
    res.status(500).json({ error: 'Failed to update HVAC record' });
  }
});

// DELETE HVAC
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM HVAC WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'HVAC record not found' });
    }
    
    res.json({ message: 'HVAC record deleted successfully' });
  } catch (error) {
    console.error('Error deleting HVAC record:', error);
    res.status(500).json({ error: 'Failed to delete HVAC record' });
  }
});

module.exports = router;
