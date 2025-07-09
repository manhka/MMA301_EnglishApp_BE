const Lesson = require("../models/Lesson");
const Question = require("../models/Question");

exports.getLessonDetail = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId).populate(
      "topicId",
      "name description"
    );

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found." });
    }

    res.json({
      success: true,
      lesson,
    });
  } catch (err) {
    console.error("Get lesson detail error", err);
    res.status(500).json({ message: "Server error." });
  }
};
