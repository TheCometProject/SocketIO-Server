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
    origin: "*", // <- TODO: change this to only allow our front-end's hostname
    methods: ["GET", "POST"],
  },
});

app.use(cors());

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    console.log(`user ${userId} joined ${roomId}`);
    socket.join(roomId);

    socket.on("ready", () => {
      console.log(`${userId} is ready`);
      socket.to(roomId).emit("user-connected", userId);
    });

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});

httpServer.listen(10000);
