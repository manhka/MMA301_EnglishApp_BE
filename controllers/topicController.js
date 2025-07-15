const Topic = require("../models/Topic");

exports.getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find().lean();
    res.json({ topics });
  } catch (error) {
    console.error("Error getting topics:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.searchTopics = async (req, res) => {
  try {
    const name = req.query.name || "";
    const topics = await Topic.find({
      name: { $regex: name, $options: "i" },
    });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({ error: "Topic not found" });
    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTopic = async (req, res) => {
  try {
    const { name, description } = req.body;
    const topic = await Topic.create({ name, description });
    res.status(201).json(topic);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!topic) return res.status(404).json({ error: "Topic not found" });
    res.json(topic);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) return res.status(404).json({ error: "Topic not found" });
    res.json({ message: "Topic deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
