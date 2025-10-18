// routes/auth.js
const express = require("express");
const router = express.Router();
const Customer = require("../models/CustomerSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Secret for JWT (in production, use .env file)testuser1@example.com

const JWT_SECRET = "your_jwt_secret_key";

// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new customer
    const customer = new Customer({ name, email, password });
    await customer.save();

    // Create JWT token
    const token = jwt.sign({ id: customer._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "Customer registered successfully",
      customer: { id: customer._id, name: customer.name, email: customer.email },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= SIGNIN =================
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find customer by email
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await customer.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign({ id: customer._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "Login successful",
      customer: { id: customer._id, name: customer.name, email: customer.email },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
