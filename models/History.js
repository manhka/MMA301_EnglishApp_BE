const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
  skill: {
    type: String,
    enum: ["reading", "listening", "writing", "speaking"],
    required: true,
  },
  resultId: { type: mongoose.Schema.Types.ObjectId, ref: "Result" },
  writingSubmissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WritingSubmission",
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  score: Number,
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("History", HistorySchema, "histories");
