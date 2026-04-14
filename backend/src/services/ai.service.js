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
  model: "gemini-1.5-flash", // more stable than "flash-latest"
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-medium-latest",
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

// 🔹 Agent
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

// 🔹 Generate Response
export async function generateResponse(messages) {
  try {
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

    // ✅ safer extraction
    const lastMessage = response.messages?.[response.messages.length - 1];

    return lastMessage?.content || lastMessage?.text || "No response.";
  } catch (err) {
    console.error("Agent error:", err);

    // 🔹 fallback to Gemini (good practice)
    const fallback = await geminiModel.invoke(formatMessages(messages));
    return fallback.content;
  }
}

// 🔹 Generate Chat Title
export async function generateChatTitle(message) {
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

  // Clean any markdown formatting that might still appear
  if (title) {
    // Remove asterisks, underscores, extra spaces
    title = title
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/__/g, "")
      .replace(/_/g, "")
      .replace(/~~/g, "")
      .replace(/`/g, "")
      .replace(/#/g, "")
      .trim();
    // Collapse multiple spaces
    title = title.replace(/\s+/g, " ");
    // Ensure title is not empty
    if (!title) title = "New Chat";

    // Enforce 3-4 word limit
    const words = title.split(/\s+/).filter((word) => word.length > 0);
    if (words.length > 4) {
      // Take first 4 words for meaningful title
      title = words.slice(0, 4).join(" ");
    } else if (words.length < 3) {
      // If less than 3 words, add context from message
      const messageWords = message
        .split(/\s+/)
        .filter((word) => word.length > 0);
      const needed = 3 - words.length;
      if (needed > 0 && messageWords.length > 0) {
        const additionalWords = messageWords.slice(
          0,
          Math.min(needed, messageWords.length),
        );
        title = words.concat(additionalWords).join(" ");
      }
    }
  }

  return title;
}
