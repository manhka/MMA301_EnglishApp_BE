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
const Topic = require("../models/Topic");

// Tạo mới Lesson
exports.createLesson = async (req, res) => {
  try {
    const lesson = new Lesson(req.body);
    await lesson.save();
    res.status(201).json(lesson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lấy tất cả Lessons (có filter skill và level)
exports.getLessons = async (req, res) => {
  try {
    const { skill, level } = req.query;
    const filter = {};
    if (skill) filter.skill = skill;
    if (level) filter.level = level;

    const lessons = await Lesson.find(filter)
      .populate("topicId")
      .populate("questions");
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy một Lesson theo ID
exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate("topicId")
      .populate("questions");
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật Lesson theo ID
exports.updateLesson = async (req, res) => {
  try {
    const { title, skill, level, topic, questions, content, duration } =
      req.body || {};

    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Parse topic
    let topicId = lesson.topicId;
    if (topic) {
      const topicObj = typeof topic === "string" ? JSON.parse(topic) : topic;
      if (topicId) {
        await Topic.findByIdAndUpdate(topicId, topicObj);
      } else {
        const newTopic = new Topic(topicObj);
        await newTopic.save();
        topicId = newTopic._id;
      }
    }

    // Parse questions
    let questionIds = lesson.questions || [];
    if (questions) {
      const questionsArray =
        typeof questions === "string" ? JSON.parse(questions) : questions;

      if (questionIds.length) {
        await Question.deleteMany({ _id: { $in: questionIds } });
      }

      if (questionsArray.length) {
        const created = await Question.insertMany(questionsArray);
        questionIds = created.map((q) => q._id);
      } else {
        questionIds = [];
      }
    }

    // Update lesson
    lesson.title = title ?? lesson.title;
    lesson.skill = skill ?? lesson.skill;
    lesson.level = level ?? lesson.level;
    lesson.content = content ?? lesson.content;
    lesson.duration = duration ?? lesson.duration;
    lesson.topicId = topicId;
    lesson.questions = questionIds;

    if (req.file) {
      lesson.media = req.file.path;
    }

    await lesson.save();
    res.json({ message: "Lesson updated successfully", lesson });
  } catch (error) {
    console.error("Update failed", error);
    res.status(400).json({ error: error.message });
  }
};

// Xóa Lesson theo ID
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    res.json({ message: "Lesson deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createFullLesson = async (req, res) => {
  try {
    const { title, skill, level, topic, questions, content, duration } =
      req.body;

    // Nếu upload file (multer)
    const mediaFile = req.file ? req.file.filename : null;

    const topicObj = typeof topic === "string" ? JSON.parse(topic) : topic;
    const questionsArray =
      typeof questions === "string" ? JSON.parse(questions) : questions;

    // 1. Tạo Topic mới
    const newTopic = new Topic(topicObj);
    await newTopic.save();

    // 2. Tạo nhiều Question
    const createdQuestions = await Question.insertMany(questionsArray);
    const questionIds = createdQuestions.map((q) => q._id);

    // 3. Tạo Lesson
    const lesson = new Lesson({
      title,
      skill,
      level,
      topicId: newTopic._id,
      questions: questionIds,
      content,
      media: mediaFile,
      duration: parseInt(duration),
    });

    await lesson.save();

    res.status(201).json({
      message: "Lesson created successfully",
      lesson,
    });
  } catch (error) {
    console.error("Error creating lesson:", error);
    res.status(400).json({ error: error.message });
  }
};
