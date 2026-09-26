import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Authentication required",
        success: false,
      });
    }

    const { message, chat: chatId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message content cannot be empty",
        success: false,
      });
    }

    let title = null;
    let chat = null;

    if (!chatId) {
      try {
        title = await generateChatTitle(message);
      } catch (err) {
        console.warn("Title generation failed, using default:", err);
        title = "New Chat";
      }

      chat = await chatModel.create({
        user: req.user.id,
        title: title || "New Chat",
      });
    }

    const currentChatId = chatId || chat._id;

    await messageModel.create({
      chat: currentChatId,
      content: message,
      role: "user",
    });

    const messages = await messageModel
      .find({ chat: currentChatId })
      .sort({ createdAt: 1 });

    const result = await generateResponse(messages);

    const aiMessage = await messageModel.create({
      chat: currentChatId,
      content: result,
      role: "ai",
    });

    res.status(201).json({
      title,
      chat,
      aiMessage,
    });
  } catch (err) {
    console.error("Error in sendMessage controller:", err);
    res.status(500).json({
      message: err.message || "Failed to process message",
      success: false,
    });
  }
}

export async function getChats(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Authentication required",
        success: false,
      });
    }

    const chats = await chatModel.find({
      user: req.user.id,
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      message: "Chats retrieved successfully",
      chats,
    });
  } catch (err) {
    console.error("Error in getChats:", err);
    res.status(500).json({
      message: "Failed to retrieve chats",
      success: false,
    });
  }
}

export async function getMessages(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Authentication required",
        success: false,
      });
    }

    const { chatId } = req.params;

    const chat = await chatModel.findOne({
      _id: chatId,
      user: req.user.id,
    });

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    const messages = await messageModel
      .find({ chat: chatId })
      .sort({ createdAt: 1 });

    res.status(200).json({
      messages,
    });
  } catch (err) {
    console.error("Error in getMessages:", err);
    res.status(500).json({
      message: "Failed to retrieve messages",
      success: false,
    });
  }
}

export async function deleteChat(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Authentication required",
        success: false,
      });
    }

    const { chatId } = req.params;

    const chat = await chatModel.findOneAndDelete({
      _id: chatId,
      user: req.user.id,
    });

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    await messageModel.deleteMany({
      chat: chatId,
    });

    res.status(200).json({
      message: "Chat deleted successfully",
    });
  } catch (err) {
    console.error("Error in deleteChat:", err);
    res.status(500).json({
      message: "Failed to delete chat",
      success: false,
    });
  }
}
