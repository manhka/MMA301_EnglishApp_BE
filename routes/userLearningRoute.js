const express = require("express");
const router = express.Router();
const userLearningController = require("../controllers/userLearningController");

router.get("/:userId/:level/progress", userLearningController.getUserProgress);
router.get(
  "/lessons/:topicId/:level/:skill",
  userLearningController.getLessonsByTopicLevelSkill
);
router.get("/lesson/:id/reading", userLearningController.getReadingLesson);
router.post("/submit", userLearningController.submitResult);
module.exports = router;
