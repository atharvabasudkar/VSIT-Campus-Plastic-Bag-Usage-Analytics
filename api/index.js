const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database initialization
require('../backend/database/database');

// API Routes
app.use('/api/auth', require('../backend/routes/auth'));
app.use('/api/analytics', require('../backend/routes/analytics'));
app.use('/api/observations', require('../backend/routes/observations'));
app.use('/api/surveys', require('../backend/routes/surveys'));
app.use('/api/locations', require('../backend/routes/locations'));
app.use('/api/campaigns', require('../backend/routes/campaigns'));
app.use('/api/targets', require('../backend/routes/targets'));
app.use('/api/impact', require('../backend/routes/impact'));
app.use('/api/reports', require('../backend/routes/reports'));
app.use('/api/export', require('../backend/routes/importExport'));
app.use('/api/import', require('../backend/routes/importExport'));
app.use('/api/dataset', require('../backend/routes/importExport'));
app.use('/api/pledges', require('../backend/routes/pledges'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    institution: 'Vidyalankar School of Information Technology (VSIT)',
    project: 'Campus Plastic Bag Usage and Reduction Analysis',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
