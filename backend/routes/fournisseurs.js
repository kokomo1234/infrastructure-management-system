const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all Fournisseurs records
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Fournisseurs');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching Fournisseurs records:', error);
    res.status(500).json({ error: 'Failed to fetch Fournisseurs records' });
  }
});

// GET Fournisseurs by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Fournisseurs WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Fournisseurs record not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching Fournisseurs record:', error);
    res.status(500).json({ error: 'Failed to fetch Fournisseurs record' });
  }
});

// POST create new Fournisseurs
router.post('/', async (req, res) => {
  const { num, nom, Contact, courriel } = req.body;
  
  try {
    const [result] = await db.execute(
      'INSERT INTO Fournisseurs (num, nom, Contact, courriel) VALUES (?, ?, ?, ?)',
      [num, nom, Contact, courriel]
    );
    res.status(201).json({ message: 'Fournisseurs record created successfully', id: result.insertId });
  } catch (error) {
    console.error('Error creating Fournisseurs record:', error);
    res.status(500).json({ error: 'Failed to create Fournisseurs record' });
  }
});

// PUT update Fournisseurs
router.put('/:id', async (req, res) => {
  const { num, nom, Contact, courriel } = req.body;
  
  try {
    const [result] = await db.execute(
      'UPDATE Fournisseurs SET num = ?, nom = ?, Contact = ?, courriel = ? WHERE id = ?',
      [num, nom, Contact, courriel, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Fournisseurs record not found' });
    }
    
    res.json({ message: 'Fournisseurs record updated successfully' });
  } catch (error) {
    console.error('Error updating Fournisseurs record:', error);
    res.status(500).json({ error: 'Failed to update Fournisseurs record' });
  }
});

// DELETE Fournisseurs
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM Fournisseurs WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Fournisseurs record not found' });
    }
    
    res.json({ message: 'Fournisseurs record deleted successfully' });
  } catch (error) {
    console.error('Error deleting Fournisseurs record:', error);
    res.status(500).json({ error: 'Failed to delete Fournisseurs record' });
  }
});

module.exports = router;
