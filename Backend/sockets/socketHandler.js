/** @format */

const connectedClients = {};

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("registerUser", (userId) => {
      connectedClients[userId] = socket.id;
      console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
    });

    socket.on("disconnect", () => {
      for (const userId in connectedClients) {
        if (connectedClients[userId] === socket.id) {
          delete connectedClients[userId];
          break;
        }
      }
      console.log("A user disconnected");
    });
  });
};

module.exports = { setupSocket, connectedClients };
