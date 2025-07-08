const express = require("express");
const router = express.Router();
const userLearningController = require("../controllers/userLearningController");

router.get("/:userId/:level/progress", userLearningController.getUserProgress);
router.get(
  "/lessons/:topicId/:level/:skill",
  userLearningController.getLessonsByTopicLevelSkill
);
module.exports = router;
