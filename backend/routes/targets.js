const express = require('express');
const router = express.Router();
const db = require('../database/database');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// GET /api/targets
router.get('/', (req, res) => {
  try {
    const target = db.prepare('SELECT * FROM reduction_targets ORDER BY id DESC LIMIT 1').get();
    
    // Formula: Reduction % = ((Baseline Usage - Current Usage) / Baseline Usage) * 100
    const baseline = target ? target.baseline_usage : 10000;
    const current = target ? target.current_usage : 7500;
    const targetUsage = target ? target.target_usage : 5000;
    const reductionPct = Math.round(((baseline - current) / baseline) * 1000) / 10;
    const targetReductionPct = Math.round(((baseline - targetUsage) / baseline) * 1000) / 10;

    return res.json({
      success: true,
      target: {
        ...target,
        baseline_usage: baseline,
        current_usage: current,
        target_usage: targetUsage,
        reduction_pct: reductionPct,
        target_reduction_pct: targetReductionPct,
        formula_explanation: "Reduction % = ((Baseline Usage - Current Usage) / Baseline Usage) × 100"
      }
    });
  } catch (err) {
    console.error('Fetch targets error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch reduction targets.' });
  }
});

// PUT /api/targets/:id (Admin update target config)
router.put('/:id', verifyToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { title, baseline_usage, target_usage, current_usage, target_date, notes } = req.body;

    db.prepare(`
      UPDATE reduction_targets
      SET title = COALESCE(?, title),
          baseline_usage = COALESCE(?, baseline_usage),
          target_usage = COALESCE(?, target_usage),
          current_usage = COALESCE(?, current_usage),
          target_date = COALESCE(?, target_date),
          notes = COALESCE(?, notes)
      WHERE id = ?
    `).run(title, baseline_usage, target_usage, current_usage, target_date, notes, id);

    return res.json({ success: true, message: 'Reduction target parameters updated.' });
  } catch (err) {
    console.error('Update targets error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update target parameters.' });
  }
});

module.exports = router;
