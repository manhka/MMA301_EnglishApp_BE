const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
  },
  preferences: {
    favoriteTopics: [String],
    weakSkills: [String],
  },
  progress: {
    listening: { type: Number, default: 0 },
    speaking: { type: Number, default: 0 },
    reading: { type: Number, default: 0 },
    writing: { type: Number, default: 0 },
  },
  avatarUrl: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});
module.exports = mongoose.model("User", UserSchema, "users");
