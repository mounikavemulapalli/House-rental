/** @format */

const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  try {
    const authHeader =
      req.headers["authorization"] || req.headers["Authorization"];
    const jwtToken = authHeader?.split(" ")[1];

    if (!jwtToken) {
      return res.status(400).json({ errorMsg: "Invalid JWT Token" });
    }

    jwt.verify(jwtToken, "usha@myap1s1", (error, payload) => {
      if (error) {
        return res.status(400).json({ errorMsg: "Invalid JWT Token" });
      }
      req.payload = payload;
      next();
    });
  } catch (err) {
    console.log(`Token error: ${err}`);
    res.status(400).json({ errorMsg: "Invalid JWT Token" });
  }
};

module.exports = authenticateToken;
