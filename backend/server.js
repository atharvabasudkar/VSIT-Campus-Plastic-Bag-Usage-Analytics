const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import database to initialize
require('./database/database');

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/observations', require('./routes/observations'));
app.use('/api/surveys', require('./routes/surveys'));
app.use('/api/locations', require('./routes/locations'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/targets', require('./routes/targets'));
app.use('/api/impact', require('./routes/impact'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/export', require('./routes/importExport'));
app.use('/api/import', require('./routes/importExport'));
app.use('/api/dataset', require('./routes/importExport'));
app.use('/api/pledges', require('./routes/pledges'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    institution: 'Vidyalankar School of Information Technology (VSIT)',
    project: 'Campus Plastic Bag Usage and Reduction Analysis',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`VSIT CEP Backend Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
