const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all Fabricant records
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Fabricant');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching Fabricant records:', error);
    res.status(500).json({ error: 'Failed to fetch Fabricant records' });
  }
});

// GET Fabricant by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Fabricant WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Fabricant record not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching Fabricant record:', error);
    res.status(500).json({ error: 'Failed to fetch Fabricant record' });
  }
});

// POST create new Fabricant
router.post('/', async (req, res) => {
  const { num, nom, Contact, courriel } = req.body;
  
  try {
    const [result] = await db.execute(
      'INSERT INTO Fabricant (num, nom, Contact, courriel) VALUES (?, ?, ?, ?)',
      [num, nom, Contact, courriel]
    );
    res.status(201).json({ message: 'Fabricant record created successfully', id: result.insertId });
  } catch (error) {
    console.error('Error creating Fabricant record:', error);
    res.status(500).json({ error: 'Failed to create Fabricant record' });
  }
});

// PUT update Fabricant
router.put('/:id', async (req, res) => {
  const { num, nom, Contact, courriel } = req.body;
  
  try {
    const [result] = await db.execute(
      'UPDATE Fabricant SET num = ?, nom = ?, Contact = ?, courriel = ? WHERE id = ?',
      [num, nom, Contact, courriel, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Fabricant record not found' });
    }
    
    res.json({ message: 'Fabricant record updated successfully' });
  } catch (error) {
    console.error('Error updating Fabricant record:', error);
    res.status(500).json({ error: 'Failed to update Fabricant record' });
  }
});

// DELETE Fabricant
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM Fabricant WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Fabricant record not found' });
    }
    
    res.json({ message: 'Fabricant record deleted successfully' });
  } catch (error) {
    console.error('Error deleting Fabricant record:', error);
    res.status(500).json({ error: 'Failed to delete Fabricant record' });
  }
});

module.exports = router;
