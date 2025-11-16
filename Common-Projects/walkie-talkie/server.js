const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = [];

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("get-hosts", () => {
    socket.emit("update-users", users);
  });

  socket.on("host-joined", () => {
    users.push({ id: socket.id });
    io.emit("update-users", users);
  });

  socket.on("join-request", (hostId) => {
    io.to(hostId).emit("incoming-join", socket.id);
  });

  socket.on("signal", ({ to, data }) => {
    io.to(to).emit("signal", { from: socket.id, data });
  });

  socket.on("disconnect", () => {
    users = users.filter((u) => u.id !== socket.id);
    io.emit("update-users", users);
  });
});

server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
