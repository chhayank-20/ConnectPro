// import { io } from "socket.io-client";

// const SOCKET_URL = "http://localhost:5000"; // Replace with your server URL
// let value = localStorage.getItem('logedinUser');
// value = JSON.parse(value);
// const logedinUser = '6789299b38964b0876e828e6'

// logedinUser = value.user._id || "6789299b38964b0876e828e6";
// // Wait until user data is fetched before connecting the socket
// const socket = io(SOCKET_URL, {
//   query: {
//     userId: logedinUser || "6789299b38964b0876e828e6" , // Pass the userId when connecting
//   },
// });

// socket.on("connect", () => {
//   console.log("Socket connected with id:", socket.id);
// });

// export const sendMessage = (receiverId, text) => {
//   if (logedinUser) {
//     const message = {
//       receiverId, // ID of the recipient
//       text, // Message content
//     };
//     socket.emit("message", message); // Emit the message to the server
//   } else {
//     console.error("User is not logged in");
//   }
// };

// export const onMessageReceived = (callback) => {
//   socket.on("message", (message) => {
//     callback(message); // Call the provided callback when a message is received
//   });
// };

// export default socket;

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux"; // Assuming you use Redux to store user state

const useSocket = () => {

  const [socket, setSocket] = useState("6789299b38964b0876e828e6");
  const user = useSelector((state) => state.authorizedUser.user); // Assuming user is stored in redux state

  useEffect(() => {
    if (user?._id) {
      // Initialize socket only if user ID is available
      const newSocket = io("http://localhost:5000", {
        query: { userId: user._id }, // Send user ID with socket connection
      });

      setSocket(newSocket); 

      // Handle socket connection
      newSocket.on("connect", () => {
        console.log("Socket connected with id:", newSocket.id);
      });

      // Clean up when the component unmounts or user changes
      return () => {
        if (newSocket) newSocket.disconnect();
      };
    }
  }, [user?.id]); // Re-run when user ID changes

  return socket;

};

// const socket = useSocket();
export const onMessageReceived = (callback) => {
    socket.on("message", (message) => {
      callback(message); // Call the provided callback when a message is received
    });
  };

  export const sendMessage = (receiverId, text) => {
      if (logedinUser) {
        const message = {
          receiverId, // ID of the recipient
          text, // Message content
        };
        socket.emit("message", message); // Emit the message to the server
      } else {
        console.error("User is not logged in");
      }
    };

export default useSocket;






