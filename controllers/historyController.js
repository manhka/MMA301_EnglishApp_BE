const History = require("../models/History");

exports.createHistory = async (req, res) => {
  try {
    const history = new History(req.body);
    const saved = await history.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getHistoriesByUser = async (req, res) => {
  try {
    const histories = await History.find({ userId: req.params.userId })
      .sort({ _id: -1 })
      .populate("resultId")
      .populate("writingSubmissionId");
    res.json(histories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
