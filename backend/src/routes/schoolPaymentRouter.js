const express = require("express");
const {
  authenticate,
  checkSchoolAccess,
  checkSystemAccess,
  requireSuperAdmin,
} = require("../middleware/auth");
const { schoolPaymentController } = require("../controllers");

const router = express.Router();

router.post(
  "/school-payment",
  authenticate,
  requireSuperAdmin,
  checkSchoolAccess,
  checkSystemAccess,
  schoolPaymentController.createSchoolPayment,
);

module.exports = router;
