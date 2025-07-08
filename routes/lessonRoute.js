const express = require("express");
const router = express.Router();
const lessonController = require("../controllers/lessonController");

router.get("/lesson/:lessonId/details", lessonController.getLessonDetail);

module.exports = router;
