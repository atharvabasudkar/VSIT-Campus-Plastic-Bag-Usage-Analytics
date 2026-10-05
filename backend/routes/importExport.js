const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const csvParser = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const db = require('../database/database');
const { generateRecords, exportCsv } = require('../dataset/generate_dataset');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

const upload = multer({ dest: path.join(__dirname, '..', 'uploads') });

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// GET /api/export/csv - Download dataset CSV
router.get('/csv', (req, res) => {
  try {
    const records = db.prepare('SELECT * FROM plastic_usage_records ORDER BY date ASC').all();
    const exportPath = path.join(uploadsDir, 'exported_vsit_plastic_data.csv');

    const csvWriter = createCsvWriter({
      path: exportPath,
      header: [
        { id: 'record_id', title: 'record_id' },
        { id: 'date', title: 'date' },
        { id: 'month', title: 'month' },
        { id: 'user_category', title: 'user_category' },
        { id: 'department', title: 'department' },
        { id: 'campus_location', title: 'campus_location' },
        { id: 'bag_type', title: 'bag_type' },
        { id: 'bags_used', title: 'bags_used' },
        { id: 'estimated_weight_grams', title: 'estimated_weight_grams' },
        { id: 'purpose', title: 'purpose' },
        { id: 'reusable_bag_used', title: 'reusable_bag_used' },
        { id: 'plastic_avoidable', title: 'plastic_avoidable' },
        { id: 'awareness_level', title: 'awareness_level' },
        { id: 'campaign_exposure', title: 'campaign_exposure' },
        { id: 'reduction_action', title: 'reduction_action' },
        { id: 'disposal_method', title: 'disposal_method' },
        { id: 'survey_rating', title: 'survey_rating' },
        { id: 'notes', title: 'notes' }
      ]
    });

    csvWriter.writeRecords(records).then(() => {
      res.download(exportPath, 'VSIT_Campus_Plastic_Bag_Usage_Dataset.csv', () => {
        if (fs.existsSync(exportPath)) fs.unlinkSync(exportPath);
      });
    });
  } catch (err) {
    console.error('Export CSV error:', err);
    return res.status(500).json({ success: false, message: 'Failed to export dataset CSV.' });
  }
});

// GET /api/export/template - Download fieldwork CSV collection template
router.get('/template', (req, res) => {
  const templatePath = path.join(uploadsDir, 'VSIT_CEP_Fieldwork_Data_Collection_Template.csv');
  const headers = [
    'date',
    'user_category',
    'department',
    'campus_location',
    'bag_type',
    'bags_used',
    'estimated_weight_grams',
    'purpose',
    'reusable_bag_used',
    'plastic_avoidable',
    'awareness_level',
    'campaign_exposure',
    'disposal_method',
    'notes'
  ].join(',') + '\n';

  const sampleRow = '2025-10-05,Students,BSc IT,Canteen,Thin Carry Bag,2,9.0,Snack takeaway,No,Yes,Medium,Yes,Dustbin,Observed during lunch hour\n';

  fs.writeFileSync(templatePath, headers + sampleRow);
  res.download(templatePath, 'VSIT_CEP_Fieldwork_Data_Collection_Template.csv', () => {
    if (fs.existsSync(templatePath)) fs.unlinkSync(templatePath);
  });
});

