const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const userApp = require("./APIs/userApi");
const authorApp = require("./APIs/authorApi");

const port = process.env.PORT || 5000;

// ✅ CORS FIX for Vercel + Localhost
app.use(
  cors({
   origin: [
  "http://localhost:5173",
  "https://blog-app-git-main-manikantas-projects-4224981e.vercel.app"
],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Handle preflight requests properly


app.use(express.json());

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// ✅ API routes
app.use("/user-api", userApp);
app.use("/author-api", authorApp);

// ✅ Error handler middleware
app.use((err, req, res, next) => {
  console.log("error object in express error handler :", err);

  if (res.headersSent) return next(err);

  res.status(500).send({ message: err.message });
});

// ✅ DB + Start server
mongoose
  .connect(process.env.DBURL)
  .then(() => {
    app.listen(port, () => {
      console.log(`server listening on port ${port}`);
      console.log("DB connected successfully");
    });
  })
  .catch((err) => console.log("error in DB connection", err));
