const express = require("express");
const router = express.Router();
const lessonController = require("../controllers/lessonController");
const multer = require("multer");
const path = require("path");
router.get("/lesson/:lessonId/details", lessonController.getLessonDetail);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Route tạo lesson kèm upload file
router.post(
  "/full",
  upload.single("media"), // field name: media
  lessonController.createFullLesson
);

// Lấy tất cả Lesson (lọc skill và level bằng query param)
router.get("/get_all", lessonController.getLessons);

// Lấy Lesson theo ID
router.get("/:id", lessonController.getLessonById);

// Cập nhật Lesson
router.put("/:id", upload.single("media"), lessonController.updateLesson);

// Xóa Lesson
router.delete("/:id", lessonController.deleteLesson);

module.exports = router;
