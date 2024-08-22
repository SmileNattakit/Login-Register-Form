const express = require("express");
const router = express.Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

const encryptPassword = (password) => {
  return CryptoJS.AES.encrypt(password, process.env.AES_SECRET).toString();
};

const decryptPassword = (encryptedPassword) => {
  return CryptoJS.AES.decrypt(
    encryptedPassword,
    process.env.AES_SECRET
  ).toString(CryptoJS.enc.Utf8);
};

router.post("/register", async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!email || !phone || !password) {
      return res.status(400).json({
        message: "Please provide email, phone, and password",
      });
    }

    if (!isValidEmail(email) || !isValidPhone(phone)) {
      return res.status(400).json({ message: "Invalid email or phone format" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or phone number already in use" });
    }

    const encryptedPassword = encryptPassword(password);

    const newUser = new User({
      email,
      phone,
      password: encryptedPassword,
    });

    await newUser.save();
    res.status(201).json({
      message: "Registration successful",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const decryptedPassword = decryptPassword(user.password);

    if (decryptedPassword !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.json({
      message: "Login successful",
      user: {
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

module.exports = router;
