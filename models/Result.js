const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  skill: { type: String, enum: ["listening", "reading"], required: true },
  score: Number,
  submittedAt: { type: Date, default: Date.now },
  details: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      selected: mongoose.Schema.Types.Mixed,
      correct: Boolean,
    },
  ],
});

module.exports = mongoose.model("Result", ResultSchema, "results");
