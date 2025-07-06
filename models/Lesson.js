const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  skill: {
    type: String,
    enum: ["listening", "speaking", "reading", "writing"],
    required: true,
  },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
  content: String,
  media: [String],
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Lesson", LessonSchema, "lessons");
