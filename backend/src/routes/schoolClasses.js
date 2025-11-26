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
const { schoolClassController } = require("../controllers");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize("class.read"),
  validateQuery(schemas.pagination),
  schoolClassController.getAll
);

router.get(
  "/row",
  authenticate,
  authorize("class.read"),
  schoolClassController.getAllRowClases
);

router.get(
  "/:id",
  authenticate,
  authorize("class.read"),
  schoolClassController.getById
);

router.post(
  "/",
  authenticate,
  authorize("class.create"),
  validate(schemas.schoolClassCreation),
  schoolClassController.create
);

router.put(
  "/:id",
  authenticate,
  authorize("class.update"),
  schoolClassController.update
);

router.delete(
  "/:id",
  authenticate,
  authorize("class.delete"),
  schoolClassController.delete
);

module.exports = router;
