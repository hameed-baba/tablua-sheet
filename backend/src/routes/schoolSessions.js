const express = require("express");
const {
  authenticate,

  authorize,
} = require("../middleware/auth");
const { schoolSessionController } = require("../controllers");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize("session.read"),
  schoolSessionController.getAll
);

router.get(
  "/row",
  authenticate,
  authorize("session.read"),
  schoolSessionController.getAllSession
);

// Get active session
router.get(
  "/active",
  authenticate,
  authorize("session.read"),
  schoolSessionController.getActiveSession
);

router.get(
  "/:id",
  authenticate,
  authorize("session.read"),
  schoolSessionController.getById
);

router.post(
  "/",
  authenticate,
  authorize("session.create"),
  schoolSessionController.createSession
);

router.put(
  "/:id",
  authenticate,
  authorize("session.update"),
  schoolSessionController.update
);

router.put(
  "/:id/activate",
  authenticate,
  authorize("session.update"),
  schoolSessionController.activateSession
);

router.delete(
  "/:id",
  authenticate,
  authorize("session.delete"),
  schoolSessionController.delete
);

module.exports = router;
