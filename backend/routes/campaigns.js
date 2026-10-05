const express = require('express');
const router = express.Router();
const db = require('../database/database');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// GET /api/campaigns
router.get('/', (req, res) => {
  try {
    const campaigns = db.prepare('SELECT * FROM campaigns ORDER BY start_date DESC').all();
    return res.json({ success: true, campaigns });
  } catch (err) {
    console.error('Fetch campaigns error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch campaigns.' });
  }
});

// POST /api/campaigns (Admin/Team)
router.post('/', verifyToken, (req, res) => {
  try {
    const { name, start_date, end_date, participants, target_reduction, actual_reduction, status, description } = req.body;
    if (!name || !start_date || !end_date) {
      return res.status(400).json({ success: false, message: 'Name, start date, and end date are required.' });
    }

    const stmt = db.prepare(`
      INSERT INTO campaigns (name, start_date, end_date, participants, target_reduction, actual_reduction, status, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      name,
      start_date,
      end_date,
      parseInt(participants) || 0,
      parseFloat(target_reduction) || 0.0,
      parseFloat(actual_reduction) || 0.0,
      status || 'Active',
      description || ''
    );

    return res.status(201).json({ success: true, message: 'Campaign created successfully.' });
  } catch (err) {
    console.error('Create campaign error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create campaign.' });
  }
});

// PUT /api/campaigns/:id
router.put('/:id', verifyToken, (req, res) => {
  try {
    const { id } = req.params;
    const { name, start_date, end_date, participants, target_reduction, actual_reduction, status, description } = req.body;

    db.prepare(`
      UPDATE campaigns
      SET name = COALESCE(?, name),
          start_date = COALESCE(?, start_date),
          end_date = COALESCE(?, end_date),
          participants = COALESCE(?, participants),
          target_reduction = COALESCE(?, target_reduction),
          actual_reduction = COALESCE(?, actual_reduction),
          status = COALESCE(?, status),
          description = COALESCE(?, description)
      WHERE id = ?
    `).run(name, start_date, end_date, participants, target_reduction, actual_reduction, status, description, id);

    return res.json({ success: true, message: 'Campaign updated successfully.' });
  } catch (err) {
    console.error('Update campaign error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update campaign.' });
  }
});

// DELETE /api/campaigns/:id (Admin only)
router.delete('/:id', verifyToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM campaigns WHERE id = ?').run(id);
    return res.json({ success: true, message: 'Campaign deleted.' });
  } catch (err) {
    console.error('Delete campaign error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete campaign.' });
  }
});

module.exports = router;
