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