// POST /api/import/csv - Fieldwork CSV upload with validation
router.post('/csv', verifyToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No CSV file uploaded.' });
  }

  const filePath = req.file.path;
  const records = [];
  const errors = [];
  let rowNum = 1;

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      rowNum++;
      // Validation rules
      if (!row.date || !row.campus_location || !row.bag_type || !row.bags_used) {
        errors.push(`Row ${rowNum}: Missing mandatory fields (date, campus_location, bag_type, bags_used).`);
        return;
      }
      const bagsNum = parseInt(row.bags_used);
      if (isNaN(bagsNum) || bagsNum <= 0) {
        errors.push(`Row ${rowNum}: bags_used must be a positive integer.`);
        return;
      }

      records.push({
        date: row.date.trim(),
        user_category: row.user_category ? row.user_category.trim() : 'Students',
        department: row.department ? row.department.trim() : 'BSc IT',
        campus_location: row.campus_location.trim(),
        bag_type: row.bag_type.trim(),
        bags_used: bagsNum,
        estimated_weight_grams: parseFloat(row.estimated_weight_grams) || (bagsNum * 8.0),
        purpose: row.purpose ? row.purpose.trim() : 'General packaging',
        reusable_bag_used: row.reusable_bag_used ? row.reusable_bag_used.trim() : 'No',
        plastic_avoidable: row.plastic_avoidable ? row.plastic_avoidable.trim() : 'Yes',
        awareness_level: row.awareness_level ? row.awareness_level.trim() : 'Medium',
        campaign_exposure: row.campaign_exposure ? row.campaign_exposure.trim() : 'No',
        disposal_method: row.disposal_method ? row.disposal_method.trim() : 'Dustbin',
        notes: row.notes ? row.notes.trim() : 'Imported fieldwork record'
      });
    })
    .on('end', () => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      if (errors.length > 0 && records.length === 0) {
        return res.status(400).json({ success: false, message: 'CSV validation failed.', errors });
      }

      // Insert validated records
      const insertStmt = db.prepare(`
        INSERT INTO plastic_usage_records (
          record_id, date, month, user_category, department, campus_location,
          bag_type, bags_used, estimated_weight_grams, purpose, reusable_bag_used,
          plastic_avoidable, awareness_level, campaign_exposure, reduction_action,
          disposal_method, notes, submitted_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const nextIdStart = db.prepare('SELECT MAX(id) as maxId FROM plastic_usage_records').get().maxId || 0;
      let counter = 1;

      const insertTransaction = db.transaction((rows) => {
        for (const r of rows) {
          const record_id = `REC-FIELD-${String(nextIdStart + counter).padStart(4, '0')}`;
          counter++;
          const month = r.date.substring(0, 7);
          insertStmt.run(
            record_id, r.date, month, r.user_category, r.department, r.campus_location,
            r.bag_type, r.bags_used, r.estimated_weight_grams, r.purpose, r.reusable_bag_used,
            r.plastic_avoidable, r.awareness_level, r.campaign_exposure, 'Imported fieldwork action',
            r.disposal_method, r.notes, 'CSV Fieldwork Upload'
          );
        }
      });

      insertTransaction(records);

      return res.json({
        success: true,
        message: `Successfully imported ${records.length} fieldwork observation records into campus database!`,
        importedCount: records.length,
        warnings: errors
      });
    });
});

// POST /api/dataset/reset (Admin only - Regenerate synthetic data)
router.post('/reset', verifyToken, requireAdmin, async (req, res) => {
  try {
    db.prepare('DELETE FROM plastic_usage_records').run();
    await exportCsv();
    
    // Reload into database
    const csvPath = path.join(__dirname, '..', 'dataset', 'VSIT_Campus_Plastic_Bag_Usage_Dataset.csv');
    const records = [];
    fs.createReadStream(csvPath)
      .pipe(csvParser())
      .on('data', (data) => records.push(data))
      .on('end', () => {
        const insertStmt = db.prepare(`
          INSERT INTO plastic_usage_records (
            record_id, date, month, user_category, department, campus_location,
            bag_type, bags_used, estimated_weight_grams, purpose, reusable_bag_used,
            plastic_avoidable, awareness_level, campaign_exposure, reduction_action,
            disposal_method, survey_rating, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const insertMany = db.transaction((rows) => {
          for (const r of rows) {
            insertStmt.run(
              r.record_id, r.date, r.month, r.user_category, r.department, r.campus_location,
              r.bag_type, parseInt(r.bags_used) || 1, parseFloat(r.estimated_weight_grams) || 5.0, r.purpose, r.reusable_bag_used,
              r.plastic_avoidable, r.awareness_level, r.campaign_exposure, r.reduction_action,
              r.disposal_method, parseInt(r.survey_rating) || 3, r.notes
            );
          }
        });
        insertMany(records);
        return res.json({ success: true, message: `Regenerated and loaded ${records.length} synthetic records.` });
      });
  } catch (err) {
    console.error('Reset dataset error:', err);
    return res.status(500).json({ success: false, message: 'Failed to reset dataset.' });
  }
});

module.exports = router;
