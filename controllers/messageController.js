import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        let gotConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!gotConversation) {
            gotConversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        if (newMessage) {
            gotConversation.messages.push(newMessage._id);
        }

        await Promise.all([gotConversation.save(), newMessage.save()]);

        // ✅ SOCKET IO - Send real-time message
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json({ newMessage });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Failed to send message" });
    }
};

export const getMessage = async (req, res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id;


        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages");

        if (!conversation) {
            return res.status(404).json({ message: "No conversation found" });
        }

        return res.status(200).json(conversation.messages || []);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
};

export const deleteMessages = async (req, res) => {
    try {
        const { id } = req.params; // User ID from the request

        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        

        // ✅ Delete all messages where sender or receiver is the selected user
        const result = await Message.deleteMany({
            $or: [{ senderId: id }, { receiverId: id }],
        });

        

        res.status(200).json({ message: "Chat deleted successfully" });
    } catch (error) {
        console.error("Error deleting messages:", error);
        res.status(500).json({ message: "Server error" });
    }
};
