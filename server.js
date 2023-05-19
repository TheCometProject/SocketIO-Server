// imports
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// initialize http and socket.io servers:
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("connection established");
  socket.on("join-room", (roomId, userId) => {
    console.log(
      "join-room event received, roomId=",
      roomId,
      " userId=",
      userId
    );
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
    console.log("sent user-connected to room ", roomId);

    socket.on("disconnect", () => {
      console.log("disconnect event");
      socket.to(roomId).emit("user-disconnected", userId);
      console.log("sent user-disconnected to room ", roomId);
    });
  });
});

httpServer.listen(10000);
