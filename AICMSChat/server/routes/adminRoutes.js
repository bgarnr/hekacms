const express = require('express');
const { requireUser } = require('./middleware/auth');
const { requireRole } = require('./middleware/role');

const router = express.Router();

// Simple health check restricted to admin role
router.get('/ping', requireUser, requireRole('admin'), (req, res) => {
  return res.status(200).json({ message: 'pong', email: req.user.email });
});

module.exports = router; 