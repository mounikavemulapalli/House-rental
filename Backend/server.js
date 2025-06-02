/** @format */
const fs = require("fs");
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const { setupSocket } = require("./sockets/socketHandler");
const path = require("path");
const authRoutes = require("./routes/auth");
const propertiesRoutes = require("./routes/properties");
const chatRoutes = require("./routes/chat");
const allowedOrigins = ["https://house-rental-theta.vercel.app"];
const app = express();
const server = http.createServer(app); // Create HTTP server from Express app
const io = new Server(server, {
  cors: {
    origin: "https://house-rental-theta.vercel.app", // Allow your frontend origin
    methods: ["GET", "POST"],
  },
});

setupSocket(io);
// Middleware to attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(express.json());
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.replace(/\/$/, ""); // remove trailing slash if any
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.options("*", cors());

let db;
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  db = await connectDB();
  app.locals.db = db;
  console.log("Database connected!");

  // Mount routes for authentication, properties, and chat
  app.use("/", authRoutes);
  app.use("/", propertiesRoutes);
  app.use("/", chatRoutes);

  // Serve images from the 'uploads' directory
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  // app.use("/uploads", express.static("uploads"));

  // Start the server using the http server instance
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
