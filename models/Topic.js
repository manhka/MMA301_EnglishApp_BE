const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
});
module.exports = mongoose.model("Topic", TopicSchema, "topics");
