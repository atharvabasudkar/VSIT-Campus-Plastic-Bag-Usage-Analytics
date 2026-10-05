const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

let Database;
let db;

try {
  Database = require('better-sqlite3');
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

  const nativeDb = new Database(dbPath);
  nativeDb.pragma('foreign_keys = ON');

  initNativeDb(nativeDb, dbPath);
  db = nativeDb;
  console.log('Loaded native better-sqlite3 database successfully.');
} catch (err) {
  console.warn('better-sqlite3 native binary module unavailable, activating Memory DB fallback for Serverless environment:', err.message);
  db = createMemoryDb();
}

function initNativeDb(nativeDb, dbPath) {
  console.log('Initializing Native SQLite database at:', dbPath);

  nativeDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin', 'team', 'student_staff')) DEFAULT 'student_staff',
      department TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS campus_locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      code TEXT,
      risk_level TEXT CHECK(risk_level IN ('LOW', 'MODERATE', 'HIGH', 'CRITICAL')) DEFAULT 'MODERATE',
      description TEXT,
      recommended_action TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      code TEXT
    );
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

  // Seed Admin user
  const adminCheck = nativeDb.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('admin');
  if (adminCheck.count === 0) {
    const passHash = bcrypt.hashSync('admin123', 10);
    nativeDb.prepare(`
      INSERT INTO users (name, email, password_hash, role, department)
      VALUES (?, ?, ?, ?, ?)
    `).run('VSIT CEP Admin', 'admin@vsit.edu.in', passHash, 'admin', 'Administrative Staff');

    const teamHash = bcrypt.hashSync('team123', 10);
    nativeDb.prepare(`
      INSERT INTO users (name, email, password_hash, role, department)
      VALUES (?, ?, ?, ?, ?)
    `).run('CEP Field Researcher', 'cep_team@vsit.edu.in', teamHash, 'team', 'BSc IT');
  }

  // Seed Locations
  const locationCheck = nativeDb.prepare('SELECT COUNT(*) as count FROM campus_locations').get();
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

    const insertLoc = nativeDb.prepare(`
      INSERT INTO campus_locations (name, code, risk_level, description, recommended_action)
      VALUES (?, ?, ?, ?, ?)
    `);
    for (const loc of defaultLocations) {
      insertLoc.run(loc.name, loc.code, loc.risk, loc.desc, loc.action);
    }
  }

  // Seed Departments
  const deptCheck = nativeDb.prepare('SELECT COUNT(*) as count FROM departments').get();
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
    const insertDept = nativeDb.prepare('INSERT INTO departments (name, code) VALUES (?, ?)');
    for (const d of depts) insertDept.run(d.name, d.code);
  }

  // Seed Campaigns
  const campaignCheck = nativeDb.prepare('SELECT COUNT(*) as count FROM campaigns').get();
  if (campaignCheck.count === 0) {
    const campaigns = [
      { name: 'Bring Your Own Bag (BYOB)', start: '2025-01-10', end: '2025-04-10', participants: 420, target: 35.0, actual: 31.5, status: 'Active', desc: 'Encouraging all VSIT students and faculty to carry custom cloth bags.' },
      { name: 'Plastic-Free Friday', start: '2025-02-01', end: '2025-05-30', participants: 650, target: 50.0, actual: 44.2, status: 'Active', desc: 'Single-use plastic restriction on all Fridays across canteen and campus vendors.' },
      { name: 'Green Campus Week', start: '2024-11-15', end: '2024-11-22', participants: 880, target: 40.0, actual: 42.0, status: 'Completed', desc: 'Awareness workshops, pledge collection, and eco-friendly tote bag distribution.' },
      { name: 'Reusable Bag Challenge', start: '2025-06-01', end: '2025-08-31', participants: 0, target: 45.0, actual: 0.0, status: 'Upcoming', desc: 'Inter-departmental competition for highest percentage of reusable bag adoption.' },
      { name: 'Say No to Single-Use Plastic', start: '2024-12-01', end: '2024-12-31', participants: 510, target: 25.0, actual: 28.4, status: 'Completed', desc: 'Vendor audit and enforcement campaign at campus takeaway points.' }
    ];
    const insertCamp = nativeDb.prepare(`
      INSERT INTO campaigns (name, start_date, end_date, participants, target_reduction, actual_reduction, status, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const c of campaigns) {
      insertCamp.run(c.name, c.start, c.end, c.participants, c.target, c.actual, c.status, c.desc);
    }
  }

  // Seed Reduction Target
  const targetCheck = nativeDb.prepare('SELECT COUNT(*) as count FROM reduction_targets').get();
  if (targetCheck.count === 0) {
    nativeDb.prepare(`
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

  // Seed Plastic Usage Records from Dataset CSV
  const recordsCheck = nativeDb.prepare('SELECT COUNT(*) as count FROM plastic_usage_records').get();
  if (recordsCheck.count === 0) {
    const records = parseCsvDataset();
    if (records.length > 0) {
      const insertStmt = nativeDb.prepare(`
        INSERT INTO plastic_usage_records (
          record_id, date, month, user_category, department, campus_location,
          bag_type, bags_used, estimated_weight_grams, purpose, reusable_bag_used,
          plastic_avoidable, awareness_level, campaign_exposure, reduction_action,
          disposal_method, survey_rating, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const insertMany = nativeDb.transaction((rows) => {
        for (const r of rows) {
          insertStmt.run(
            r.record_id, r.date, r.month, r.user_category, r.department, r.campus_location,
            r.bag_type, r.bags_used, r.estimated_weight_grams, r.purpose, r.reusable_bag_used,
            r.plastic_avoidable, r.awareness_level, r.campaign_exposure, r.reduction_action,
            r.disposal_method, r.survey_rating, r.notes
          );
        }
      });
      insertMany(records);
    }
  }

  // Seed Surveys
  const surveyCheck = nativeDb.prepare('SELECT COUNT(*) as count FROM survey_responses').get();
  if (surveyCheck.count === 0) {
    const insertSurv = nativeDb.prepare(`
      INSERT INTO survey_responses (
        user_category, department, frequency_use, bags_per_week, primary_location,
        common_bag_type, primary_reason, carry_reusable_bag, reuse_frequency,
        aware_impact, support_restrictions, switch_alternatives, incentives_help,
        noticed_campaigns, effective_measure
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const samples = getSampleSurveys();
    for (const s of samples) {
      insertSurv.run(
        s.user_category, s.department, s.frequency_use, s.bags_per_week, s.primary_location,
        s.common_bag_type, s.primary_reason, s.carry_reusable_bag, s.reuse_frequency,
        s.aware_impact, s.support_restrictions, s.switch_alternatives, s.incentives_help,
        s.noticed_campaigns, s.effective_measure
      );
    }
  }
}

function parseCsvDataset() {
  const records = [];
  const csvPath = path.join(__dirname, '..', 'dataset', 'VSIT_Campus_Plastic_Bag_Usage_Dataset.csv');
  if (fs.existsSync(csvPath)) {
    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length > 1) {
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length >= 17) {
          records.push({
            id: i,
            record_id: values[0]?.trim() || `REC-${i}`,
            date: values[1]?.trim() || '2024-10-01',
            month: values[2]?.trim() || '2024-10',
            user_category: values[3]?.trim() || 'Students',
            department: values[4]?.trim() || 'BSc IT',
            campus_location: values[5]?.trim() || 'Canteen',
            bag_type: values[6]?.trim() || 'Thin Carry Bag',
            bags_used: parseInt(values[7]) || 1,
            estimated_weight_grams: parseFloat(values[8]) || 5.0,
            purpose: values[9]?.trim() || 'Food takeaway',
            reusable_bag_used: values[10]?.trim() || 'No',
            plastic_avoidable: values[11]?.trim() || 'Yes',
            awareness_level: values[12]?.trim() || 'Medium',
            campaign_exposure: values[13]?.trim() || 'No',
            reduction_action: values[14]?.trim() || 'None',
            disposal_method: values[15]?.trim() || 'Dustbin',
            survey_rating: parseInt(values[16]) || 3,
            notes: values[17]?.trim() || 'Field observation record'
          });
        }
      }
    }
  }
  return records;
}

function getSampleSurveys() {
  const surveys = [];
  const depts = ['BSc IT', 'BSc CS', 'BCA', 'MSc IT', 'Teaching Staff', 'Administrative Staff'];
  const locs = ['Canteen', 'Cafeteria', 'Stationery Area', 'Library Area', 'Campus Events'];
  const categories = ['Students', 'Teaching Staff', 'Non-Teaching Staff', 'Visitors'];

  for (let i = 0; i < 80; i++) {
    surveys.push({
      id: i + 1,
      user_category: categories[i % categories.length],
      department: depts[i % depts.length],
      frequency_use: i % 3 === 0 ? 'Daily' : (i % 2 === 0 ? 'Occasionally' : 'Weekly'),
      bags_per_week: (i % 5) + 1,
      primary_location: locs[i % locs.length],
      common_bag_type: i % 2 === 0 ? 'Thin Carry Bag' : 'Medium Carry Bag',
      primary_reason: 'Food takeaway & convenience',
      carry_reusable_bag: i % 3 === 0 ? 'Always' : 'Sometimes',
      reuse_frequency: i % 2 === 0 ? 'Often' : 'Rarely',
      aware_impact: 'Yes',
      support_restrictions: 'Yes',
      switch_alternatives: 'Yes',
      incentives_help: 'Yes',
      noticed_campaigns: i % 2 === 0 ? 'Yes' : 'No',
      effective_measure: 'BYOB rewards & canteen carry bag charge'
    });
  }
  return surveys;
}

// Full JavaScript In-Memory Database Fallback for Serverless Runtimes
function createMemoryDb() {
  const users = [
    { id: 1, name: 'VSIT CEP Admin', email: 'admin@vsit.edu.in', password_hash: bcrypt.hashSync('admin123', 10), role: 'admin', department: 'Administrative Staff', created_at: new Date().toISOString() },
    { id: 2, name: 'CEP Field Researcher', email: 'cep_team@vsit.edu.in', password_hash: bcrypt.hashSync('team123', 10), role: 'team', department: 'BSc IT', created_at: new Date().toISOString() }
  ];

  const campus_locations = [
    { id: 1, name: 'Canteen', code: 'CAN', risk_level: 'HIGH', description: 'Primary student lunch and fast-food takeaway hub', recommended_action: 'Implement reusable meal containers and charge eco-fee for carry bags.' },
    { id: 2, name: 'Cafeteria', code: 'CAF', risk_level: 'HIGH', description: 'Beverage and snack counter', recommended_action: 'Provide discounts for BYO reusable cups and cloth tote bags.' },
    { id: 3, name: 'Stationery Area', code: 'STN', risk_level: 'MODERATE', description: 'Printouts, xerox, and stationery supplies', recommended_action: 'Transition to recycled paper packaging and cloth bags.' },
    { id: 4, name: 'Library Area', code: 'LIB', risk_level: 'LOW', description: 'Academic study and book lending center', recommended_action: 'Enforce strict plastic bag ban inside study zones.' },
    { id: 5, name: 'Administrative Area', code: 'ADM', risk_level: 'LOW', description: 'Faculty offices and administrative departments', recommended_action: 'Paper file folders only; ban polythene covers.' },
    { id: 6, name: 'Campus Events', code: 'EVT', risk_level: 'CRITICAL', description: 'Festivals, seminars, workshops, and sports days', recommended_action: 'Mandate zero-plastic vendor policies for all campus fests.' },
    { id: 7, name: 'Student Activity Area', code: 'ACT', risk_level: 'MODERATE', description: 'Clubs, common room, and outdoor courtyard', recommended_action: 'Set up reusable bag donation bank & awareness kiosks.' },
    { id: 8, name: 'Entrance / Exit', code: 'ENT', risk_level: 'LOW', description: 'Main campus security gates and walkways', recommended_action: 'Install prominent plastic reduction signage & pledge board.' },
    { id: 9, name: 'Nearby Vendor Interaction', code: 'VND', risk_level: 'HIGH', description: 'Perimeter tea stalls, snacks, and street food', recommended_action: 'Conduct community outreach with surrounding local vendors.' },
    { id: 10, name: 'Other', code: 'OTH', risk_level: 'LOW', description: 'Miscellaneous campus areas', recommended_action: 'Periodic audits and general awareness posters.' }
  ];

  const departments = [
    { id: 1, name: 'BSc IT', code: 'BSCIT' },
    { id: 2, name: 'BSc CS', code: 'BSCCS' },
    { id: 3, name: 'BCA', code: 'BCA' },
    { id: 4, name: 'MSc IT', code: 'MSCIT' },
    { id: 5, name: 'Teaching Staff', code: 'FAC' },
    { id: 6, name: 'Administrative Staff', code: 'ADM' },
    { id: 7, name: 'Other', code: 'OTH' }
  ];

  const campaigns = [
    { id: 1, name: 'Bring Your Own Bag (BYOB)', start_date: '2025-01-10', end_date: '2025-04-10', participants: 420, target_reduction: 35.0, actual_reduction: 31.5, status: 'Active', description: 'Encouraging all VSIT students and faculty to carry custom cloth bags.' },
    { id: 2, name: 'Plastic-Free Friday', start_date: '2025-02-01', end_date: '2025-05-30', participants: 650, target_reduction: 50.0, actual_reduction: 44.2, status: 'Active', description: 'Single-use plastic restriction on all Fridays across canteen and campus vendors.' },
    { id: 3, name: 'Green Campus Week', start_date: '2024-11-15', end_date: '2024-11-22', participants: 880, target_reduction: 40.0, actual_reduction: 42.0, status: 'Completed', description: 'Awareness workshops, pledge collection, and eco-friendly tote bag distribution.' },
    { id: 4, name: 'Reusable Bag Challenge', start_date: '2025-06-01', end_date: '2025-08-31', participants: 0, target_reduction: 45.0, actual_reduction: 0.0, status: 'Upcoming', description: 'Inter-departmental competition for highest percentage of reusable bag adoption.' },
    { id: 5, name: 'Say No to Single-Use Plastic', start_date: '2024-12-01', end_date: '2024-12-31', participants: 510, target_reduction: 25.0, actual_reduction: 28.4, status: 'Completed', description: 'Vendor audit and enforcement campaign at campus takeaway points.' }
  ];

  const reduction_targets = [
    { id: 1, title: 'VSIT Annual Campus Plastic Bag Reduction Target 2024-2025', baseline_usage: 12500, target_usage: 6250, current_usage: 8120, target_date: '2025-12-31', notes: 'Targeting a 50% reduction in single-use plastic bags across all VSIT campus locations.' }
  ];

  const plastic_usage_records = parseCsvDataset();
  const survey_responses = getSampleSurveys();
  const pledges = [
    { id: 1, name: 'Anushka Salunke', email: 'anushka@vsit.edu.in', user_category: 'Students', department: 'BSc IT', pledge_type: 'Always Carry Reusable Cloth Bag', pledged_at: new Date().toISOString() },
    { id: 2, name: 'Ashwini Koyande', email: 'ashwini.koyande@vsit.edu.in', user_category: 'Teaching Staff', department: 'Teaching Staff', pledge_type: 'Refuse Single-Use Plastic Bags', pledged_at: new Date().toISOString() }
  ];

  return {
    pragma: () => {},
    exec: () => {},
    transaction: (fn) => (...args) => fn(...args),
    prepare: (sql) => {
      const cleanSql = sql.replace(/\s+/g, ' ').trim();

      return {
        get: (...params) => {
          // Users
          if (cleanSql.includes('FROM users WHERE email')) {
            const email = params[0];
            return users.find(u => u.email === email) || undefined;
          }
          if (cleanSql.includes('FROM users WHERE id')) {
            const id = params[0];
            return users.find(u => u.id == id) || undefined;
          }
          if (cleanSql.includes('COUNT(*) as count FROM users WHERE role')) {
            const role = params[0];
            return { count: users.filter(u => u.role === role).length };
          }
          if (cleanSql.includes('COUNT(*) as count FROM users')) {
            return { count: users.length };
          }

          // Locations
          if (cleanSql.includes('COUNT(*) as count FROM campus_locations')) {
            return { count: campus_locations.length };
          }
          if (cleanSql.includes('FROM campus_locations WHERE id')) {
            return campus_locations.find(l => l.id == params[0]) || undefined;
          }

          // Departments
          if (cleanSql.includes('COUNT(*) as count FROM departments')) {
            return { count: departments.length };
          }

          // Campaigns
          if (cleanSql.includes('COUNT(*) as count FROM campaigns')) {
            return { count: campaigns.length };
          }
          if (cleanSql.includes('FROM campaigns WHERE id')) {
            return campaigns.find(c => c.id == params[0]) || undefined;
          }

          // Targets
          if (cleanSql.includes('FROM reduction_targets')) {
            return reduction_targets[0] || { baseline_usage: 12500, target_usage: 6250, current_usage: 8120 };
          }

          // Surveys
          if (cleanSql.includes('COUNT(*) as count FROM survey_responses')) {
            return { count: survey_responses.length };
          }

          // Pledges
          if (cleanSql.includes('COUNT(*) as count FROM pledges')) {
            return { count: pledges.length };
          }

          // Plastic usage record count
          if (cleanSql.includes('COUNT(*) as count FROM plastic_usage_records WHERE') || cleanSql.includes('COUNT(*) as count FROM plastic_usage_records')) {
            return { count: plastic_usage_records.length };
          }

          // Analytics KPI Aggregations
          if (cleanSql.includes('SELECT') && cleanSql.includes('total_records') && cleanSql.includes('plastic_usage_records')) {
            const total_records = plastic_usage_records.length;
            const total_bags = plastic_usage_records.reduce((sum, r) => sum + (r.bags_used || 0), 0);
            const total_weight_grams = plastic_usage_records.reduce((sum, r) => sum + (r.estimated_weight_grams || 0), 0);
            const uniqueDays = new Set(plastic_usage_records.map(r => r.date)).size;
            const reusable_count = plastic_usage_records.filter(r => r.reusable_bag_used === 'Yes').length;
            const avoidable_count = plastic_usage_records.filter(r => r.plastic_avoidable === 'Yes').length;
            const campaign_aware_count = plastic_usage_records.filter(r => r.campaign_exposure === 'Yes').length;
            const high_awareness_count = plastic_usage_records.filter(r => r.awareness_level === 'High').length;

            return {
              total_records,
              total_bags,
              total_weight_grams,
              active_days: uniqueDays || 1,
              reusable_count,
              avoidable_count,
              campaign_aware_count,
              high_awareness_count
            };
          }

          // Top location
          if (cleanSql.includes('ORDER BY bags DESC LIMIT 1') || cleanSql.includes('campus_location, SUM(bags_used)')) {
            const locMap = {};
            for (const r of plastic_usage_records) {
              locMap[r.campus_location] = (locMap[r.campus_location] || 0) + (r.bags_used || 0);
            }
            let topLoc = 'Canteen', maxBags = 0;
            for (const [loc, count] of Object.entries(locMap)) {
              if (count > maxBags) { maxBags = count; topLoc = loc; }
            }
            return { campus_location: topLoc, bags: maxBags };
          }

          return {};
        },

        all: (...params) => {
          if (cleanSql.includes('FROM campus_locations')) {
            return campus_locations;
          }
          if (cleanSql.includes('FROM departments')) {
            return departments;
          }
          if (cleanSql.includes('FROM campaigns')) {
            return campaigns;
          }
          if (cleanSql.includes('FROM survey_responses')) {
            return survey_responses;
          }
          if (cleanSql.includes('FROM pledges')) {
            return pledges;
          }

          // Monthly trends
          if (cleanSql.includes('GROUP BY month')) {
            const monthMap = {};
            for (const r of plastic_usage_records) {
              if (!monthMap[r.month]) monthMap[r.month] = { month: r.month, total_bags: 0, records: 0, total_weight: 0 };
              monthMap[r.month].total_bags += (r.bags_used || 0);
              monthMap[r.month].total_weight += (r.estimated_weight_grams || 0);
              monthMap[r.month].records += 1;
            }
            return Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month));
          }

          // Department breakdown
          if (cleanSql.includes('GROUP BY department')) {
            const deptMap = {};
            for (const r of plastic_usage_records) {
              if (!deptMap[r.department]) deptMap[r.department] = { department: r.department, total_bags: 0, records: 0 };
              deptMap[r.department].total_bags += (r.bags_used || 0);
              deptMap[r.department].records += 1;
            }
            return Object.values(deptMap).map(d => ({ ...d, avg_bags: Math.round((d.total_bags / (d.records || 1)) * 10) / 10 })).sort((a, b) => b.total_bags - a.total_bags);
          }

          // Bag type breakdown
          if (cleanSql.includes('GROUP BY bag_type')) {
            const bagMap = {};
            for (const r of plastic_usage_records) {
              if (!bagMap[r.bag_type]) bagMap[r.bag_type] = { bag_type: r.bag_type, total_bags: 0, count: 0 };
              bagMap[r.bag_type].total_bags += (r.bags_used || 0);
              bagMap[r.bag_type].count += 1;
            }
            return Object.values(bagMap).sort((a, b) => b.total_bags - a.total_bags);
          }

          // User category breakdown
          if (cleanSql.includes('GROUP BY user_category')) {
            const catMap = {};
            for (const r of plastic_usage_records) {
              if (!catMap[r.user_category]) catMap[r.user_category] = { user_category: r.user_category, total_bags: 0, records: 0 };
              catMap[r.user_category].total_bags += (r.bags_used || 0);
              catMap[r.user_category].records += 1;
            }
            return Object.values(catMap).map(c => ({ ...c, avg_bags: Math.round((c.total_bags / (c.records || 1)) * 10) / 10 })).sort((a, b) => b.total_bags - a.total_bags);
          }

          // Disposal breakdown
          if (cleanSql.includes('GROUP BY disposal_method')) {
            const dispMap = {};
            for (const r of plastic_usage_records) {
              dispMap[r.disposal_method] = (dispMap[r.disposal_method] || 0) + 1;
            }
            return Object.entries(dispMap).map(([disposal_method, count]) => ({ disposal_method, count }));
          }

          // Campaign impact breakdown
          if (cleanSql.includes('GROUP BY campaign_exposure')) {
            const aware = plastic_usage_records.filter(r => r.campaign_exposure === 'Yes');
            const unaware = plastic_usage_records.filter(r => r.campaign_exposure === 'No');
            return [
              {
                campaign_exposure: 'Yes',
                total_records: aware.length,
                total_bags: aware.reduce((sum, r) => sum + r.bags_used, 0),
                avg_bags: Math.round((aware.reduce((sum, r) => sum + r.bags_used, 0) / (aware.length || 1)) * 10) / 10,
                reusable_rate: Math.round((aware.filter(r => r.reusable_bag_used === 'Yes').length / (aware.length || 1)) * 100)
              },
              {
                campaign_exposure: 'No',
                total_records: unaware.length,
                total_bags: unaware.reduce((sum, r) => sum + r.bags_used, 0),
                avg_bags: Math.round((unaware.reduce((sum, r) => sum + r.bags_used, 0) / (unaware.length || 1)) * 10) / 10,
                reusable_rate: Math.round((unaware.filter(r => r.reusable_bag_used === 'Yes').length / (unaware.length || 1)) * 100)
              }
            ];
          }

          // Plastic usage records list with limit/offset
          if (cleanSql.includes('FROM plastic_usage_records')) {
            let res = [...plastic_usage_records];
            if (cleanSql.includes('ORDER BY date DESC')) {
              res.sort((a, b) => b.date.localeCompare(a.date));
            }
            if (cleanSql.includes('LIMIT')) {
              const limitMatch = cleanSql.match(/LIMIT\s+(\d+|\?)/i);
              const limit = limitMatch ? (limitMatch[1] === '?' ? params[params.length - 2] || 50 : parseInt(limitMatch[1])) : 50;
              return res.slice(0, typeof limit === 'number' ? limit : 50);
            }
            return res.slice(0, 100);
          }

          return [];
        },

        run: (...params) => {
          if (cleanSql.includes('INSERT INTO users')) {
            const newId = users.length + 1;
            users.push({
              id: newId,
              name: params[0],
              email: params[1],
              password_hash: params[2],
              role: params[3] || 'student_staff',
              department: params[4] || 'Other',
              created_at: new Date().toISOString()
            });
            return { lastInsertRowid: newId, changes: 1 };
          }

          if (cleanSql.includes('INSERT INTO plastic_usage_records')) {
            const newId = plastic_usage_records.length + 1;
            plastic_usage_records.push({
              id: newId,
              record_id: params[0],
              date: params[1],
              month: params[2],
              user_category: params[3],
              department: params[4],
              campus_location: params[5],
              bag_type: params[6],
              bags_used: params[7],
              estimated_weight_grams: params[8],
              purpose: params[9],
              reusable_bag_used: params[10],
              plastic_avoidable: params[11],
              awareness_level: params[12],
              campaign_exposure: params[13],
              reduction_action: params[14],
              disposal_method: params[15],
              survey_rating: params[16],
              notes: params[17]
            });
            return { lastInsertRowid: newId, changes: 1 };
          }

          if (cleanSql.includes('INSERT INTO survey_responses')) {
            const newId = survey_responses.length + 1;
            survey_responses.push({
              id: newId,
              user_category: params[0],
              department: params[1],
              frequency_use: params[2],
              bags_per_week: params[3],
              primary_location: params[4],
              common_bag_type: params[5],
              primary_reason: params[6],
              carry_reusable_bag: params[7],
              reuse_frequency: params[8],
              aware_impact: params[9],
              support_restrictions: params[10],
              switch_alternatives: params[11],
              incentives_help: params[12],
              noticed_campaigns: params[13],
              effective_measure: params[14],
              submitted_at: new Date().toISOString()
            });
            return { lastInsertRowid: newId, changes: 1 };
          }

          if (cleanSql.includes('INSERT INTO pledges')) {
            const newId = pledges.length + 1;
            pledges.push({
              id: newId,
              name: params[0],
              email: params[1],
              user_category: params[2],
              department: params[3],
              pledge_type: params[4],
              pledged_at: new Date().toISOString()
            });
            return { lastInsertRowid: newId, changes: 1 };
          }

          if (cleanSql.includes('INSERT INTO campus_locations')) {
            const newId = campus_locations.length + 1;
            campus_locations.push({
              id: newId,
              name: params[0],
              code: params[1],
              risk_level: params[2],
              description: params[3],
              recommended_action: params[4]
            });
            return { lastInsertRowid: newId, changes: 1 };
          }

          if (cleanSql.includes('INSERT INTO campaigns')) {
            const newId = campaigns.length + 1;
            campaigns.push({
              id: newId,
              name: params[0],
              start_date: params[1],
              end_date: params[2],
              participants: params[3],
              target_reduction: params[4],
              actual_reduction: params[5],
              status: params[6],
              description: params[7]
            });
            return { lastInsertRowid: newId, changes: 1 };
          }

          if (cleanSql.includes('UPDATE reduction_targets')) {
            if (reduction_targets[0]) {
              reduction_targets[0].title = params[0];
              reduction_targets[0].baseline_usage = params[1];
              reduction_targets[0].target_usage = params[2];
              reduction_targets[0].current_usage = params[3];
              reduction_targets[0].target_date = params[4];
              reduction_targets[0].notes = params[5];
            }
            return { changes: 1 };
          }

          return { lastInsertRowid: 1, changes: 1 };
        }
      };
    }
  };
}

module.exports = db;
