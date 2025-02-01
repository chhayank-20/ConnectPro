import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

// Send a message
export const sendMessage = async (req, res) => {
    const { senderId, receiverId, message } = req.body;

    if (!senderId || !receiverId || !message) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Create a new message
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });
        await newMessage.save();

        // Find or create the conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, receiverId],
                messages: [newMessage._id],
            });
            await conversation.save();
        } else {
            conversation.messages.push(newMessage._id);
            await conversation.save();
        }

        return res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};

// Get messages of a conversation
export const getMessages = async (req, res) => {
    const { userId , receiverId } = req.body;
    try {
        const conversation = await Conversation.findOne({
            participants: { $all: [userId, receiverId] } // Assuming you store both user IDs in a 'participants' array field.
          })
          .populate("messages")
          .exec();
          
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found." });
        }
        return res.status(200).json(conversation.messages);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};

export const deleteMessage = async (req, res) => {
    const { messageId } = req.params;

    if (!messageId) {
        return res.status(400).json({ message: "Message ID is required." });
    }

    try {
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: "Message not found." });
        }

        await Message.deleteOne({ _id: messageId });

        return res.status(200).json({ message: "Message deleted successfully." });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while deleting the message.", error: error.message });
    }
};