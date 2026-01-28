const express = require("express");
const {
  authenticate,
  checkSchoolAccess,
  authorize,
} = require("../middleware/auth");
const { schoolTermController } = require("../controllers");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(["super_admin", "admin"]),
  schoolTermController.getAll
);

router.get(
  "/active-session",
  authenticate,
  authorize(["super_admin", "admin"]),
  schoolTermController.getSessionTerm
);

router.get(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  checkSchoolAccess,
  schoolTermController.getById
);

router.put(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  schoolTermController.updateTerm
);

router.put(
  "/:id/activate",
  authenticate,
  authorize(["super_admin", "admin"]),
  schoolTermController.activateTerm
);

router.post("/", authenticate, checkSchoolAccess, schoolTermController.create);

// Toggle term status
router.patch(
  "/:id/toggle-status",
  authenticate,
  authorize(["super_admin", "admin"]),
  schoolTermController.toggleStatus
);

router.delete("/:id", authenticate,authorize(["super_admin", "admin"]), schoolTermController.delete);

module.exports = router;
