const express = require("express");

const adminController = require("../controllers/admin.controller");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const app = express.Router();

app.post("/", authMiddleware, roleMiddleware("admin"), adminController.create);
app.get("/", authMiddleware, roleMiddleware("admin"), adminController.get);
app.put(
  "/:user_id",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.update,
);
app.delete(
  "/:user_id",
  authMiddleware,
  roleMiddleware("admin"),
  adminController.delete,
);

module.exports = app;
