const express = require("express");

const request = require("../controllers/requests.controller");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
router.post("/send", authMiddleware, request.sendRequest);
router.post("/cancel/:election_id", authMiddleware, request.cancelRequest);

module.exports = router;
