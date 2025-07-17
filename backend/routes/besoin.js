const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all Besoin records
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Besoin');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching Besoin records:', error);
    res.status(500).json({ error: 'Failed to fetch Besoin records' });
  }
});

// GET Besoin by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Besoin WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Besoin record not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching Besoin record:', error);
    res.status(500).json({ error: 'Failed to fetch Besoin record' });
  }
});

// POST create new Besoin
router.post('/', async (req, res) => {
  const { 
    type, TDL_id, TSF_id, besoin_ac, besoin_dc, besoin_gen, besoin_clim, 
    année_req, date_demande, commentaire, RU 
  } = req.body;
  
  try {
    const [result] = await db.execute(`
      INSERT INTO Besoin (
        type, TDL_id, TSF_id, besoin_ac, besoin_dc, besoin_gen, besoin_clim, 
        année_req, date_demande, commentaire, RU
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      type, TDL_id, TSF_id, besoin_ac, besoin_dc, besoin_gen, besoin_clim, 
      année_req, date_demande, commentaire, RU
    ]);
    res.status(201).json({ message: 'Besoin record created successfully', id: result.insertId });
  } catch (error) {
    console.error('Error creating Besoin record:', error);
    res.status(500).json({ error: 'Failed to create Besoin record' });
  }
});

// PUT update Besoin
router.put('/:id', async (req, res) => {
  const { 
    type, TDL_id, TSF_id, besoin_ac, besoin_dc, besoin_gen, besoin_clim, 
    année_req, date_demande, commentaire, RU 
  } = req.body;
  
  try {
    const [result] = await db.execute(`
      UPDATE Besoin SET 
        type = ?, TDL_id = ?, TSF_id = ?, besoin_ac = ?, besoin_dc = ?, 
        besoin_gen = ?, besoin_clim = ?, année_req = ?, date_demande = ?, 
        commentaire = ?, RU = ?
      WHERE id = ?
    `, [
      type, TDL_id, TSF_id, besoin_ac, besoin_dc, besoin_gen, besoin_clim, 
      année_req, date_demande, commentaire, RU, req.params.id
    ]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Besoin record not found' });
    }
    
    res.json({ message: 'Besoin record updated successfully' });
  } catch (error) {
    console.error('Error updating Besoin record:', error);
    res.status(500).json({ error: 'Failed to update Besoin record' });
  }
});

// DELETE Besoin
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM Besoin WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Besoin record not found' });
    }
    
    res.json({ message: 'Besoin record deleted successfully' });
  } catch (error) {
    console.error('Error deleting Besoin record:', error);
    res.status(500).json({ error: 'Failed to delete Besoin record' });
  }
});

module.exports = router;
