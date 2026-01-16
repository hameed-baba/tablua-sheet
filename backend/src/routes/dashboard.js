const express = require("express");
const {
  getDashboardStats,
  getDashboardOverview,
  getSessionInfo
} = require("../controllers/dashboardController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get complete dashboard statistics
router.get("/stats", getDashboardStats);

// Get simplified dashboard overview
router.get("/overview", getDashboardOverview);

// Get current session and term information
router.get("/session-info", getSessionInfo);

// Test endpoint to verify API is working
router.get("/test", (req, res) => {
  res.json({
    status: "success",
    message: "Dashboard API is working!",
    timestamp: new Date().toISOString(),
    endpoints: [
      "GET /api/dashboard/stats - Complete dashboard statistics",
      "GET /api/dashboard/overview - Simplified overview", 
      "GET /api/dashboard/session-info - Current session and term info",
      "GET /api/dashboard/test - This test endpoint"
    ]
  });
});

module.exports = router;