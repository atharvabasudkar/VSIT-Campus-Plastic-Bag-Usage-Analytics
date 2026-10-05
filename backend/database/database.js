const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const csvParser = require('csv-parser');

const isVercel = process.env.VERCEL || process.env.NOW_BUILDER;
let dbPath;

if (isVercel) {
  dbPath = path.join('/tmp', 'cep_database.sqlite');
  const sourceDb = path.join(__dirname, 'cep_database.sqlite');
  if (!fs.existsSync(dbPath) && fs.existsSync(sourceDb)) {
    try {
      fs.copyFileSync(sourceDb, dbPath);
      console.log('Copied database to /tmp for Vercel Serverless environment.');
    } catch (e) {
      console.error('Failed copying db to /tmp:', e);
    }
  }
} else {
  dbPath = path.join(__dirname, 'cep_database.sqlite');
}

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

function initDb() {
  console.log('Initializing SQLite database at:', dbPath);

  // Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin', 'team', 'student_staff')) DEFAULT 'student_staff',
      department TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Campus Locations Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS campus_locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      code TEXT,
      risk_level TEXT CHECK(risk_level IN ('LOW', 'MODERATE', 'HIGH', 'CRITICAL')) DEFAULT 'MODERATE',
      description TEXT,
      recommended_action TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Departments Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      code TEXT
    );
  `);

  // Plastic Usage Records Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS plastic_usage_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      record_id TEXT UNIQUE NOT NULL,
      date TEXT NOT NULL,
      month TEXT NOT NULL,
      user_category TEXT NOT NULL,
      department TEXT NOT NULL,
      campus_location TEXT NOT NULL,
      bag_type TEXT NOT NULL,
      bags_used INTEGER NOT NULL,
      estimated_weight_grams REAL NOT NULL,
      purpose TEXT,
      reusable_bag_used TEXT DEFAULT 'No',
      plastic_avoidable TEXT DEFAULT 'Yes',
      awareness_level TEXT DEFAULT 'Medium',
      campaign_exposure TEXT DEFAULT 'No',
      reduction_action TEXT DEFAULT 'None',
      disposal_method TEXT DEFAULT 'Dustbin',
      survey_rating INTEGER DEFAULT 3,
      notes TEXT,
      submitted_by TEXT DEFAULT 'CEP Fieldwork Observer',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Survey Responses Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS survey_responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_category TEXT NOT NULL,
      department TEXT NOT NULL,
      frequency_use TEXT NOT NULL,
      bags_per_week INTEGER NOT NULL,
      primary_location TEXT NOT NULL,
      common_bag_type TEXT NOT NULL,
      primary_reason TEXT NOT NULL,
      carry_reusable_bag TEXT NOT NULL,
      reuse_frequency TEXT NOT NULL,
      aware_impact TEXT NOT NULL,
      support_restrictions TEXT NOT NULL,
      switch_alternatives TEXT NOT NULL,
      incentives_help TEXT NOT NULL,
      noticed_campaigns TEXT NOT NULL,
      effective_measure TEXT NOT NULL,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Campaigns Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      participants INTEGER DEFAULT 0,
      target_reduction REAL DEFAULT 0,
      actual_reduction REAL DEFAULT 0,
      status TEXT CHECK(status IN ('Active', 'Completed', 'Upcoming')) DEFAULT 'Active',
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Reduction Targets Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS reduction_targets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      baseline_usage INTEGER NOT NULL,
      target_usage INTEGER NOT NULL,
      current_usage INTEGER NOT NULL,
      target_date TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Pledges Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS pledges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      user_category TEXT NOT NULL,
      department TEXT NOT NULL,
      pledge_type TEXT NOT NULL,
      pledged_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedDefaultData();
}

function seedDefaultData() {
  // Seed Admin user
  const adminCheck = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('admin');
  if (adminCheck.count === 0) {
    const passHash = bcrypt.hashSync('admin123', 10);
    db.prepare(`
      INSERT INTO users (name, email, password_hash, role, department)
      VALUES (?, ?, ?, ?, ?)
    `).run('VSIT CEP Admin', 'admin@vsit.edu.in', passHash, 'admin', 'Administrative Staff');
    
    const teamHash = bcrypt.hashSync('team123', 10);
    db.prepare(`
      INSERT INTO users (name, email, password_hash, role, department)
      VALUES (?, ?, ?, ?, ?)
    `).run('CEP Field Researcher', 'cep_team@vsit.edu.in', teamHash, 'team', 'BSc IT');

    console.log('Seeded default Admin (admin@vsit.edu.in / admin123) and CEP Team user.');
  }

  // Seed Locations
  const locationCheck = db.prepare('SELECT COUNT(*) as count FROM campus_locations').get();
  if (locationCheck.count === 0) {
    const defaultLocations = [
      { name: 'Canteen', code: 'CAN', risk: 'HIGH', desc: 'Primary student lunch and fast-food takeaway hub', action: 'Implement reusable meal containers and charge eco-fee for carry bags.' },
      { name: 'Cafeteria', code: 'CAF', risk: 'HIGH', desc: 'Beverage and snack counter', action: 'Provide discounts for BYO reusable cups and cloth tote bags.' },
      { name: 'Stationery Area', code: 'STN', risk: 'MODERATE', desc: 'Printouts, xerox, and stationery supplies', action: 'Transition to recycled paper packaging and cloth bags.' },
      { name: 'Library Area', code: 'LIB', risk: 'LOW', desc: 'Academic study and book lending center', action: 'Enforce strict plastic bag ban inside study zones.' },
      { name: 'Administrative Area', code: 'ADM', risk: 'LOW', desc: 'Faculty offices and administrative departments', action: 'Paper file folders only; ban polythene covers.' },
      { name: 'Campus Events', code: 'EVT', risk: 'CRITICAL', desc: 'Festivals, seminars, workshops, and sports days', action: 'Mandate zero-plastic vendor policies for all campus fests.' },
      { name: 'Student Activity Area', code: 'ACT', risk: 'MODERATE', desc: 'Clubs, common room, and outdoor courtyard', action: 'Set up reusable bag donation bank & awareness kiosks.' },
      { name: 'Entrance / Exit', code: 'ENT', risk: 'LOW', desc: 'Main campus security gates and walkways', action: 'Install prominent plastic reduction signage & pledge board.' },
      { name: 'Nearby Vendor Interaction', code: 'VND', risk: 'HIGH', desc: 'Perimeter tea stalls, snacks, and street food', action: 'Conduct community outreach with surrounding local vendors.' },
      { name: 'Other', code: 'OTH', risk: 'LOW', desc: 'Miscellaneous campus areas', action: 'Periodic audits and general awareness posters.' }
    ];

    const insertLoc = db.prepare(`
      INSERT INTO campus_locations (name, code, risk_level, description, recommended_action)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const loc of defaultLocations) {
      insertLoc.run(loc.name, loc.code, loc.risk, loc.desc, loc.action);
    }
  }

  // Seed Departments
  const deptCheck = db.prepare('SELECT COUNT(*) as count FROM departments').get();
  if (deptCheck.count === 0) {
    const depts = [
      { name: 'BSc IT', code: 'BSCIT' },
      { name: 'BSc CS', code: 'BSCCS' },
      { name: 'BCA', code: 'BCA' },
      { name: 'MSc IT', code: 'MSCIT' },
      { name: 'Teaching Staff', code: 'FAC' },
      { name: 'Administrative Staff', code: 'ADM' },
      { name: 'Other', code: 'OTH' }
    ];
    const insertDept = db.prepare('INSERT INTO departments (name, code) VALUES (?, ?)');
    for (const d of depts) insertDept.run(d.name, d.code);
  }

  // Seed Campaigns
  const campaignCheck = db.prepare('SELECT COUNT(*) as count FROM campaigns').get();
  if (campaignCheck.count === 0) {
    const campaigns = [
      { name: 'Bring Your Own Bag (BYOB)', start: '2025-01-10', end: '2025-04-10', participants: 420, target: 35.0, actual: 31.5, status: 'Active', desc: 'Encouraging all VSIT students and faculty to carry custom cloth bags.' },
      { name: 'Plastic-Free Friday', start: '2025-02-01', end: '2025-05-30', participants: 650, target: 50.0, actual: 44.2, status: 'Active', desc: 'Single-use plastic restriction on all Fridays across canteen and campus vendors.' },
      { name: 'Green Campus Week', start: '2024-11-15', end: '2024-11-22', participants: 880, target: 40.0, actual: 42.0, status: 'Completed', desc: 'Awareness workshops, pledge collection, and eco-friendly tote bag distribution.' },
      { name: 'Reusable Bag Challenge', start: '2025-06-01', end: '2025-08-31', participants: 0, target: 45.0, actual: 0.0, status: 'Upcoming', desc: 'Inter-departmental competition for highest percentage of reusable bag adoption.' },
      { name: 'Say No to Single-Use Plastic', start: '2024-12-01', end: '2024-12-31', participants: 510, target: 25.0, actual: 28.4, status: 'Completed', desc: 'Vendor audit and enforcement campaign at campus takeaway points.' }
    ];
    const insertCamp = db.prepare(`
      INSERT INTO campaigns (name, start_date, end_date, participants, target_reduction, actual_reduction, status, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const c of campaigns) {
      insertCamp.run(c.name, c.start, c.end, c.participants, c.target, c.actual, c.status, c.desc);
    }
  }

  // Seed Reduction Target
  const targetCheck = db.prepare('SELECT COUNT(*) as count FROM reduction_targets').get();
  if (targetCheck.count === 0) {
    db.prepare(`
      INSERT INTO reduction_targets (title, baseline_usage, target_usage, current_usage, target_date, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'VSIT Annual Campus Plastic Bag Reduction Target 2024-2025',
      12500,
      6250,
      8120,
      '2025-12-31',
      'Targeting a 50% reduction in single-use plastic bags across all VSIT campus locations.'
    );
  }

  // Seed Plastic Usage Records from Dataset CSV if records count is 0
  const recordsCheck = db.prepare('SELECT COUNT(*) as count FROM plastic_usage_records').get();
  if (recordsCheck.count === 0) {
    const csvPath = path.join(__dirname, '..', 'dataset', 'VSIT_Campus_Plastic_Bag_Usage_Dataset.csv');
    if (fs.existsSync(csvPath)) {
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
            ) VALUES (
              ?, ?, ?, ?, ?, ?,
              ?, ?, ?, ?, ?,
              ?, ?, ?, ?,
              ?, ?, ?
            )
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
          console.log(`Loaded ${records.length} dataset records into SQLite plastic_usage_records table.`);
        });
    }
  }

  // Seed Initial Survey Responses
  const surveyCheck = db.prepare('SELECT COUNT(*) as count FROM survey_responses').get();
  if (surveyCheck.count === 0) {
    const sampleSurveys = [
      { user_category: 'Students', department: 'BSc IT', frequency_use: 'Daily', bags_per_week: 5, primary_location: 'Canteen', common_bag_type: 'Thin Carry Bag', primary_reason: 'Food takeaway convenience', carry_reusable_bag: 'Sometimes', reuse_frequency: 'Often', aware_impact: 'Yes', support_restrictions: 'Yes', switch_alternatives: 'Yes', incentives_help: 'Yes', noticed_campaigns: 'Yes', effective_measure: 'Canteen bag surcharge & BYOB rewards' },
      { user_category: 'Students', department: 'BSc CS', frequency_use: 'Occasionally', bags_per_week: 2, primary_location: 'Stationery Area', common_bag_type: 'Medium Carry Bag', primary_reason: 'Unplanned stationery purchase', carry_reusable_bag: 'Always', reuse_frequency: 'Always', aware_impact: 'Yes', support_restrictions: 'Yes', switch_alternatives: 'Yes', incentives_help: 'Yes', noticed_campaigns: 'Yes', effective_measure: 'Free cloth bag distribution to freshers' }
    ];

    const insertSurv = db.prepare(`
      INSERT INTO survey_responses (
        user_category, department, frequency_use, bags_per_week, primary_location,
        common_bag_type, primary_reason, carry_reusable_bag, reuse_frequency,
        aware_impact, support_restrictions, switch_alternatives, incentives_help,
        noticed_campaigns, effective_measure
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (let i = 0; i < 80; i++) {
      const template = sampleSurveys[i % sampleSurveys.length];
      insertSurv.run(
        template.user_category,
        template.department,
        template.frequency_use,
        template.bags_per_week + Math.floor(Math.random() * 3) - 1,
        template.primary_location,
        template.common_bag_type,
        template.primary_reason,
        template.carry_reusable_bag,
        template.reuse_frequency,
        template.aware_impact,
        template.support_restrictions,
        template.switch_alternatives,
        template.incentives_help,
        template.noticed_campaigns,
        template.effective_measure
      );
    }
  }
}

initDb();

module.exports = db;
