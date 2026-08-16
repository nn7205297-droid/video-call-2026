const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {

  socket.on("join-room", (roomId) => {
    socket.join(roomId);

    const users = io.sockets.adapter.rooms.get(roomId);

    if (users && users.size > 1) {
      socket.to(roomId).emit("viewer-ready");
    }
  });

  socket.on("offer", ({ roomId, offer }) => {
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", ({ roomId, answer }) => {
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice-candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("ice-candidate", candidate);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("peer-left");
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
