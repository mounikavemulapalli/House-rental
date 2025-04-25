const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const express = require("express");
const uuidv4 = require("../utils/uuid");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

router.get("/properties", async (req, res) => { // <<< Still commented out
  const db = req.app.locals.db;
  try {
    const properties = await db.all(`SELECT * FROM properties`);
    res.status(201).json(properties); // Should be 200 for successful GET
  } catch (err) {
    res.status(500).json({ errorMsg: "Internal Server Error" });
  }
});
router.post(
  "/add-properties",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    const db = req.app.locals.db;

    // Destructuring the request body to get the necessary fields
    const {
      propertyTitle,
      price,
      propertyType,
      description,
      address,
      street,
      city,
      state,
      pinCode,
      latitude,
      longitude,
    } = req.body;

    // Destructure userId from the token payload
    const { userId } = req.payload;
    
    // Get the image path from multer (if any)
    const imagePath = req.file ? req.file.path : null;

    // Check if required fields are provided
    if (!propertyTitle || !price || !propertyType || !description || !address || !street || !city || !state || !pinCode) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }

    // Generate a unique propertyId using uuidv4
    const propertyId = uuidv4();

    // Array of parameters to be used in the query
    const params = [
      propertyId,
      propertyTitle,
      price,
      propertyType,
      description,
      address,
      street,
      city,
      state,
      pinCode,
      latitude,
      longitude,
      userId,
      imagePath,
    ];

    // Log the parameters for debugging
    console.log("Parameters for INSERT:", params);

    try {
      // Insert into DB, including image path if available
      await db.run(
        `INSERT INTO properties (
          propertyId,
          propertyTitle,
          price,
          propertyType,
          description,
          address,
          street,
          city,
          state,
          pinCode,
          mapLatitude,
          mapLongitude,
          ownerId,
          wallpaperImage
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params
      );

      // Respond with success message
      res.status(201).json({ message: "Property added successfully" });
    } catch (err) {
      console.error("Database Insert Error:", err); // Log the specific error
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
