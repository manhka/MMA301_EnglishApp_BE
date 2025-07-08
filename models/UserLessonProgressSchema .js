const mongoose = require("mongoose");

const UserLessonProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  status: {
    type: String,
    enum: ["not_started", "in_progress", "completed"],
    default: "not_started",
    required: true,
  },
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "UserLessonProgress",
  UserLessonProgressSchema,
  "userLessonProgress"
);
