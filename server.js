const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-viewer", () => {
    socket.join("video-room");
    socket.to("video-room").emit("viewer-ready");
  });

  socket.on("join-sharer", () => {
    socket.join("video-room");
    socket.to("video-room").emit("sharer-ready");
  });

  socket.on("offer", (offer) => {
    socket.to("video-room").emit("offer", offer);
  });

  socket.on("answer", (answer) => {
    socket.to("video-room").emit("answer", answer);
  });

  socket.on("ice-candidate", (candidate) => {
    socket.to("video-room").emit("ice-candidate", candidate);
  });

  socket.on("disconnect", () => {
    socket.to("video-room").emit("peer-disconnected");
    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/view", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/share", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
