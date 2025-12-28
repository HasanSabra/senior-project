const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || [
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Import your existing routes
const authRoutes = require("./authentication/routes/auth.route");
const voteRoutes = require("./voting/routes/user.route");
const electionAdminRoutes = require("./elections/routes/admin.route");
const electionUsersRoutes = require("./elections/routes/user.route");
// const resultRoutes = require("./results/routes/result.routes");
const candidateAdminRoutes = require("./candidates/routes/admin.route");
const candidateUsersRoutes = require("./candidates/routes/request.route");
const listAdminRoutes = require("./lists/routes/admin.route");
const listUsersRoutes = require("./lists/routes/user.route");
const userAdminRoutes = require("./users/routes/admin.route");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/vote", voteRoutes);
app.use("/api/admin/elections", electionAdminRoutes);
app.use("/api/users/elections", electionUsersRoutes);
// app.use("/api/results", resultRoutes);
app.use("/api/admin/candidates", candidateAdminRoutes);
app.use("/api/users/candidates", candidateUsersRoutes);
app.use("/api/admin/lists", listAdminRoutes);
app.use("/api/users/lists", listUsersRoutes);
app.use("/api/admin/users", userAdminRoutes);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`
  Server running on port ${PORT}
  Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}
  Environment: ${process.env.NODE_ENV || "development"}
  `);
});
