/** @format */

// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuidv4 = require("../utils/uuid");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password, email, phoneNumber } = req.body;
  const db = req.app.locals.db;
  const id = uuidv4();

  try {
    const userExists = await db.get(`SELECT * FROM users WHERE username = ?`, [
      username,
    ]);
    if (userExists) {
      return res
        .status(400)
        .json({ errorMsg: "User Name already exists! Enter unique Username" });
    }

    const emailExists = await db.get(`SELECT * FROM users WHERE email = ?`, [
      email,
    ]);
    if (emailExists) {
      return res
        .status(400)
        .json({
          errorMsg: "User already Registered with this provided mailID",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    await db.run(
      `INSERT INTO users (userId, username, email, password, phoneNumber) VALUES (?, ?, ?, ?, ?)`,
      [id, username, email, hashedPassword, phoneNumber]
    );

    res.status(201).json({ message: `Created new user with ID ${id}` });
  } catch (err) {
    res
      .status(500)
      .json({ errorMsg: "Error creating user", details: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const db = req.app.locals.db;

  try {
    const user = await db.get(`SELECT * FROM users WHERE username = ?`, [
      username,
    ]);
    if (!user) return res.status(400).json({ errorMsg: "Invalid username" });

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched)
      return res.status(400).json({ errorMsg: "Invalid password" });

    const token = jwt.sign({ username, userId: user.userId }, "usha@myap1s1");
    res.status(201).json({ userId: user.userId, jwtToken: token });
  } catch (err) {
    res.status(500).json({ errorMsg: "Login error", details: err.message });
  }
});

router.get("/user-profile", authenticateToken, async (req, res) => {
  const db = req.app.locals.db;
  const { userId } = req.payload;

  try {
    const user = await db.get(`SELECT * FROM users WHERE userId = ?`, [userId]);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ errorMsg: "Database error" });
  }
});

module.exports = router;
