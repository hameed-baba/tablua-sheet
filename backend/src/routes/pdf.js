const express = require("express");
const router = express.Router();
const { generateAllReportCards, generateBroadsheet } = require("../controllers/pdfController2");

// Route for generating PDF using pdfmake
router.post("/generate-pdfmake", generateAllReportCards);
router.post("/generate-pdfmake-2", generateAllReportCards);
router.post("/generate-broadheet", generateBroadsheet);




module.exports = router;
