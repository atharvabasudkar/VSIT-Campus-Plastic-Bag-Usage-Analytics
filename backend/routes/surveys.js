const express = require('express');
const router = express.Router();
const db = require('../database/database');

// GET /api/surveys/stats - Aggregated survey metrics
router.get('/stats', (req, res) => {
  try {
    const totalSurveys = db.prepare('SELECT COUNT(*) as count FROM survey_responses').get().count;

    const awareCount = db.prepare("SELECT COUNT(*) as count FROM survey_responses WHERE aware_impact = 'Yes'").get().count;
    const supportRestrictionsCount = db.prepare("SELECT COUNT(*) as count FROM survey_responses WHERE support_restrictions = 'Yes'").get().count;
    const carryReusableCount = db.prepare("SELECT COUNT(*) as count FROM survey_responses WHERE carry_reusable_bag IN ('Always', 'Often', 'Yes')").get().count;
    const switchAlternativesCount = db.prepare("SELECT COUNT(*) as count FROM survey_responses WHERE switch_alternatives = 'Yes'").get().count;

    const awarePct = totalSurveys > 0 ? Math.round((awareCount / totalSurveys) * 100) : 0;
    const supportPct = totalSurveys > 0 ? Math.round((supportRestrictionsCount / totalSurveys) * 100) : 0;
    const reusablePct = totalSurveys > 0 ? Math.round((carryReusableCount / totalSurveys) * 100) : 0;
    const switchPct = totalSurveys > 0 ? Math.round((switchAlternativesCount / totalSurveys) * 100) : 0;

    // Effective measures breakdown
    const measures = db.prepare(`
      SELECT effective_measure as measure, COUNT(*) as count
      FROM survey_responses
      GROUP BY effective_measure
      ORDER BY count DESC
    `).all();

    // Primary locations breakdown
    const primaryLocations = db.prepare(`
      SELECT primary_location as location, COUNT(*) as count
      FROM survey_responses
      GROUP BY primary_location
      ORDER BY count DESC
    `).all();

    return res.json({
      success: true,
      stats: {
        totalSurveys,
        awarePct,
        supportPct,
        reusablePct,
        switchPct,
        measures,
        primaryLocations
      }
    });
  } catch (err) {
    console.error('Fetch survey stats error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch survey statistics.' });
  }
});

// GET /api/surveys/responses - Raw survey responses list (Admin/Team)
router.get('/responses', (req, res) => {
  try {
    const responses = db.prepare('SELECT * FROM survey_responses ORDER BY id DESC LIMIT 100').all();
    return res.json({ success: true, responses });
  } catch (err) {
    console.error('Fetch survey responses error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch responses.' });
  }
});

// POST /api/surveys/submit - Submit survey
router.post('/submit', (req, res) => {
  try {
    const {
      user_category,
      department,
      frequency_use,
      bags_per_week,
      primary_location,
      common_bag_type,
      primary_reason,
      carry_reusable_bag,
      reuse_frequency,
      aware_impact,
      support_restrictions,
      switch_alternatives,
      incentives_help,
      noticed_campaigns,
      effective_measure
    } = req.body;

    if (!user_category || !department || !primary_location) {
      return res.status(400).json({ success: false, message: 'Please complete all mandatory survey questions.' });
    }

    const stmt = db.prepare(`
      INSERT INTO survey_responses (
        user_category, department, frequency_use, bags_per_week, primary_location,
        common_bag_type, primary_reason, carry_reusable_bag, reuse_frequency,
        aware_impact, support_restrictions, switch_alternatives, incentives_help,
        noticed_campaigns, effective_measure
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      user_category,
      department,
      frequency_use || 'Occasionally',
      parseInt(bags_per_week) || 3,
      primary_location,
      common_bag_type || 'Thin Carry Bag',
      primary_reason || 'Food packaging',
      carry_reusable_bag || 'Sometimes',
      reuse_frequency || 'Often',
      aware_impact || 'Yes',
      support_restrictions || 'Yes',
      switch_alternatives || 'Yes',
      incentives_help || 'Yes',
      noticed_campaigns || 'Yes',
      effective_measure || 'Incentives & Reusable Cloth Bags'
    );

    return res.status(201).json({
      success: true,
      message: 'Thank you for helping VSIT build a more sustainable campus.'
    });
  } catch (err) {
    console.error('Survey submit error:', err);
    return res.status(500).json({ success: false, message: 'Failed to submit survey.' });
  }
});

module.exports = router;
