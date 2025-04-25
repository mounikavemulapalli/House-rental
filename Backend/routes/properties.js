const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const express = require("express");
const uuidv4 = require("../utils/uuid");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

// Route to get all properties (public)
router.get("/properties", async (req, res) => {
  const db = req.app.locals.db;
  try {
    // It's better to select specific columns than using *
    const properties = await db.all(`
      SELECT
        propertyId, propertyTitle, price, propertyType, description,
        address, street, city, state, pinCode,
        mapLatitude, mapLongitude, ownerId, wallpaperImage
      FROM properties
    `);
    // Use 200 OK for successful GET requests
    res.status(200).json(properties);
  } catch (err) {
    console.error("Error fetching all properties:", err); // Log error
    res.status(500).json({ errorMsg: "Internal Server Error" });
  }
});

// Route to get properties by the logged-in owner
router.get("/properties/owner", authenticateToken, async (req, res) => {
  const db = req.app.locals.db;
  const { userId } = req.payload; // Get userId from authenticated token payload

  if (!userId) {
    // This shouldn't happen if authenticateToken works, but good practice
    return res.status(401).json({ errorMsg: "User ID not found in token." });
  }

  try {
    // Select properties where ownerId matches the userId from the token
    const properties = await db.all(
      `SELECT
         propertyId, propertyTitle, price, propertyType, description,
         address, street, city, state, pinCode,
         mapLatitude, mapLongitude, ownerId, wallpaperImage
       FROM properties
       WHERE ownerId = ?`,
      [userId]
    );
    res.status(200).json(properties); // Send the owner's properties
  } catch (err) {
    console.error("Error fetching owner properties:", err); // Log error
    res.status(500).json({ errorMsg: "Internal Server Error" });
  }
});


// Route to add a new property (requires authentication)
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
      latitude, // Ensure these match DB column names (mapLatitude, mapLongitude)
      longitude, // Ensure these match DB column names (mapLatitude, mapLongitude)
      userId,
      imagePath, // Ensure this matches DB column name (wallpaperImage)
    ];

    // Log the parameters for debugging
    console.log("Parameters for INSERT:", params);

    try {
      // Insert into DB, including image path if available
      // Make sure column names here exactly match your DB schema
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
