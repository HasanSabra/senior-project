const express = require("express");

const request = require("../controllers/requests.controller");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
router.get(
  "/existing/:election_id",
  authMiddleware,
  request.getExistingRequest,
);

router.post("/send", authMiddleware, request.sendRequest);
router.post("/cancel/:election_id", authMiddleware, request.cancelRequest);

router.get("/elections", authMiddleware, request.getElections);
router.get("/lists", authMiddleware, request.getLists);
router.get(
  "/lists/election/:electionId",
  authMiddleware,
  request.getListsByElection,
);

module.exports = router;
