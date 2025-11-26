const express = require("express");
const { authenticate, checkSchoolAccess, authorize } = require("../middleware/auth");
const {
  validate,
  validateQuery,
  schemas,
} = require("../middleware/validation");
const { schoolSectionController } = require("../controllers");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize('section.read'),
  validateQuery(schemas.pagination),
  schoolSectionController.getAll
);

router.get("/:id", authenticate,authorize('section.read'), schoolSectionController.getById);

router.post(
  "/",
  authenticate,
  authorize('section.create'),
  validate(schemas.schoolSectionCreation),
  schoolSectionController.create
);

router.put("/:id", authenticate,authorize('section.update'), schoolSectionController.update);

router.delete("/:id", authenticate,authorize('section.delete'), schoolSectionController.delete);

module.exports = router;
