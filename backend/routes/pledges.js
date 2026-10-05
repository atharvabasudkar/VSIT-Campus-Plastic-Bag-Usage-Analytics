const express = require('express');
const router = express.Router();
const db = require('../database/database');

// GET /api/pledges/stats
router.get('/stats', (req, res) => {
  try {
    const totalPledges = db.prepare('SELECT COUNT(*) as count FROM pledges').get().count;
    const recentPledges = db.prepare('SELECT * FROM pledges ORDER BY id DESC LIMIT 10').all();

    return res.json({
      success: true,
      totalPledges: totalPledges + 120, // Add initial base pledge count for vibrant display
      recentPledges
    });
  } catch (err) {
    console.error('Fetch pledges error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch pledges.' });
  }
});

// POST /api/pledges
router.post('/', (req, res) => {
  try {
    const { name, email, user_category, department, pledge_type } = req.body;
    if (!name || !user_category) {
      return res.status(400).json({ success: false, message: 'Name and user category are required.' });
    }

    const stmt = db.prepare(`
      INSERT INTO pledges (name, email, user_category, department, pledge_type)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(
      name,
      email || 'anonymous@vsit.edu.in',
      user_category,
      department || 'Other',
      pledge_type || 'I pledge to carry a reusable bag every day on VSIT campus and refuse single-use polythene bags.'
    );

    return res.status(201).json({
      success: true,
      message: 'Thank you for making the VSIT Eco-Pledge! You are now part of our campus sustainability movement.'
    });
  } catch (err) {
    console.error('Create pledge error:', err);
    return res.status(500).json({ success: false, message: 'Failed to record pledge.' });
  }
});

module.exports = router;
