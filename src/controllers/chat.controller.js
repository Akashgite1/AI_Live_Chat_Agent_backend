import { v4 as uuidv4 } from 'uuid';
import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import ApiResponse from '../utils/ApiResponce.js';
import ApiError from '../utils/ApiError.js';
import {
  generateReply,
  generateSummary,
} from '../services/llm.service.js';


export const sendMessage = async (req, res) => {
  let { message, sessionId } = req.body;

  if (!sessionId) {
    sessionId = uuidv4();
  }

  let conversation = await Conversation.findOne({ sessionId });

  // Create conversation if not exists
  if (!conversation) {
    conversation = await Conversation.create({ sessionId });
  }

  // Save user message
  await Message.create({
    conversationId: conversation._id,
    sender: 'user',
    text: message,
  });

  // Fetch recent messages (last 8)
  const recentMessages = await Message.find({
    conversationId: conversation._id,
  })
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();

  if (recentMessages.length >= 6) {
    const fullHistory = await Message.find({
      conversationId: conversation._id,
    })
      .sort({ createdAt: 1 })
      .lean();

    const newSummary = await generateSummary(fullHistory);

    conversation.summary = newSummary;
    await conversation.save();
  }

  // Generate reply using summary + recent context
  const reply = await generateReply({
    summary: conversation.summary,
    recentMessages: recentMessages.reverse(),
    userMessage: message,
  });

  if (!reply) {
    throw new ApiError(500, 'Failed to generate AI reply');
  }

  // Save AI reply
  await Message.create({
    conversationId: conversation._id,
    sender: 'ai',
    text: reply,
  });

  res.status(200).json(
    new ApiResponse(200, {
      reply,
      sessionId,
    })
  );
};


export const getHistory = async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    throw new ApiError(400, "Session ID is required");
  }

  const conversation = await Conversation.findOne({ sessionId });

  if (!conversation) {
    return res.status(200).json(
      new ApiResponse(200, { messages: [] })
    );
  }

  const messages = await Message.find({
    conversationId: conversation._id,
  })
    .sort({ createdAt: 1 })
    .lean();

  const formattedMessages = messages.map((m) => ({
    role: m.sender === "user" ? "user" : "assistant",
    text: m.text,
  }));

  res.status(200).json(
    new ApiResponse(200, { messages: formattedMessages })
  );
};
