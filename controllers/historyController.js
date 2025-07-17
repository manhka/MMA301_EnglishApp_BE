const History = require("../models/History");

// ===========================
// CREATE HISTORY
// ===========================
exports.createHistory = async (req, res) => {
  try {
    // Tạo mới lịch sử từ request body
    const history = new History(req.body);

    // Lưu vào DB
    const saved = await history.save();

    // Trả về kết quả đã lưu
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ===========================
// GET USER HISTORY
// ===========================
exports.getUserHistory = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Tìm tất cả lịch sử theo userId
    const histories = await History.find({ userId })
      .populate("resultId") // Kết quả bài test (reading, listening)
      .populate("writingSubmissionId") // Bài viết (writing)
      .populate("lessonId", "title duration"); // Thông tin bài học

    // Xử lý từng bản ghi lịch sử
    const response = histories.map((item) => {
      const isWriting = item.skill === "writing";
      const isResultBased =
        item.skill === "reading" || item.skill === "listening";

      const data = isWriting ? item.writingSubmissionId : item.resultId;
      const lesson = item.lessonId;

      // Tính số câu đúng
      const correct =
        isResultBased && data?.details
          ? data.details.filter((d) => d.correct).length
          : null;

      // Tổng số câu hỏi (writing = 1, result-based = length)
      const total =
        isResultBased && data?.details
          ? data.details.length
          : isWriting
          ? 1
          : null;

      return {
        id: item._id,
        type: capitalize(item.skill), // Viết hoa chữ cái đầu (Reading, Listening, Writing)
        title: lesson?.title || `Lesson ${lesson?._id?.toString().slice(-4)}`, // Nếu không có title thì dùng Lesson + 4 ký tự cuối của _id
        date: item.submittedAt.toISOString().split("T")[0], // Format ngày: YYYY-MM-DD
        duration: lesson?.duration ? `${lesson.duration} min` : "—", // Thời lượng bài học
        status: "completed",
        questions: total,
        correct: correct,
        resultId: item.resultId?._id || null,
        writingSubmissionId: item.writingSubmissionId?._id || null,
      };
    });

    res.json(response);
  } catch (err) {
    console.error("Error fetching user history:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ===========================
// HELPER FUNCTION
// ===========================
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
