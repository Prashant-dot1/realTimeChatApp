const express = require("express");
const userRoutes  =require("./routes/user");
const messgaeRoutes = require("./routes/message");
const chatRoutes = require("./routes/chat");
const mongoDBconnect = require("./db");
const dotenv = require ("dotenv/config");
const Server = require("socket.io");
const Chat = require("./models/chatModel");
const cors = require("cors");
const app =express();
app.use(express.json());
app.use(cors({}));

// routes
app.use("/",userRoutes);
app.use("/api/message", messgaeRoutes);
app.use("/api/chat" , chatRoutes);
// message retrieval 

// message sending

mongoDBconnect();

const server = app.listen(8000,()=>{
    console.log("Running on port 3000");
});

const io = new Server.Server(server, {
    pingTimeout: 60000,
    cors: {},
  });

  io.on('connection', (socket) => {
    socket.on('setup', (userData) => {
        console.log(userData);
      socket.join(userData.id);
      socket.emit('connected');
    });
    socket.on('join room', (room) => {
      socket.join(room);
      io.emit('joined');
    });
    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));
  
    socket.on('new message', async (newMessageRecieve) => {
      let chat = newMessageRecieve.chatId;
      if (!chat.users) {
        console.log('chats.users is not defined');
        return;
      }

    //   console.log(chat.users);
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieve.sender._id) return;
        socket.in(user._id).emit('message recieved', newMessageRecieve);
      });
    });
  });