const express = require("express");
const {
  authenticate,
  checkSchoolAccess,
  checkSystemAccess,
  requireSuperAdmin,
} = require("../middleware/auth");
const { schoolInvoiceController } = require("../controllers");

const router = express.Router();

router.get(
  "/school-invoices",
  authenticate,
  requireSuperAdmin,
  checkSchoolAccess,
  checkSystemAccess,
  schoolInvoiceController.getAllSchoolInvoices,
);
router.get(
  "/school-invoices/:id",
  authenticate,
  requireSuperAdmin,
  checkSchoolAccess,
  checkSystemAccess,
  schoolInvoiceController.getSchoolInvoiceById,
);

router.post(
  "/school-invoice",
  authenticate,
  requireSuperAdmin,
  checkSchoolAccess,
  checkSystemAccess,
  schoolInvoiceController.createSchoolInvoice,
);

router.put(
  "/school-invoices/:id",
  authenticate,
  requireSuperAdmin,
  checkSchoolAccess,
  checkSystemAccess,
  schoolInvoiceController.updateSchoolInvoice,
);
router.delete(
  "/school-invoices/:id",
  authenticate,
  requireSuperAdmin,
  checkSchoolAccess,
  checkSystemAccess,
  schoolInvoiceController.deleteSchoolInvoice,
);

module.exports = router;
