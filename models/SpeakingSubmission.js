const mongoose = require("mongoose");

const SpeakingSubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  question: String,
  audioUrl: String,
  transcript: String,
  aiScore: Number,
  aiFeedback: String,
  submittedAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model(
  "SpeakingSubmisson",
  SpeakingSubmissionSchema,
  "speakingSubmissions"
);
