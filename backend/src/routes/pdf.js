const express = require("express");
const router = express.Router();
const {
  generateAllReportCards,
  generateBroadsheet,
} = require("../controllers/pdfController2");
const {
  authenticate,
  authorize,
  checkSchoolAccess,
  checkSystemAccess,
} = require("../middleware/auth");

// Route for generating PDF using pdfmake
router.post(
  "/generate-pdfmake",
  authenticate,
  authorize(["super_admin", "admin"]),
  checkSchoolAccess,
  checkSystemAccess,
  generateAllReportCards,
);
router.post(
  "/generate-pdfmake-2",
  authenticate,
  authorize(["super_admin", "admin"]),
  checkSchoolAccess,
  checkSystemAccess,
  generateAllReportCards,
);
router.post(
  "/generate-broadheet",
  authenticate,
  authorize(["super_admin", "admin"]),
  checkSchoolAccess,
  checkSystemAccess,
  generateBroadsheet,
);

module.exports = router;
