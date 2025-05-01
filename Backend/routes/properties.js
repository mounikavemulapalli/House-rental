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
    const properties = await db.all(`
      SELECT
        propertyId, propertyTitle, price, propertyType, description,
        address, street, city, state, pinCode,
        mapLatitude, mapLongitude, ownerId, wallpaperImage
      FROM properties
    `);
    res.status(200).json(properties);
  } catch (err) {
    console.error("Error fetching all properties:", err);
    res.status(500).json({ errorMsg: "Internal Server Error" });
  }
});

// Route to get properties by the logged-in owner
router.get("/properties/owner", authenticateToken, async (req, res) => {
  const db = req.app.locals.db;
  const { userId } = req.payload;

  if (!userId) {
    return res.status(401).json({ errorMsg: "User ID not found in token." });
  }

  try {
    const properties = await db.all(
      `SELECT
         propertyId, propertyTitle, price, propertyType, description,
         address, street, city, state, pinCode,
         mapLatitude, mapLongitude, ownerId, wallpaperImage
       FROM properties
       WHERE ownerId = ?`,
      [userId]
    );
    res.status(200).json(properties);
  } catch (err) {
    console.error("Error fetching owner properties:", err);
    res.status(500).json({ errorMsg: "Internal Server Error" });
  }
});

// Route to add a new property (requires authentication)
router.post(
  "/add-properties",
  authenticateToken,
  upload.single("wallpaperImage"),
  async (req, res) => {
    const db = req.app.locals.db;
    const imagePath = req.file ? req.file.path : null;

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

    const { userId } = req.payload;

    if (!propertyTitle || !price || !propertyType || !description || !address || !street || !city || !state || !pinCode) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }

    const propertyId = uuidv4();

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
      imagePath, // Corrected to use imagePath
    ];

    console.log("Parameters for INSERT:", params);

    try {
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

      res.status(201).json({ message: "Property added successfully" });
    } catch (err) {
      console.error("Database Insert Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Route to delete a property by owner
router.delete("/properties/:propertyId", authenticateToken, async (req, res) => {
  const db = req.app.locals.db;
  const { propertyId } = req.params;
  const { userId } = req.payload;

  try {
    const property = await db.get(`SELECT * FROM properties WHERE propertyId = ? AND ownerId = ?`, [propertyId, userId]);
    if (!property) {
      return res.status(404).json({ errorMsg: "Property not found or you are not the owner." });
    }

    await db.run(`DELETE FROM properties WHERE propertyId = ?`, [propertyId]);
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (err) {
    console.error("Error deleting property:", err);
    res.status(500).json({ errorMsg: "Internal Server Error" });
  }
});

module.exports = router;
