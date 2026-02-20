const express = require("express");
const {
  getDashboardOverview,
  getDashboardSummary,
} = require("../controllers/dashboardController");
const {
  authenticate,
  authorize,
  checkSchoolAccess,
  checkSystemAccess,
} = require("../middleware/auth");

const router = express.Router();


// Get complete dashboard statistics
router.get(
  "/summary",
  authenticate,
  authorize(["super_admin", "admin","system_owner"]),
  checkSystemAccess,
  checkSchoolAccess,
  getDashboardSummary,
);

// Get simplified dashboard overview
router.get(
  "/overview",
  authorize(["super_admin", "admin"]),
  checkSystemAccess,
  checkSchoolAccess,
  getDashboardSummary,
  getDashboardOverview,
);

// Get current session and term information

module.exports = router;
