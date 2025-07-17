const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ===========================
// REGISTER
// ===========================
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "This email is already existed, Login now" });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      email,
      passwordHash,
      name,
      // các field khác giữ mặc định
    });

    await newUser.save();

    res.status(201).json({
      message: "Register success",
    });
  } catch (err) {
    console.error("💥 Register error:", err);
    res.status(500).json({ message: "Register failed", error: err.message });
  }
};

// ===========================
// LOGIN
// ===========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login success",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("💥 Login error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// ===========================
// LOGOUT
// ===========================
exports.logout = async (req, res) => {
  try {
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("💥 Logout error:", err);
    res.status(500).json({ message: "Logout failed", error: err.message });
  }
};
