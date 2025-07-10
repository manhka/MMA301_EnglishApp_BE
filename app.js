const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

// middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to IELTS backend API 🎉",
  });
});

// mount routes
const userRoute = require("./routes/userRoute");
app.use("/api/auth", userRoute);
const userLearningRoute = require("./routes/userLearningRoute");
app.use("/api", userLearningRoute);
const topicRoute = require("./routes/topicRoute");
app.use("/api", topicRoute);
const lessonRoute = require("./routes/lessonRoute");
app.use("/api", lessonRoute);
const resultRoute = require("./routes/resultRoute");
app.use("/api", resultRoute);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// global error handler
app.use((err, req, res, next) => {
  console.error("💥 Global error:", err);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

// export app
module.exports = app;
