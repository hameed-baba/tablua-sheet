const express = require("express");
const {
  getStaffActivityStatus,
  getStaffSessions,
  recordLogin,
  recordLogout,
  cleanupStaleSessions
} = require("../controllers/staffActivityController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get active staff and recently logged out staff
router.get("/status", getStaffActivityStatus);

// Get staff session history
router.get("/sessions/:staffId?", getStaffSessions);

// Record login session
router.post("/login", recordLogin);

// Record logout
router.post("/logout", recordLogout);

// Clean up stale sessions
router.post("/cleanup", cleanupStaleSessions);

module.exports = router;