const socket = io();
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const noofUsers = document.getElementById("noofusers");

const name = prompt("What is your name?");
appendMessage("You joined");
socket.emit("new-user", name);

socket.on("chat-message", (data) => {
  appendMessage(`${data.name}: ${data.message}`);
});

socket.on("user-connected", (val) => {
  appendMessage(`${val.name} connected`);
  noofUsers.innerHTML = val.len;
});

socket.on("user-disconnected", (val) => {
  console.log(val);
  appendMessage(`${val.name} disconnected`);
  noofUsers.innerHTML = val.len;
});

socket.on("online-user", (val) => {
  noofUsers.innerHTML = val;
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`You: ${message}`);
  socket.emit("send-chat-message", message);
  messageInput.value = "";
});

function appendMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}
