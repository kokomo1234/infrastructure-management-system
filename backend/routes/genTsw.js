const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all GEN_TSW records
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM GEN_TSW');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching GEN_TSW records:', error);
    res.status(500).json({ error: 'Failed to fetch GEN_TSW records' });
  }
});

// GET GEN_TSW by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM GEN_TSW WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'GEN_TSW record not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching GEN_TSW record:', error);
    res.status(500).json({ error: 'Failed to fetch GEN_TSW record' });
  }
});

// POST create new GEN_TSW
router.post('/', async (req, res) => {
  const { type, output, TDL_id, TSF_id } = req.body;
  
  try {
    const [result] = await db.execute(
      'INSERT INTO GEN_TSW (type, output, TDL_id, TSF_id) VALUES (?, ?, ?, ?)',
      [type, output, TDL_id, TSF_id]
    );
    res.status(201).json({ message: 'GEN_TSW record created successfully', id: result.insertId });
  } catch (error) {
    console.error('Error creating GEN_TSW record:', error);
    res.status(500).json({ error: 'Failed to create GEN_TSW record' });
  }
});

// PUT update GEN_TSW
router.put('/:id', async (req, res) => {
  const { type, output, TDL_id, TSF_id } = req.body;
  
  try {
    const [result] = await db.execute(
      'UPDATE GEN_TSW SET type = ?, output = ?, TDL_id = ?, TSF_id = ? WHERE id = ?',
      [type, output, TDL_id, TSF_id, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'GEN_TSW record not found' });
    }
    
    res.json({ message: 'GEN_TSW record updated successfully' });
  } catch (error) {
    console.error('Error updating GEN_TSW record:', error);
    res.status(500).json({ error: 'Failed to update GEN_TSW record' });
  }
});

// DELETE GEN_TSW
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM GEN_TSW WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'GEN_TSW record not found' });
    }
    
    res.json({ message: 'GEN_TSW record deleted successfully' });
  } catch (error) {
    console.error('Error deleting GEN_TSW record:', error);
    res.status(500).json({ error: 'Failed to delete GEN_TSW record' });
  }
});

module.exports = router;
