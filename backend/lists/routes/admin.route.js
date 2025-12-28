const express = require("express");

const adminControllers = require("../controllers/admin.controller");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  adminControllers.createList,
);
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  adminControllers.getAllLists,
);
router.put(
  "/:list_id",
  authMiddleware,
  roleMiddleware("admin"),
  adminControllers.updateList,
);
router.delete(
  "/:list_id",
  authMiddleware,
  roleMiddleware("admin"),
  adminControllers.deleteList,
);

module.exports = router;
