const express = require("express");

const userController = require("../controllers/users.controller");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/:election_id", authMiddleware, userController.getData);

router.get("/has-voted/:election_id", authMiddleware, userController.hasVoted);

router.post(
  "/municipality/:election_id",
  authMiddleware,
  userController.mayoralCastVote,
);
router.post(
  "/mayoral/:election_id",
  authMiddleware,
  userController.mayoralCastVote,
);
router.post(
  "/parliamentary/:election_id",
  authMiddleware,
  userController.parliamentaryCastVote,
);
router.post(
  "/speaker/:election_id",
  authMiddleware,
  userController.speakerCastVote,
);

module.exports = router;
