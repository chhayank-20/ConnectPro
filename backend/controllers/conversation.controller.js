import Conversation from "../models/conversation.model.js";

// Get all conversations of a user
export const getConversations = async (req, res) => {
    const { userId } = req.params;

    try {
        // Find conversations where the user is a participant
        const conversations = await Conversation.find({
            participants: userId,
        })
            .populate("participants")
            .populate({
                path: "messages",
                options: { limit: 1, sort: { createdAt: -1 } }, // Only last message
                populate: { path: "senderId", select: "name" }, // Populate sender's name
            })
            .exec();

        return res.status(200).json(conversations);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
