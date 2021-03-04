const express = require("express");
const app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

const PORT = process.env.PORT || 3000;

const users = {};
let len = 0;
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

io.on("connection", (socket) => {
  io.to(socket.id).emit("online-user", len + 1);
  socket.on("new-user", (name) => {
    users[socket.id] = name;
    len++;
    console.log(len);
    socket.broadcast.emit("user-connected", { name, len });
  });
  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("disconnect", () => {
    len--;
    console.log(len);
    socket.broadcast.emit("user-disconnected", { name: users[socket.id], len });
    delete users[socket.id];
  });
});

server.listen(PORT, () => {
  console.log("http://localhost:3000");
});
