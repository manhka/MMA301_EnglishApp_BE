const express = require("express");
const router = express.Router();
const userLearningController = require("../controllers/userLearningController");

router.get("/:userId/:level/progress", userLearningController.getUserProgress);
router.get(
  "/lessons/:topicId/:level/:skill",
  userLearningController.getLessonsByTopicLevelSkill
);
router.get("/lesson/:id/reading", userLearningController.getReadingLesson);
router.get("/lesson/:id/listening", userLearningController.getListeningLesson);
router.get("/lesson/:id/writing", userLearningController.getWritingLesson);
router.get("/lesson/:id/speaking", userLearningController.getSpeakingLesson);
router.post("/submit/writing", userLearningController.submitWriting);
module.exports = router;
