const usermodel = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function registerUser(req, res) {
  try {
    const { username, email, password, role = "user" } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required",
      });
    }

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Check if email or username already exists
    const existingUser = await usermodel.findOne({
      $or: [
        { email: cleanEmail },
        { username: cleanUsername },
        { username: { $regex: new RegExp(`^${cleanUsername.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
      ],
    });

    if (existingUser) {
      const isEmailMatch = existingUser.email.toLowerCase() === cleanEmail;
      return res.status(409).json({
        message: isEmailMatch 
          ? "An account with this email already exists. Please sign in." 
          : "This username is already taken. Please choose another.",
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await usermodel.create({
      username: cleanUsername,
      email: cleanEmail,
      password: hash,
      role,
    });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'credential';
      return res.status(409).json({
        message: `An account with this ${field} already exists.`,
      });
    }
    return res.status(500).json({
      message: "Internal server error during registration",
    });
  }
}

async function loginuser(req, res) {
  try {
    const rawIdentifier = req.body.identifier || req.body.username || req.body.email || "";
    const identifier = rawIdentifier.trim();
    const password = req.body.password;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Email or username and password are required",
      });
    }

    const cleanEmail = identifier.toLowerCase();
    const safeRegex = new RegExp(`^${identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');

    // Case-insensitive lookup by email or username
    const user = await usermodel.findOne({
      $or: [
        { email: cleanEmail },
        { email: safeRegex },
        { username: identifier },
        { username: safeRegex },
      ],
    });

    if (!user) {
      return res.status(401).json({
        message: "No account found with this email or username. Please check your spelling or sign up.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Incorrect password. Please verify and try again.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: "Internal server error during sign in",
    });
  }
}

async function logoutuser(req, res) {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to log out",
    });
  }
}

module.exports = { registerUser, loginuser, logoutuser };
