// messageRoutes.js
import express from "express";
import { getMessage, sendMessage, deleteMessages } from "../controllers/messageController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

// ✅ Get messages for a specific user
router.get("/:id", isAuthenticated, getMessage);

// ✅ Send a message
router.post("/send/:id", isAuthenticated, sendMessage);

// ✅ Delete messages for a specific user
router.delete("/:id", isAuthenticated, deleteMessages);

export default router;