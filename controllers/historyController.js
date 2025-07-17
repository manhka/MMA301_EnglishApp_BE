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

exports.getUserHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    const histories = await History.find({ userId })
      .populate("resultId")
      .populate("writingSubmissionId")
      .populate("lessonId", "title duration");
    const response = histories.map((item) => {
      const isWriting = item.skill === "writing";
      const isResultBased =
        item.skill === "reading" || item.skill === "listening";

      const data = isWriting ? item.writingSubmissionId : item.resultId;
      const lesson = item.lessonId;

      const correct =
        isResultBased && data?.details
          ? data.details.filter((d) => d.correct).length
          : null;

      const total =
        isResultBased && data?.details
          ? data.details.length
          : isWriting
          ? 1
          : null;

      return {
        id: item._id,
        type: capitalize(item.skill),
        title: lesson?.title || `Lesson ${lesson?._id?.toString().slice(-4)}`,
        date: item.submittedAt.toISOString().split("T")[0],
        duration: lesson?.duration ? `${lesson.duration} min` : "—",
        status: "completed",
        questions: total,
        correct: correct,
        resultId: item.resultId?._id || null,
        writingSubmissionId: item.writingSubmissionId?._id || null,
      };
    });

    res.json(response);
  } catch (err) {
    console.error("Error fetching user history:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
