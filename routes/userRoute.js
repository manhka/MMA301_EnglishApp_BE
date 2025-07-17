const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { createLesson, getLessons, getLessonById, updateLesson, deleteLesson } = require("../controllers/lessonController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
module.exports = router;
