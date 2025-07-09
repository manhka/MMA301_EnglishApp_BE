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

exports.submitResult = async (req, res) => {
  try {
    const { userId, lessonId, skill, answers } = req.body;

    const lesson = await Lesson.findById(lessonId).populate("questions");
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const results = [];
    let totalCorrect = 0;

    for (const q of lesson.questions) {
      const questionId = q._id.toString();
      const correctAnswers = q.correctAnswers;
      const userSelected = answers[questionId];

      let isCorrect = false;

      if (Array.isArray(correctAnswers)) {
        const sortedUser = Array.isArray(userSelected)
          ? [...userSelected].sort()
          : [];
        const sortedCorrect = [...correctAnswers].sort();
        isCorrect =
          JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect);
      } else {
        isCorrect = userSelected === correctAnswers;
      }

      if (isCorrect) totalCorrect++;

      results.push({
        questionId: q._id,
        selected: userSelected,
        correct: isCorrect,
      });
    }

    const score = Math.round((totalCorrect / lesson.questions.length) * 100);

    const saved = await Result.create({
      userId,
      lessonId,
      skill,
      score,
      details: results,
    });

    res.status(201).json({
      message: "Result submitted",
      score,
      totalQuestions: lesson.questions.length,
      correctAnswers: totalCorrect,
      resultId: saved._id,
      details: results,
    });
  } catch (err) {
    console.error("Submit Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
