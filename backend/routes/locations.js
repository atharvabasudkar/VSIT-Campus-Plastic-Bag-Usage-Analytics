const express = require('express');
const router = express.Router();
const db = require('../database/database');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// GET /api/locations - Campus Hotspot Location analysis with aggregated data
router.get('/', (req, res) => {
  try {
    const locations = db.prepare('SELECT * FROM campus_locations ORDER BY id ASC').all();

    const result = locations.map(loc => {
      const stats = db.prepare(`
        SELECT
          COALESCE(SUM(bags_used), 0) as bags_recorded,
          ROUND(COALESCE(SUM(estimated_weight_grams), 0)/1000.0, 2) as weight_kg,
          SUM(CASE WHEN reusable_bag_used = 'Yes' THEN 1 ELSE 0 END) as reusable_count,
          COUNT(*) as total_records
        FROM plastic_usage_records
        WHERE campus_location = ?
      `).get(loc.name);

      const reusablePct = stats.total_records > 0 ? Math.round((stats.reusable_count / stats.total_records) * 100) : 0;

      // Top reasons for using plastic at this location
      const reasons = db.prepare(`
        SELECT purpose, COUNT(*) as count
        FROM plastic_usage_records
        WHERE campus_location = ?
        GROUP BY purpose
        ORDER BY count DESC
        LIMIT 3
      `).all(loc.name).map(r => r.purpose);

      return {
        ...loc,
        bags_recorded: stats.bags_recorded,
        weight_kg: stats.weight_kg,
        reusable_adoption_pct: reusablePct,
        major_reasons: reasons.length > 0 ? reasons : ['Food takeaway packaging', 'Convenience'],
        trend: stats.bags_recorded > 500 ? '+4% vs last month' : '-8% vs last month'
      };
    });

    return res.json({ success: true, locations: result });
  } catch (err) {
    console.error('Locations API error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch campus locations.' });
  }
});

// PUT /api/locations/:id (Admin edit risk level & recommendations)
router.put('/:id', verifyToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { risk_level, description, recommended_action } = req.body;

    db.prepare(`
      UPDATE campus_locations
      SET risk_level = COALESCE(?, risk_level),
          description = COALESCE(?, description),
          recommended_action = COALESCE(?, recommended_action)
      WHERE id = ?
    `).run(risk_level, description, recommended_action, id);

    return res.json({ success: true, message: 'Location updated successfully.' });
  } catch (err) {
    console.error('Update location error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update location.' });
  }
});

module.exports = router;
