const express = require("express");
const {
  authenticate,
  checkSchoolAccess,
  authorize,
} = require("../middleware/auth");
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
  authorize(["super_admin", "admin"]),
  validateQuery(schemas.pagination),
  schoolSectionController.getAll,
);

router.get(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  schoolSectionController.getById,
);

router.post(
  "/",
  authenticate,
  authorize(["super_admin", "admin"]),
  validate(schemas.schoolSectionCreation),
  schoolSectionController.create,
);

router.put(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  schoolSectionController.update,
);

router.delete(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  schoolSectionController.delete,
);

module.exports = router;
