const express = require("express");
const { authenticate } = require("../middleware/auth");
const { validate, schemas } = require("../middleware/validation");
const { gradeSystemController } = require("../controllers");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize("grade.read"),
  gradeSystemController.getAll
);

router.post(
  "/",
  authenticate,
  authorize("grade.create"),
  validate(schemas.gradeSystemCreation),
  gradeSystemController.create
);

router.put(
  "/:id",
  authenticate,
  authorize("grade.update"),
  gradeSystemController.update
);

router.delete(
  "/:id",
  authenticate,
  authorize("grade.delete"),
  gradeSystemController.delete
);

module.exports = router;
