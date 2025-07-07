const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app.js");

dotenv.config();

const PORT = process.env.PORT || 9999;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://192.168.1.8:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
