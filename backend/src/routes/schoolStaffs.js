const express = require("express");
const {
  authenticate,
  checkSystemAccess,
  authorize,
} = require("../middleware/auth");
const {
  validate,
  validateQuery,
  schemas,
} = require("../middleware/validation");
const { schoolStaffController } = require("../controllers");

const router = express.Router();

// Register new staff
router.post(
  "/",
  authenticate,
  authorize("staff.create"),
  validate(schemas.staffRegistration),
  schoolStaffController.register
);

// Get all staff with pagination and filters
router.get(
  "/",
  authenticate,
  authorize("staff.read"),
  validateQuery(schemas.pagination),
  schoolStaffController.getAll
);

// Get staff by ID
router.get(
  "/:id",
  authenticate,
  authorize("staff.read"),
  schoolStaffController.getById
);
router.get(
  "/profile/:id",
  authenticate,
  authorize("staff.read"),
  schoolStaffController.getStaffProfile
);

router.get(
  "/section/:id",
  authenticate,
  authorize("staff.read"),
  schoolStaffController.getAllStaffBySection
);

// Update staff
router.put(
  "/:id",
  authenticate,
  authorize("staff.update"),
  checkSystemAccess,
  schoolStaffController.update
);

router.patch(
  "/:id/toggle-access",
  authenticate,
  authorize("staff.update"),
  schoolStaffController.toggleSchoolAccess
);

router.patch(
  "/:id/toggle-status",
  authenticate,
  authorize("staff.update"),
  schoolStaffController.toggleStaffStatus
);

// Soft delete staff
router.delete(
  "/:id",
  authenticate,
  authorize("staff.delete"),
  checkSystemAccess,
  schoolStaffController.delete
);

module.exports = router;
