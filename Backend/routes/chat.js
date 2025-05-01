/** @format */

const express = require("express");
const uuidv4 = require("../utils/uuid");
const authenticateToken = require("../middlewares/authenticateToken");
const { connectedClients } = require("../sockets/socketHandler");

const router = express.Router();
const handleSendMessage = async () => {
  if (messageContent.trim() !== "") {
    const token = Cookies.get("jwt_token");
    const url = "http://localhost:4000/add-chat-message";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const body = { chatId, messageContent };
    try {
      await axios.post(url, body, { headers });
      setMessageContent("");
    } catch (error) {
      console.error("Error sending message:", error.response ? error.response.data : error.message);
    }
  }
};


router.post("/chat-request", authenticateToken, async (req, res) => {
  const db = req.app.locals.db;
  const { userId } = req.payload;
  const { propertyId } = req.body;
  const chatId = uuidv4();

  try {
    // Fetch the property owner and image URL
    const property = await db.get(
      `SELECT ownerId, imgUrl FROM properties WHERE propertyId = ?`,
      [propertyId]
    );

    if (!property) {
      return res.status(404).json({ errorMsg: "Property not found" });
    }

    const { ownerId, imgUrl } = property;

    // Check if a chat request already exists
    const existing = await db.get(
      `SELECT chatId FROM chats WHERE userId = ? AND ownerId = ? AND propertyId = ?`,
      [userId, ownerId, propertyId]
    );

    if (!existing) {
      // Insert a new chat request
      await db.run(
        `INSERT INTO chats (chatId, propertyId, userId, ownerId, status) VALUES (?, ?, ?, ?, 'pending')`,
        [chatId, propertyId, userId, ownerId]
      );

      // Fetch the new chat request details, including the image URL
      const newChat = await db.get(
        `SELECT properties.propertyId, properties.imgUrl, chats.chatId, chats.status, users.username, properties.propertyTitle
         FROM chats 
         JOIN properties ON chats.propertyId = properties.propertyId
         JOIN users ON chats.userId = users.userId 
         WHERE chats.chatId = ?`,
        [chatId]
      );

      // Notify the property owner via WebSocket
      const ownerSocketId = connectedClients[ownerId];
      if (ownerSocketId) {
        req.io.to(ownerSocketId).emit("newChatRequest", newChat);
      }

      return res.status(201).json({
        newChatRequestDetails: newChat,
        message: "Chat request sent",
      });
    }

    res.status(201).json({ message: "Chat request already sent previously" });
  } catch (err) {
    console.error("Error in chat-request:", err);
    res.status(500).json({ errorMsg: "Database error", details: err.message });
  }
});

router.get("/received-chat-requests", authenticateToken, async (req, res) => {
  const db = req.app.locals.db;
  const { userId } = req.payload;

  try {
    const receivedRequests = await db.all(
      `SELECT chats.chatId, chats.status, properties.propertyTitle, properties.imgUrl, users.username
       FROM chats
       JOIN properties ON chats.propertyId = properties.propertyId
       JOIN users ON chats.userId = users.userId
       WHERE chats.ownerId = ?`,
      [userId]
    );

    res.status(200).json(receivedRequests);
  } catch (error) {
    console.error("Error fetching received chat requests:", error);
    res
      .status(500)
      .json({ errorMsg: "Database error", details: error.message });
  }
});

router.get("/sent-chat-requests", authenticateToken, async (req, res) => {
  const db = req.app.locals.db;
  const { userId } = req.payload;

  try {
    const sentRequests = await db.all(
      `SELECT chats.chatId, chats.status, properties.propertyTitle, properties.imgUrl, users.username
       FROM chats
       JOIN properties ON chats.propertyId = properties.propertyId
       JOIN users ON chats.ownerId = users.userId
       WHERE chats.userId = ?`,
      [userId]
    );

    res.status(200).json(sentRequests);
  } catch (error) {
    console.error("Error fetching sent chat requests:", error);
    res
      .status(500)
      .json({ errorMsg: "Database error", details: error.message });
  }
});

