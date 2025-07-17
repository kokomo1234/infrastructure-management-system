const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all AUTRE records
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM AUTRE');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching AUTRE records:', error);
    res.status(500).json({ error: 'Failed to fetch AUTRE records' });
  }
});

// GET AUTRE by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM AUTRE WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'AUTRE record not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching AUTRE record:', error);
    res.status(500).json({ error: 'Failed to fetch AUTRE record' });
  }
});

// POST create new AUTRE
router.post('/', async (req, res) => {
  const { type, output, TDL_id, TSF_id } = req.body;
  
  try {
    const [result] = await db.execute(
      'INSERT INTO AUTRE (type, output, TDL_id, TSF_id) VALUES (?, ?, ?, ?)',
      [type, output, TDL_id, TSF_id]
    );
    res.status(201).json({ message: 'AUTRE record created successfully', id: result.insertId });
  } catch (error) {
    console.error('Error creating AUTRE record:', error);
    res.status(500).json({ error: 'Failed to create AUTRE record' });
  }
});

// PUT update AUTRE
router.put('/:id', async (req, res) => {
  const { type, output, TDL_id, TSF_id } = req.body;
  
  try {
    const [result] = await db.execute(
      'UPDATE AUTRE SET type = ?, output = ?, TDL_id = ?, TSF_id = ? WHERE id = ?',
      [type, output, TDL_id, TSF_id, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'AUTRE record not found' });
    }
    
    res.json({ message: 'AUTRE record updated successfully' });
  } catch (error) {
    console.error('Error updating AUTRE record:', error);
    res.status(500).json({ error: 'Failed to update AUTRE record' });
  }
});

// DELETE AUTRE
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM AUTRE WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'AUTRE record not found' });
    }
    
    res.json({ message: 'AUTRE record deleted successfully' });
  } catch (error) {
    console.error('Error deleting AUTRE record:', error);
    res.status(500).json({ error: 'Failed to delete AUTRE record' });
  }
});

module.exports = router;
