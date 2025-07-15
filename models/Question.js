const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  type: {
    type: String,
    enum: [
      "multiple-choice",
      "single-choice",
      "fill-in-the-blank",
      "true-false",
    ],
    default: "multiple-choice",
  },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true,
  },
  choices: [String],
  correctAnswers: [Number],
  explanation: String,
  skill: {
    type: String,
    enum: ["listening", "reading", "writing"],
    required: true,
  },
});
module.exports = mongoose.model("Question", QuestionSchema, "questions");
