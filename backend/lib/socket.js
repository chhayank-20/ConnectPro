
import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL], // Frontend URL
    methods: ["POST" ,"GET"],
  },
});
// console.log(process.env.CLIENT_URL);

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

const sendMessageToUser = (receiverId, message) => {
  // console.log(userSocketMap);
  const receiverSocketId = userSocketMap[receiverId];
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("message", message); // Send message to specific user
  } else {
    console.error(`Receiver ${receiverId} not connected`);
  }
};

io.on("connection", (socket) => {
  // console.log("A user connected", socket.id);
  // Retrieve userId from query parameters
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id; // Map userId to socketId
    // console.log(`User ${userId} connected with socketId: ${socket.id}`);
  } else {
    console.error("UserId is missing on connection");
  }
  // Handle incoming messages
  socket.on("msg", (message) => {
    const { receiverId, text } = message;
    if (!receiverId || !text) {
      console.error("Invalid message payload: missing receiverId or text");
      return;
    }else{
    // console.log(`Message from ${userId} to ${receiverId}:`, message);
    try {
      sendMessageToUser(receiverId, { senderId: userId, text }); // Send to the specific receiver
    } catch (error) {
      console.log(error);
    }
  }});
  // Handle disconnection
  socket.on("disconnect", () => {
    // console.log("User disconnected", socket.id);
    if (userId) {
      delete userSocketMap[userId]; // Clean up user socket mapping on disconnect
      // console.log(`User ${userId} disconnected`);
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Notify all users of online status changes
  });
});

export { app, io, server };



