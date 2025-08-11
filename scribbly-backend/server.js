const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "https://scribbly-whiteboard-lbwvvtb58-kvaibhav114s-projects.vercel.app" }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://scribbly-whiteboard-lbwvvtb58-kvaibhav114s-projects.vercel.app",
    methods: ["GET", "POST"],
  },
});

// No auth check — just require username and sessionId
io.use((socket, next) => {
  const { username, sessionId } = socket.handshake.auth;
  if (!username || !sessionId) {
    return next(new Error("Missing username or session ID"));
  }
  socket.username = username;
  socket.sessionId = sessionId;
  socket.join(sessionId);
  next();
});

io.on("connection", (socket) => {
  console.log(`User ${socket.username} connected to session ${socket.sessionId}`);

  // Drawing
  socket.on("draw", (data) => {
    socket.to(socket.sessionId).emit("draw", data);
  });

  // Updating path after stroke completion
  socket.on("path-update", ({ pathHistory, undoHistory }) => {
    socket.to(socket.sessionId).emit("path-update", { pathHistory, undoHistory });
  });

  // Clear whiteboard
  socket.on("clear-whiteboard", () => {
    socket.to(socket.sessionId).emit("clear-whiteboard");
  });

  // Undo
  socket.on("undo", ({ pathHistory, undoHistory }) => {
    socket.to(socket.sessionId).emit("undo", { pathHistory, undoHistory });
  });

  // Redo
  socket.on("redo", ({ pathHistory, undoHistory }) => {
    socket.to(socket.sessionId).emit("redo", { pathHistory, undoHistory });
  });

  // Chat
  socket.on("message", ({ username, message }) => {
    socket.to(socket.sessionId).emit("message", { username, message });
  });

  // Clear chat
  socket.on("clear-chat", () => {
    socket.to(socket.sessionId).emit("clear-chat");
  });

  // Cursor
  socket.on("cursor", ({ x, y, username }) => {
    socket.to(socket.sessionId).emit("cursor", { id: socket.id, x, y, username });
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log(`User ${socket.username} disconnected`);
    socket.to(socket.sessionId).emit("user-disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Whiteboard server running");
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
