const express = require('express');
const router = express.Router();
const db = require('../database/database');

// GET /api/reports/generate - Filtered CEP Project Report Generator Data
router.get('/generate', (req, res) => {
  try {
    const { startDate, endDate, department, location, userCategory, bagType } = req.query;

    const clauses = [];
    const params = [];

    if (startDate) { clauses.push('date >= ?'); params.push(startDate); }
    if (endDate) { clauses.push('date <= ?'); params.push(endDate); }
    if (department && department !== 'All') { clauses.push('department = ?'); params.push(department); }
    if (location && location !== 'All') { clauses.push('campus_location = ?'); params.push(location); }
    if (userCategory && userCategory !== 'All') { clauses.push('user_category = ?'); params.push(userCategory); }
    if (bagType && bagType !== 'All') { clauses.push('bag_type = ?'); params.push(bagType); }

    const whereStr = clauses.length > 0 ? 'WHERE ' + clauses.join(' AND ') : '';

    // Aggregates
    const stats = db.prepare(`
      SELECT
        COUNT(*) as total_records,
        COALESCE(SUM(bags_used), 0) as total_bags,
        COALESCE(SUM(estimated_weight_grams), 0) as total_weight_grams,
        COUNT(DISTINCT date) as active_days,
        SUM(CASE WHEN reusable_bag_used = 'Yes' THEN 1 ELSE 0 END) as reusable_count,
        SUM(CASE WHEN plastic_avoidable = 'Yes' THEN 1 ELSE 0 END) as avoidable_count,
        SUM(CASE WHEN campaign_exposure = 'Yes' THEN 1 ELSE 0 END) as campaign_aware_count
      FROM plastic_usage_records
      ${whereStr}
    `).get(...params);

    const totalRecords = stats.total_records || 1;
    const totalBags = stats.total_bags || 0;
    const totalWeightKg = Math.round((stats.total_weight_grams / 1000) * 10) / 10;
    const reusableAdoptionPct = Math.round((stats.reusable_count / totalRecords) * 100);
    const avoidablePct = Math.round((stats.avoidable_count / totalRecords) * 100);
    const campaignAwarePct = Math.round((stats.campaign_aware_count / totalRecords) * 100);

    // High risk locations summary
    const topLocations = db.prepare(`
      SELECT campus_location, SUM(bags_used) as bags, ROUND(SUM(estimated_weight_grams)/1000.0, 2) as weight_kg
      FROM plastic_usage_records
      ${whereStr}
      GROUP BY campus_location
      ORDER BY bags DESC
      LIMIT 5
    `).all(...params);

    // Survey findings summary
    const surveyStats = db.prepare('SELECT COUNT(*) as total FROM survey_responses').get();
    const awareSurveyPct = Math.round((db.prepare("SELECT COUNT(*) as c FROM survey_responses WHERE aware_impact = 'Yes'").get().c / (surveyStats.total || 1)) * 100);

    // Active Campaigns
    const activeCampaigns = db.prepare("SELECT * FROM campaigns WHERE status = 'Active'").all();

    // Baseline & Target
    const target = db.prepare("SELECT * FROM reduction_targets ORDER BY id DESC LIMIT 1").get();
    const baseline = target ? target.baseline_usage : 10000;
    const current = totalBags > 0 ? Math.round(totalBags) : (target ? target.current_usage : 7500);
    const targetVal = target ? target.target_usage : 5000;
    const reductionPct = Math.round(((baseline - current) / baseline) * 100);

    // Executive summary text
    const execSummary = `This CEP Sustainability Report presents a detailed analysis of plastic bag usage within the Vidyalankar School of Information Technology (VSIT) campus. Based on ${totalRecords.toLocaleString()} observation records, a total of ${totalBags.toLocaleString()} plastic carry bags (weighing approximately ${totalWeightKg} kg) were documented. Canteen and vendor takeaway areas represent the primary hotspots. Current reusable bag adoption stands at ${reusableAdoptionPct}%, with an estimated ${reductionPct}% reduction achieved against baseline metrics. Multi-faceted campus awareness campaigns and vendor eco-friendly container incentives are recommended to achieve VSIT's 50% single-use plastic reduction target.`;

    return res.json({
      success: true,
      report: {
        generatedAt: new Date().toISOString(),
        institution: 'Vidyalankar School of Information Technology (VSIT)',
        projectTitle: 'Campus Plastic Bag Usage and Reduction Analysis',
        filtersApplied: { startDate, endDate, department, location, userCategory, bagType },
        executiveSummary: execSummary,
        totalBags,
        totalWeightKg,
        reusableAdoptionPct,
        avoidablePct,
        campaignAwarePct,
        topLocations,
        surveyFindings: {
          totalSurveys: surveyStats.total,
          awarePercentage: awareSurveyPct
        },
        activeCampaigns,
        reductionProgress: {
          baseline,
          current,
          target: targetVal,
          reductionPct
        },
        environmentalImpact: {
          co2SavedKg: Math.round(totalWeightKg * 3.5),
          yearlyAvoidableBags: Math.round(totalBags * 0.45 * 12)
        },
        recommendations: [
          "Establish mandatory green packaging policies at VSIT Canteen and Cafeteria counters.",
          "Expand the 'Bring Your Own Bag' (BYOB) rewards system for students and staff.",
          "Distribute reusable cloth bags during fresher orientation and campus fest inaugurations.",
          "Implement monthly campus plastic audits and department sustainability leaderboards."
        ]
      }
    });
  } catch (err) {
    console.error('Report generation error:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate report.' });
  }
});

module.exports = router;
