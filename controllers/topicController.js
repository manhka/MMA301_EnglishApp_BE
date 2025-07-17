const Topic = require("../models/Topic");

// ===========================
// GET ALL TOPICS
// ===========================
exports.getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find().lean();
    res.json({ topics });
  } catch (error) {
    console.error("Error getting topics:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===========================
// SEARCH TOPICS BY NAME
// ===========================
exports.searchTopics = async (req, res) => {
  try {
    const name = req.query.name || "";

    const topics = await Topic.find({
      name: { $regex: name, $options: "i" }, // tìm không phân biệt hoa thường
    });

    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===========================
// GET TOPIC BY ID
// ===========================
exports.getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({ error: "Topic not found" });

    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===========================
// CREATE TOPIC
// ===========================
exports.createTopic = async (req, res) => {
  try {
    const { name, description } = req.body;

    const topic = await Topic.create({ name, description });

    res.status(201).json(topic);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ===========================
// UPDATE TOPIC BY ID
// ===========================
exports.updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // trả về bản ghi sau khi update
      runValidators: true, // kiểm tra validate trong schema
    });

    if (!topic) return res.status(404).json({ error: "Topic not found" });

    res.json(topic);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ===========================
// DELETE TOPIC BY ID
// ===========================
exports.deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);

    if (!topic) return res.status(404).json({ error: "Topic not found" });

    res.json({ message: "Topic deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
