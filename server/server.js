const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const userApp = require("./APIs/userApi");
const authorApp = require("./APIs/authorApi");

const port = process.env.PORT || 5000;

// ✅ CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://blog-app-lovat-eight.vercel.app"
    ],
    credentials: true
  })
);

app.use(express.json());

// Health route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// APIs
app.use("/user-api", userApp);
app.use("/author-api", authorApp);

// Error handler
app.use((err, req, res, next) => {
  console.log("error object in express error handler :", err);
  res.status(500).send({ message: err.message });
});

// DB + server
mongoose
  .connect(process.env.DBURL)
  .then(() => {
    app.listen(port, () => {
      console.log(`server listening on port ${port}`);
      console.log("DB connected successfully");
    });
  })
  .catch((err) => console.log("error in DB connection", err));
