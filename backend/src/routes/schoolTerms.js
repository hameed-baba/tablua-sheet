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
  authorize("term.read"),
  schoolTermController.getAll
);

router.get(
  "/active-session",
  authenticate,
  authorize("term.read"),
  schoolTermController.getSessionTerm
);

router.get(
  "/:id",
  authenticate,
  checkSchoolAccess,
  schoolTermController.getById
);

router.put(
  "/:id",
  authenticate,
  authorize("term.update"),
  schoolTermController.updateTerm
);

router.put(
  "/:id/activate",
  authenticate,
  authorize("term.update"),
  schoolTermController.activateTerm
);

router.post("/", authenticate, checkSchoolAccess, schoolTermController.create);

// Toggle term status
router.patch(
  "/:id/toggle-status",
  authenticate,
  schoolTermController.toggleStatus
);

router.delete("/:id", authenticate, schoolTermController.delete);

module.exports = router;
