const express = require("express");

const view = require("../controllers/view.controller");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
router.get("/", authMiddleware, view.getElections);

module.exports = router;
