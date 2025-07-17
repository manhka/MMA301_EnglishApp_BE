const Result = require("../models/Result");
const Lesson = require("../models/Lesson");
const History = require("../models/History");

// ===========================
// SUBMIT RESULT
// ===========================
exports.submitResult = async (req, res) => {
  try {
    const { lessonId, answers, userId } = req.body;

    // Tìm bài học và load các câu hỏi
    const lesson = await Lesson.findById(lessonId).populate("questions");
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    let correctCount = 0;
    const details = [];

    // Duyệt từng câu hỏi để chấm điểm
    for (const question of lesson.questions) {
      const qId = question._id.toString();
      const userSelected = answers[qId];

      const isMultiple = question.type === "multiple-choice";

      const selected = isMultiple
        ? Array.isArray(userSelected)
          ? userSelected
          : []
        : typeof userSelected === "number"
        ? userSelected
        : null;

      const correctAnswers = question.correctAnswers;
      let isCorrect = false;

      // So sánh đáp án
      if (isMultiple) {
        isCorrect =
          Array.isArray(selected) &&
          selected.length === correctAnswers.length &&
          selected.every((ans) => correctAnswers.includes(ans));
      } else {
        isCorrect = selected === correctAnswers[0];
      }

      if (isCorrect) correctCount++;

      details.push({
        questionId: question._id,
        selected,
        correct: isCorrect,
      });
    }

    // Tính điểm %
    const score = Math.round((correctCount / lesson.questions.length) * 100);

    // Lưu kết quả
    const result = await Result.create({
      userId: userId || null,
      lessonId: lesson._id,
      skill: lesson.skill,
      score,
      details,
    });

    // Lưu lịch sử làm bài
    await History.create({
      userId,
      skill: lesson.skill,
      resultId: result._id,
      lessonId: lesson._id,
      score,
      submittedAt: new Date(),
    });

    // Populate để trả về kết quả đầy đủ
    const populatedResult = await Result.findById(result._id)
      .populate("lessonId", "title duration")
      .populate("details.questionId");

    res.status(201).json({
      resultId: result._id,
      result: populatedResult,
    });
  } catch (err) {
    console.error("Error submitting result:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ===========================
// GET RESULT BY ID
// ===========================
exports.getResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate("userId", "name email")
      .populate("lessonId", "title duration")
      .populate("details.questionId");

    if (!result) return res.status(404).json({ message: "Result not found" });

    res.json(result);
  } catch (err) {
    console.error("Error fetching result:", err);
    res.status(500).json({ message: "Server error" });
  }
};
