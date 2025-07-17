const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all DC records
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM DC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching DC records:', error);
    res.status(500).json({ error: 'Failed to fetch DC records' });
  }
});

// GET DC by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM DC WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'DC record not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching DC record:', error);
    res.status(500).json({ error: 'Failed to fetch DC record' });
  }
});

// POST create new DC
router.post('/', async (req, res) => {
  const { type, output_dc, TDL_id, TSF_id } = req.body;
  
  try {
    const [result] = await db.execute(
      'INSERT INTO DC (type, output_dc, TDL_id, TSF_id) VALUES (?, ?, ?, ?)',
      [type, output_dc, TDL_id, TSF_id]
    );
    res.status(201).json({ message: 'DC record created successfully', id: result.insertId });
  } catch (error) {
    console.error('Error creating DC record:', error);
    res.status(500).json({ error: 'Failed to create DC record' });
  }
});

// PUT update DC
router.put('/:id', async (req, res) => {
  const { type, output_dc, TDL_id, TSF_id } = req.body;
  
  try {
    const [result] = await db.execute(
      'UPDATE DC SET type = ?, output_dc = ?, TDL_id = ?, TSF_id = ? WHERE id = ?',
      [type, output_dc, TDL_id, TSF_id, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'DC record not found' });
    }
    
    res.json({ message: 'DC record updated successfully' });
  } catch (error) {
    console.error('Error updating DC record:', error);
    res.status(500).json({ error: 'Failed to update DC record' });
  }
});

// DELETE DC
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM DC WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'DC record not found' });
    }
    
    res.json({ message: 'DC record deleted successfully' });
  } catch (error) {
    console.error('Error deleting DC record:', error);
    res.status(500).json({ error: 'Failed to delete DC record' });
  }
});

module.exports = router;