router.put("/update-chat-status", authenticateToken, async (req, res) => {
  const db = req.app.locals.db;
  const { chatId, statusText } = req.body;

  try {
    await db.run(`UPDATE chats SET status = ? WHERE chatId = ?`, [
      statusText,
      chatId,
    ]);

    const { userId } = await db.get(
      `SELECT userId FROM chats WHERE chatId = ?`,
      [chatId]
    );

    const updatedChats = await db.all(
      `SELECT chats.chatId, chats.status, users.username, properties.propertyTitle
       FROM chats JOIN properties ON chats.propertyId = properties.propertyId
       JOIN users ON chats.ownerId = users.userId WHERE chats.userId = ?`,
      [userId]
    );

    const senderSocketId = connectedClients[userId];
    if (senderSocketId) {
      req.io.to(senderSocketId).emit("chatStatusUpdated", updatedChats);
      if (statusText === "accepted") {
        req.io.to(senderSocketId).emit("chatAccepted", { chatId });
      }
    }

    res.status(201).json({
      chatId,
      status: statusText,
      message: "Chat status updated successfully",
    });
  } catch (err) {
    res.status(500).json({ errorMsg: "Internal Server Error" });
  }
});

router.post("/add-chat-message", authenticateToken, async (req, res) => {
  const db = req.app.locals.db;
  const { userId } = req.payload;
  const { chatId, messageContent } = req.body;
  const messageId = uuidv4();

  try {
    const currentTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });

    await db.run(
      `INSERT INTO messages (messageId, chatId, senderId, content, timestamp) VALUES (?, ?, ?, ?, ?)`,
      [messageId, chatId, userId, messageContent, currentTime]
    );

    const message = {
      chatId,
      messageId,
      senderId: userId,
      content: messageContent,
      timestamp: currentTime,
    };

    const { userId: uId, ownerId: oId } = await db.get(
      `SELECT userId, ownerId FROM chats WHERE chatId = ?`,
      [chatId]
    );

    if (connectedClients[uId])
      req.io.to(connectedClients[uId]).emit("newMessage", message);
    if (connectedClients[oId])
      req.io.to(connectedClients[oId]).emit("newMessage", message);

    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Error adding chat message:", err);
    res.status(500).json({ errorMsg: "Internal Server Error", details: err.message });
  }
});
router.get("/get-chat-messages", authenticateToken, async (req, res) => {
  const db = req.app.locals.db;
  const { chatId } = req.query;

  try {
    const messages = await db.all(
      `SELECT * FROM messages WHERE chatId = ? ORDER BY timestamp ASC`,
      [chatId]
    );
    res.status(201).json(messages);
  } catch (err) {
    res.status(500).json({ errorMsg: "Internal Server Error" });
  }
});
router.delete(
  "/cancel-chat-request/:chatId",
  authenticateToken,
  async (req, res) => {
    const db = req.app.locals.db;
    const { chatId } = req.params;

    try {
      console.log("Received chatId:", chatId); // Debugging log

      const result = await db.run(`DELETE FROM chats WHERE chatId = ?`, [
        chatId,
      ]);

      if (result.changes === 0) {
        return res.status(404).json({ errorMsg: "Chat request not found" });
      }

      res.status(200).json({ message: "Chat request canceled successfully" });
    } catch (error) {
      console.error("Error canceling chat request:", error);
      res.status(500).json({
        errorMsg: "Failed to cancel chat request",
        details: error.message,
      });
    }
  }
);
router.put("/accept-chat-request/:chatId", authenticateToken, async (req, res) => {
  const db = req.app.locals.db;
  const { chatId } = req.params;

  try {
    await db.run(`UPDATE chats SET status = 'accepted' WHERE chatId = ?`, [chatId]);

    const { userId } = await db.get(`SELECT userId FROM chats WHERE chatId = ?`, [chatId]);
    const senderSocketId = connectedClients[userId];
    if (senderSocketId) {
      req.io.to(senderSocketId).emit("chatAccepted", { chatId });
    }

    res.status(200).json({ message: "Chat request accepted" });
  } catch (err) {
    res.status(500).json({ errorMsg: "Internal Server Error" });
  }
});

router.put("/reject-chat-request/:chatId", authenticateToken, async (req, res) => {
  const db = req.app.locals.db;
  const { chatId } = req.params;

  try {
    await db.run(`UPDATE chats SET status = 'rejected' WHERE chatId = ?`, [chatId]);

    res.status(200).json({ message: "Chat request rejected" });
  } catch (err) {
    res.status(500).json({ errorMsg: "Internal Server Error" });
  }
});
// In your chat.js or equivalent backend route file
router.delete("/delete-chat-request/:chatId", authenticateToken, async (req, res) => {
  const db = req.app.locals.db;
  const { chatId } = req.params;

  try {
    const result = await db.run(`DELETE FROM chats WHERE chatId = ?`, [chatId]);

    if (result.changes === 0) {
      return res.status(404).json({ errorMsg: "Chat request not found" });
    }

    res.status(200).json({ message: "Chat request deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat request:", error);
    res.status(500).json({
      errorMsg: "Failed to delete chat request",
      details: error.message,
    });
  }
});
module.exports = router;
