import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  timeout: 60000, // 60s timeout for complex AI web searches
});

// Interceptor to handle timeouts by automatically reloading the page
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isTimeout =
      error.code === "ECONNABORTED" ||
      error.message?.toLowerCase().includes("timeout") ||
      error.message?.toLowerCase().includes("exceeded");

    if (isTimeout) {
      console.warn("Timeout exceeded. Reloading page...");
      window.location.reload();
      return Promise.reject(error);
    }

    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export const sendMessage = async ({ message, chatId }) => {
  try {
    const payload = { message, chat: chatId };
    if (chatId) payload.chat = chatId;

    const response = await api.post("/api/chats/message", payload);
    return response.data;
  } catch (error) {
    const isTimeout =
      error.code === "ECONNABORTED" ||
      error.message?.toLowerCase().includes("timeout") ||
      error.message?.toLowerCase().includes("exceeded");

    if (isTimeout) {
      window.location.reload();
    }

    throw {
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to send message",
    };
  }
};

export const getChats = async () => {
  try {
    const response = await api.get("/api/chats");
    return response.data;
  } catch (error) {
    const isTimeout =
      error.code === "ECONNABORTED" ||
      error.message?.toLowerCase().includes("timeout") ||
      error.message?.toLowerCase().includes("exceeded");

    if (isTimeout) {
      window.location.reload();
    }

    throw error.response?.data || "Failed to fetch chats";
  }
};

export const getMessages = async (chatId) => {
  if (!chatId) throw new Error("chatId is required");

  try {
    const response = await api.get(`/api/chats/${chatId}/messages`);
    return response.data;
  } catch (error) {
    const isTimeout =
      error.code === "ECONNABORTED" ||
      error.message?.toLowerCase().includes("timeout") ||
      error.message?.toLowerCase().includes("exceeded");

    if (isTimeout) {
      window.location.reload();
    }

    throw error.response?.data || "Failed to fetch messages";
  }
};

export const deleteChat = async (chatId) => {
  if (!chatId) throw new Error("chatId is required");

  try {
    const response = await api.delete(`/api/chats/${chatId}`);
    return response.data;
  } catch (error) {
    const isTimeout =
      error.code === "ECONNABORTED" ||
      error.message?.toLowerCase().includes("timeout") ||
      error.message?.toLowerCase().includes("exceeded");

    if (isTimeout) {
      window.location.reload();
    }

    throw error.response?.data || "Failed to delete chat";
  }
};
