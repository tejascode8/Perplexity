import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
  const { message, chat: chatId } = req.body;

  let title = null;
  let chat = null;

  if (!chatId) {
    title = await generateChatTitle(message);
    chat = await chatModel.create({
      user: req.user.id,
      title,
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
}

export async function getChats(req, res) {
  const chats = await chatModel.find({
    user: req.user.id,
  });

  res.status(200).json({
    message: "Chats retrieved successfully",
    chats,
  });
}

export async function getMessages(req, res) {
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
}

export async function deleteChat(req, res) {
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
}
