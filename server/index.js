const express = require("express");
const app = express();
const https = require("https");
const cors = require("cors");
const { Server } = require("socket.io");
const { readFileSync } = require("fs");
require("dotenv").config();
app.use(cors());

const server = https.createServer({
  key: readFileSync("server.key"),
  cert: readFileSync("server.cert"),
});
const origin = process.env.ORIGIN || "https://localhost:3000";
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});

app.use("/", (req, res) => {
  res.send(origin);
});
