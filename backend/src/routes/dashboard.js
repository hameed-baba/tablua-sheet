const express = require("express");
const {
  getDashboardOverview,
  getDashboardSummary,
} = require("../controllers/dashboardController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get complete dashboard statistics
router.get("/summary", getDashboardSummary);

// Get simplified dashboard overview
router.get("/overview", getDashboardOverview);

// Get current session and term information

module.exports = router;
