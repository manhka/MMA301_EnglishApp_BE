const mongoose = require("mongoose");

const WritingSubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  question: String,
  text: String,
  aiScore: Number,
  aiFeedback: String,
  submittedAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model(
  "WritingSubmission",
  WritingSubmissionSchema,
  "writingSubmissions"
);
