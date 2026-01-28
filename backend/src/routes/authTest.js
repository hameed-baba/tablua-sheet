const express = require('express');
const {
  authenticate,
  authorize,
  requireSuperAdmin,
  requireAdmin,
  requireTeacher,
  authorizeLevel
} = require('../middleware/auth');

const router = express.Router();

// Test endpoint - any authenticated user
router.get('/test/authenticated', authenticate, (req, res) => {
  res.json({
    status: 'success',
    message: 'You are authenticated!',
    user: {
      id: req.user.id,
      name: req.user.full_name,
      role: req.user.Role?.role_name,
      slug: req.user.Role?.slug,
      level: req.user.Role?.level
    }
  });
});

// Test endpoint - super admin only
router.get('/test/super-admin', authenticate, requireSuperAdmin, (req, res) => {
  res.json({
    status: 'success',
    message: 'You are a Super Admin!',
    user: req.user.full_name
  });
});

// Test endpoint - admin or super admin
router.get('/test/admin', authenticate, requireAdmin, (req, res) => {
  res.json({
    status: 'success',
    message: 'You have admin access!',
    user: req.user.full_name
  });
});

// Test endpoint - teacher, admin, or super admin
router.get('/test/teacher', authenticate, requireTeacher, (req, res) => {
  res.json({
    status: 'success',
    message: 'You have teacher access or higher!',
    user: req.user.full_name
  });
});

// Test endpoint - specific roles
router.get('/test/specific-roles', authenticate, authorize(['admin', 'teacher']), (req, res) => {
  res.json({
    status: 'success',
    message: 'You are either an admin or teacher!',
    user: req.user.full_name
  });
});

// Test endpoint - minimum level
router.get('/test/level-80', authenticate, authorizeLevel(80), (req, res) => {
  res.json({
    status: 'success',
    message: 'You have level 80 or higher access!',
    user: req.user.full_name,
    level: req.user.Role?.level
  });
});

module.exports = router;