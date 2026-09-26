import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
  tool,
  createAgent,
} from "langchain";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";

// 🔹 Models
const geminiModel = new ChatGoogleGenerativeAI({
  model: process.env.GEMINI_MODEL || "gemini-1.5-flash-latest",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: process.env.MISTRAL_MODEL || "open-mistral-7b",
  apiKey: process.env.MISTRAL_API_KEY,
});

// 🔹 Tool
const searchInternetTool = tool(searchInternet, {
  name: "searchInternet",
  description: "Use this tool to get the latest information from the internet.",
  schema: z.object({
    query: z.string().describe("Search query"),
  }),
});

// 🔹 Agent with Mistral
const agent = createAgent({
  model: mistralModel,
  tools: [searchInternetTool],
});

// 🔹 Message formatter
function formatMessages(messages) {
  return messages
    .map((msg) => {
      if (msg.role === "user") return new HumanMessage(msg.content);
      if (msg.role === "ai") return new AIMessage(msg.content);
      if (msg.role === "system") return new SystemMessage(msg.content);
      return null;
    })
    .filter(Boolean);
}

// 🔹 Generate Response with Multi-Tier Fallback
export async function generateResponse(messages) {
  try {
    // 1. Try primary agent (Mistral + Tavily Web Search)
    const response = await agent.invoke({
      messages: [
        new SystemMessage(`
You are a helpful and precise assistant.
- If unsure, say "I don't know"
- Use "searchInternet" tool for real-time info
        `),
        ...formatMessages(messages),
      ],
    });

    const lastMessage = response.messages?.[response.messages.length - 1];
    return lastMessage?.content || lastMessage?.text || "No response generated.";
  } catch (err) {
    console.warn("Primary agent (Mistral) error, falling back to Gemini:", err.message || err);

    try {
      // 2. Fallback to Gemini
      const fallback = await geminiModel.invoke(formatMessages(messages));
      return fallback?.content || fallback?.text || "No response generated.";
    } catch (geminiErr) {
      console.error("Both Mistral and Gemini failed:", geminiErr.message || geminiErr);

      if (err.message?.includes("429") || geminiErr.message?.includes("429")) {
        return "AI rate limit reached. Please wait a few moments before sending your next request.";
      }

      return "I'm currently experiencing high demand. Please try asking again in a moment.";
    }
  }
}

// 🔹 Generate Chat Title with Fallbacks
export async function generateChatTitle(message) {
  if (!message || typeof message !== "string") {
    return "New Chat";
  }

  // 1. Try Mistral
  try {
    const response = await mistralModel.invoke([
      new SystemMessage(`
You generate short chat titles (3–4 words).
Make them clear and relevant.
DO NOT use any markdown formatting (no asterisks, bold, italics, etc.).
Return only plain text, no extra symbols.
IMPORTANT: The title MUST be exactly 3 to 4 words. Never exceed 4 words.
      `),
      new HumanMessage(`Message: "${message}"`),
    ]);

    let title = response.content || response.text;
    if (title) {
      title = cleanTitle(title, message);
      if (title) return title;
    }
  } catch (mistralErr) {
    console.warn("Mistral title generation failed, trying Gemini:", mistralErr.message || mistralErr);

    // 2. Fallback to Gemini
    try {
      const geminiRes = await geminiModel.invoke([
        new SystemMessage("Generate a 3-4 word title for this prompt. Return ONLY plain text."),
        new HumanMessage(message),
      ]);
      let title = geminiRes.content || geminiRes.text;
      if (title) {
        title = cleanTitle(title, message);
        if (title) return title;
      }
    } catch (geminiErr) {
      console.warn("Gemini title generation failed, using local extraction:", geminiErr.message || geminiErr);
    }
  }

  // 3. Fallback: Extract from user prompt directly (no API call needed)
  return fallbackTitle(message);
}

function cleanTitle(title, originalMessage) {
  let cleaned = title
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/__/g, "")
    .replace(/_/g, "")
    .replace(/~~/g, "")
    .replace(/`/g, "")
    .replace(/#/g, "")
    .replace(/"/g, "")
    .trim();

  cleaned = cleaned.replace(/\s+/g, " ");

  const words = cleaned.split(/\s+/).filter((word) => word.length > 0);
  if (words.length > 4) {
    return words.slice(0, 4).join(" ");
  }
  if (words.length >= 2) {
    return words.join(" ");
  }

  return fallbackTitle(originalMessage);
}

function fallbackTitle(message) {
  const words = message
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 0);

  if (words.length === 0) return "New Chat";
  return words.slice(0, Math.min(4, words.length)).join(" ");
}
