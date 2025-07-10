const express = require("express");
const router = express.Router();
const Result = require("../models/Result");
const Lesson = require("../models/Lesson");

exports.getUserProgress = async (req, res) => {
  try {
    const { userId, level } = req.params;

    // validate
    const allowedLevels = ["Beginner", "Intermediate", "Advanced"];
    if (!allowedLevels.includes(level)) {
      return res.status(400).json({ message: "Invalid level" });
    }

    // đếm tổng số bài theo level
    const totalLessons = await Lesson.countDocuments({ level });

    // tìm kết quả của user
    const results = await Result.find({ userId })
      .populate("lessonId", "skill level")
      .lean();

    // lọc kết quả đúng level
    const filteredResults = results.filter((r) => r.lessonId.level === level);

    // tính skill progress
    const skillCount = {
      listening: 0,
      speaking: 0,
      reading: 0,
      writing: 0,
    };

    const uniqueLessons = new Set();

    filteredResults.forEach((r) => {
      const skill = r.lessonId.skill;
      if (skillCount.hasOwnProperty(skill)) {
        skillCount[skill] += 1;
      }
      uniqueLessons.add(r.lessonId._id.toString());
    });

    // trả về progress phần trăm
    const percent = totalLessons
      ? (uniqueLessons.size / totalLessons) * 100
      : 0;

    res.json({
      level,
      progress: {
        totalLessons,
        completedLessons: uniqueLessons.size,
        percent: Math.round(percent),
        skills: skillCount,
      },
    });
  } catch (err) {
    console.error("get progress error", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getLessonsByTopicLevelSkill = async (req, res) => {
  try {
    const { topicId, level, skill } = req.params;

    // validate
    const allowedLevels = ["Beginner", "Intermediate", "Advanced"];
    const allowedSkills = ["listening", "speaking", "reading", "writing"];

    if (!allowedLevels.includes(level)) {
      return res.status(400).json({ message: "Invalid level" });
    }
    if (!allowedSkills.includes(skill)) {
      return res.status(400).json({ message: "Invalid skill" });
    }

    const lessons = await Lesson.find({
      topicId,
      level,
      skill,
    });

    res.json({
      topicId,
      level,
      skill,
      total: lessons.length,
      lessons,
    });
  } catch (err) {
    console.error("getLessonsByTopicLevelSkill error", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getReadingLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const lesson = await Lesson.findById(lessonId).populate({
      path: "questions",
      select: "_id questionText type choices ",
    });
    if (!lesson || lesson.skill !== "reading") {
      return res
        .status(404)
        .json({ error: "Lesson not found or not reading type" });
    }

    res.json({
      lessonId: lesson._id,
      title: lesson.title,
      content: lesson.content,
      duration: lesson.duration,
      questions: lesson.questions,
    });
  } catch (err) {
    console.error("Error fetching reading lesson:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getWritingLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson || lesson.skill !== "writing") {
      return res
        .status(404)
        .json({ error: "Lesson not found or not reading type" });
    }

    res.json({
      lessonId: lesson._id,
      title: lesson.title,
      content: lesson.content,
      duration: lesson.duration,
    });
  } catch (err) {
    console.error("Error fetching reading lesson:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getSpeakingLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson || lesson.skill !== "speaking") {
      return res
        .status(404)
        .json({ error: "Lesson not found or not speaking type" });
    }

    res.json({
      lessonId: lesson._id,
      title: lesson.title,
      content: lesson.content,
      duration: lesson.duration,
    });
  } catch (err) {
    console.error("Error fetching reading lesson:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getListeningLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const lesson = await Lesson.findById(lessonId).populate({
      path: "questions",
      select: "_id questionText type choices",
    });

    if (!lesson || lesson.skill !== "listening") {
      return res
        .status(404)
        .json({ error: "Lesson not found or not listening type" });
    }

    res.json({
      lessonId: lesson._id,
      title: lesson.title,
      media: lesson.media,
      duration: lesson.duration,
      questions: lesson.questions,
    });
  } catch (err) {
    console.error("Error fetching listening lesson:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
const WritingSubmission = require("../models/WritingSubmission");
const { evaluateWriting } = require("../services/ai");

exports.submitWriting = async (req, res) => {
  const { userId, lessonId, question, text } = req.body;

  if (!userId || !lessonId || !text || !question) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const aiFeedback = await evaluateWriting(question, text);
    console.log("AI feedback:\n", aiFeedback);

    // Tìm điểm tổng thể từ phản hồi
    let aiScore = null;

    const bandRegexList = [
      /\*\*?Overall Band Score:\*\*?\s*([0-9.]+)/i, // markdown bold
      /Overall Band Score:?\s*([0-9.]+)/i, // chuẩn
      /Overall Score:?\s*([0-9.]+)/i,
      /Overall Band:?\s*([0-9.]+)/i,
      /Overall:?\s*([0-9.]+)/i,
    ];

    for (const regex of bandRegexList) {
      const match = aiFeedback.match(regex);
      if (match) {
        aiScore = parseFloat(match[1]);
        break;
      }
    }

    const submission = new WritingSubmission({
      userId,
      lessonId,
      question,
      text,
      aiScore,
      aiFeedback,
    });

    await submission.save();

    res.status(200).json({
      message: "Writing submitted and evaluated.",
      aiScore,
      aiFeedback,
    });
  } catch (error) {
    console.error("Writing submission error:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};
