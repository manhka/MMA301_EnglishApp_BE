const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  type: {
    type: String,
    enum: ["multiple-choice", "fill-in-the-blank", "true-false"],
    default: "multiple-choice",
  },
  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true,
  },
  choices: [String],
  correctAnswer: Number,
  explanation: String,
  skill: {
    type: String,
    enum: ["listening", "reading"],
    required: true,
  },
});
module.exports = mongoose.model("Question", QuestionSchema, "questions");
