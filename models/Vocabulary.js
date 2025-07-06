const mongoose = require("mongoose");

const VocabularySchema = new mongoose.Schema({
  word: { type: String, required: true },
  definition: String,
  examples: [String],
  level: { type: String, enum: ["A1", "A2", "B1", "B2", "C1", "C2"] },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
  synonyms: [String],
});
module.exports = mongoose.model("Vocabulary", VocabularySchema, "vocabularies");
