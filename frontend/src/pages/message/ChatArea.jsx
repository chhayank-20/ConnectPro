import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-hot-toast";

const ChatArea = ({ user }) => {
    const [messages, setMessages] = useState([]); // Start with empty array for messages
    const [newMessage, setNewMessage] = useState("");
    const currentUser = useSelector((state) => state.authorizedUser.user); // Assuming user is stored in redux state
    const socketRef = useRef(null); // useRef will hold the socket instance

    // Function to handle incoming messages
    const onMessageReceived = (callback) => {
        if (socketRef.current) {
            socketRef.current.on("message", (message) => {
                // callback(message); // Call the provided callback when a message is received
                getData();
            });
        }
    };

    // Function to send a message
    const sendMessage = async (receiverId, text) => {
        try {
            let msg = { senderId: currentUser._id, receiverId: receiverId, message: text };
            const res = await axiosInstance.post("/messages/send", msg);
        } catch (error) {
            toast.error("Error sending message: " + error.response?.data?.message || error.message);
        }

        if (socketRef.current && socketRef.current.connected) {
            console.log("socketref: ", socketRef);
            const message = {
                receiverId: receiverId, // ID of the recipient
                text: text, // Message content
            };
            console.log("Emitting message: ", message);
            socketRef.current.emit("msg", message); // Emit the message to the server
        } else {
            console.error("Socket is not connected");
        }
        getData();
    };

    // Get conversation messages from the server
    const getData = async () => {
        try {
            let msg = { userId: currentUser._id, receiverId: user._id };
            const res = await axiosInstance.post("/messages/get-conversation-messages", msg);
            console.log(res.data);
            setMessages(res.data);
        } catch (error) {
            console.error("Error fetching messages: " + error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        getData();

        if (!currentUser?._id) return; // If no user ID, don't establish the socket connection

        // Initialize the socket connection only if it's not already established
        if (!socketRef.current || !socketRef.current.connected) {
            // Disconnect the previous socket if any
            if (socketRef.current) {
                socketRef.current.disconnect();
                console.log("Disconnected previous socket.");
            }

            // Create a new socket connection for the current user
            socketRef.current = io("http://localhost:5000", {
                query: { userId: currentUser._id }, // Send user ID with socket connection
            });
            console.log(" socketRef : " , socketRef);

            console.log("New socket connection established");

            // Listen for successful connection
            socketRef.current.on("connect", () => {
                console.log("Socket connected: ", socketRef.current.id);
            });

            // Listen for errors in connection
            socketRef.current.on("connect_error", (err) => {
                console.error("Socket connection error:", err);
            });

            // Listen for connection timeout
            socketRef.current.on("connect_timeout", () => {
                console.error("Socket connection timed out");
            });
        }

        // Handle incoming messages
        const handleMessage = (message) => {
            if (message.receiverId === user._id || message.senderId === user._id) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        text: message.text,
                        time: new Date().toLocaleTimeString(),
                        sender: message.senderId === user._id ? "other" : "me",
                    },
                ]);
            }
        };

        // Listen for messages
        onMessageReceived(handleMessage);

        // Cleanup socket listener on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.off("message", handleMessage);
                socketRef.current.disconnect();
                console.log("Socket disconnected on cleanup");
            }
        };
    }, [currentUser, user]); // Re-run effect when user or currentUser changes

    // Send a new message
    const sendNewMessage = () => {
        // if (newMessage.trim()) {
            sendMessage(user._id, newMessage);
            setNewMessage(""); // Clear input field
        // }
    };

    // Handle Enter key press for sending messages
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            sendNewMessage();
        }
    };

    return (
        <div style={{ height: "80vh" }} className="flex-1 flex flex-col">
            <div className="flex items-center justify-between p-1 border-b border-gray-200 bg-white">
                <div>
                    <h2 className="text-lg font-semibold">
                        CHAT WITH <span className="text-blue-500">{user?.name}</span>
                    </h2>
                    {/* <p className="text-sm text-gray-500">LAST ONLINE: 4 HOURS AGO</p> */}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
                {messages?.map((data) => (
                    <div key={data._id} className={`flex mb-4 ${data.senderId === user._id ? "" : "justify-end"}`}>
                        {/* For messages sent by "me" */}
                        {data.senderId === currentUser._id && (
                            <>
                                <div className="bg-purple-600 text-white p-3 rounded-lg max-w-xs">
                                    {data.message}
                                </div>
                                <img
                                    src={currentUser.profilePicture || "https://placehold.co/40x40"}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full ml-2"
                                />
                            </>
                        )}
                        {/* For messages sent by "other" */}
                        {data.senderId === user._id && (
                            <>
                                <img
                                    src={user.profilePicture || "https://placehold.co/40x40"}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full mr-2"
                                />
                                <div className="bg-gray-300 text-black p-3 rounded-lg max-w-xs">
                                    {data.message}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-gray-200 bg-white flex items-center">
                <input
                    type="text"
                    placeholder="Write your message"
                    className="flex-1 p-2 border border-gray-300 rounded-lg mr-2"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={()=>sendNewMessage()} className="bg-purple-600 text-white p-2 rounded-lg">
                    <i className="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    );
};

export default ChatArea;
