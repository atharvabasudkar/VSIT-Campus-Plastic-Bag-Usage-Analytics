const express = require('express');
const router = express.Router();
const db = require('../database/database');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// GET /api/observations - Filtered list of plastic usage records
router.get('/', (req, res) => {
  try {
    const { page = 1, limit = 50, location, department, userCategory, bagType, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const clauses = [];
    const params = [];

    if (location && location !== 'All') {
      clauses.push('campus_location = ?');
      params.push(location);
    }
    if (department && department !== 'All') {
      clauses.push('department = ?');
      params.push(department);
    }
    if (userCategory && userCategory !== 'All') {
      clauses.push('user_category = ?');
      params.push(userCategory);
    }
    if (bagType && bagType !== 'All') {
      clauses.push('bag_type = ?');
      params.push(bagType);
    }
    if (search) {
      clauses.push('(record_id LIKE ? OR notes LIKE ? OR purpose LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereStr = clauses.length > 0 ? 'WHERE ' + clauses.join(' AND ') : '';

    const totalCount = db.prepare(`SELECT COUNT(*) as count FROM plastic_usage_records ${whereStr}`).get(...params).count;

    const sql = `
      SELECT * FROM plastic_usage_records
      ${whereStr}
      ORDER BY date DESC, id DESC
      LIMIT ? OFFSET ?
    `;

    const records = db.prepare(sql).all(...params, parseInt(limit), offset);

    return res.json({
      success: true,
      records,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('Fetch observations error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch usage records.' });
  }
});

// POST /api/observations - Add a new fieldwork plastic usage observation record
router.post('/', (req, res) => {
  try {
    const {
      date,
      campus_location,
      user_category,
      department,
      bag_type,
      bags_used,
      estimated_weight_grams,
      purpose,
      reusable_bag_used,
      plastic_avoidable,
      awareness_level,
      campaign_exposure,
      reduction_action,
      disposal_method,
      notes,
      submitted_by
    } = req.body;

    if (!date || !campus_location || !user_category || !bag_type || !bags_used) {
      return res.status(400).json({ success: false, message: 'Missing required observation fields.' });
    }

    const nextId = db.prepare('SELECT MAX(id) as maxId FROM plastic_usage_records').get().maxId + 1;
    const record_id = `REC-VSIT-${String(nextId).padStart(4, '0')}`;
    const month = date.substring(0, 7);

    const weightPerBag = {
      'Thin Carry Bag': 4.5,
      'Medium Carry Bag': 8.0,
      'Large Carry Bag': 14.5,
      'Food Packaging Bag': 5.5,
      'Shopping Bag': 12.0,
      'Other': 7.0
    };

    const weight = estimated_weight_grams ? parseFloat(estimated_weight_grams) : Math.round((parseInt(bags_used) * (weightPerBag[bag_type] || 7.0)) * 10) / 10;

    const stmt = db.prepare(`
      INSERT INTO plastic_usage_records (
        record_id, date, month, user_category, department, campus_location,
        bag_type, bags_used, estimated_weight_grams, purpose, reusable_bag_used,
        plastic_avoidable, awareness_level, campaign_exposure, reduction_action,
        disposal_method, notes, submitted_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      record_id,
      date,
      month,
      user_category,
      department || 'Other',
      campus_location,
      bag_type,
      parseInt(bags_used),
      weight,
      purpose || 'General usage',
      reusable_bag_used || 'No',
      plastic_avoidable || 'Yes',
      awareness_level || 'Medium',
      campaign_exposure || 'No',
      reduction_action || 'None',
      disposal_method || 'Dustbin',
      notes || 'Field observation recorded',
      submitted_by || 'VSIT Student/Observer'
    );

    return res.status(201).json({
      success: true,
      message: 'Plastic usage observation successfully recorded!',
      record_id
    });
  } catch (err) {
    console.error('Create observation error:', err);
    return res.status(500).json({ success: false, message: 'Failed to record usage observation.' });
  }
});

// DELETE /api/observations/:id (Admin only)
router.delete('/:id', verifyToken, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM plastic_usage_records WHERE id = ?').run(id);
    return res.json({ success: true, message: 'Observation record deleted.' });
  } catch (err) {
    console.error('Delete observation error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete record.' });
  }
});

module.exports = router;
