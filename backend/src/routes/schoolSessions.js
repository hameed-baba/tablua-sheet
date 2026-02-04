const express = require("express");
const {
  authenticate,

  authorize,
  checkSchoolAccess,
  checkSystemAccess,
  requireSuperAdmin,
} = require("../middleware/auth");
const { schoolSessionController } = require("../controllers");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(["super_admin", "admin", "teacher", "student", "parent"]),
  checkSchoolAccess,
  checkSystemAccess,
  schoolSessionController.getAll,
);

router.get(
  "/row",
  authenticate,
  authorize(["super_admin", "admin", "teacher", "student", "parent"]),
  checkSchoolAccess,
  checkSystemAccess,
  schoolSessionController.getAllSession,
);

// Get active session
router.get(
  "/active",
  authenticate,
  authorize(["super_admin", "admin", "teacher", "student", "parent"]),
  checkSchoolAccess,
  checkSystemAccess,
  schoolSessionController.getActiveSession,
);

router.get(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin", "teacher", "student", "parent"]),
  checkSchoolAccess,
  checkSystemAccess,
  schoolSessionController.getById,
);

router.post(
  "/",
  authenticate,
  requireSuperAdmin,
  checkSchoolAccess,
  checkSystemAccess,
  schoolSessionController.createSession,
);

router.put(
  "/:id",
  authenticate,
  requireSuperAdmin,
  checkSchoolAccess,
  checkSystemAccess,
  schoolSessionController.update,
);

router.put(
  "/:id/activate",
  authenticate,
  requireSuperAdmin,
  checkSchoolAccess,
  checkSystemAccess,
  schoolSessionController.activateSession,
);

router.delete(
  "/:id",
  authenticate,
  requireSuperAdmin,
  checkSchoolAccess,
  checkSystemAccess,
  schoolSessionController.delete,
);

module.exports = router;
