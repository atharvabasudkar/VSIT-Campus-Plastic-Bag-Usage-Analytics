const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'vsit_cep_sustainability_secret_key_2025';

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. Malformed token.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access restricted to Administrators.' });
  }
  next();
}

module.exports = { verifyToken, requireAdmin, JWT_SECRET };
