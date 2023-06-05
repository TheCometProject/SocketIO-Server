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
  socket.on("join-room", (roomId, user) => {
    console.warn(user);
    const userId = user.userId;
    
    console.log(`user ${userId} joined ${roomId}`);

    socket.join(roomId);

    socket.on("ready", () => {
      socket.to(roomId).emit("user-connected", user);

      socket.on("message", (msg) => {
        socket.to(roomId).emit("message", msg, user);
      });
    });

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});

httpServer.listen(10000);
