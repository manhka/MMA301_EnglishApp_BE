const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  skill: {
    type: String,
    enum: ["listening", "reading", "writing"],
    required: true,
  },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true,
  },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
  content: String,
  media: [String],
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  duration: { type: Number, default: 10, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Lesson", LessonSchema, "lessons");
