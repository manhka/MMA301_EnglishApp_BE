const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  questionText: { type: String, required: true },
  type: {
    type: String,
    enum: ["multiple-choice", "fill-in-the-blank", "true-false"],
    default: "multiple-choice",
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
