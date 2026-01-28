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
  authorize(["super_admin", "admin","teacher","student","parent"]),
  validateQuery(schemas.pagination),
  schoolClassController.getAll
);

router.get(
  "/row",
  authenticate,
  authorize(["super_admin", "admin","teacher","student","parent"]),
  schoolClassController.getAllRowClases
);

router.get(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin","teacher","student","parent"]),
  schoolClassController.getById
);


router.post(
  "/",
  authenticate,
  authorize(["super_admin", "admin"]),
  validate(schemas.schoolClassCreation),
  schoolClassController.create
);

router.put(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  schoolClassController.update
);

router.delete(
  "/:id",
  authenticate,
  authorize(["super_admin", "admin"]),
  schoolClassController.delete
);

module.exports = router;
