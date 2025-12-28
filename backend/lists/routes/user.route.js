const express = require("express");

const userControllers = require("../controllers/view.controller");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
router.get("/:election_id", authMiddleware, userControllers.getAllLists);

module.exports = router;
