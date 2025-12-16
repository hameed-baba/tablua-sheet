const express = require('express');
const router = express.Router();
const { generatePdfMakePDF, generateModernPdfMakePDF } = require('../controllers/pdfController');

// Route for generating PDF using pdfmake (Classic Style)
router.post('/generate-pdfmake', generatePdfMakePDF);

// Route for generating PDF using pdfmake (Modern Style)
router.post('/generate-modern-pdfmake', generateModernPdfMakePDF);

module.exports = router;