import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: {},
  currentChatId: null,
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    createNewChat: (state, action) => {
      const { chatId, title } = action.payload;
      if (!chatId) return;

      if (!state.chats[chatId]) {
        state.chats[chatId] = {
          id: chatId,
          title: title || "New Chat",
          messages: [],
          lastUpdated: new Date().toISOString(),
        };
      }
    },

    addNewMessage: (state, action) => {
      const { chatId, content, role } = action.payload;
      if (!state.chats[chatId]) return;

      state.chats[chatId].messages.push({ content, role });
      state.chats[chatId].lastUpdated = new Date().toISOString();
    },

    addMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      if (!state.chats[chatId] || !Array.isArray(messages)) return;

      state.chats[chatId].messages.push(...messages);
      state.chats[chatId].lastUpdated = new Date().toISOString();
    },

    setChats: (state, action) => {
      state.chats = action.payload || {};
    },

    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },

    deleteChat: (state, action) => {
      const chatId = action.payload;
      if (state.chats[chatId]) {
        delete state.chats[chatId];
        if (state.currentChatId === chatId) state.currentChatId = null;
      }
    },

    clearChats: (state) => {
      state.chats = {};
      state.currentChatId = null;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      if (!action.payload) {
        state.error = null;
        return;
      }

      if (action.payload instanceof Error) {
        state.error = { message: action.payload.message };
      } else if (typeof action.payload === "string") {
        state.error = { message: action.payload };
      } else {
        state.error = action.payload;
      }
    },

    resetChatState: () => initialState,
  },
});

export const {
  setChats,
  setCurrentChatId,
  setLoading,
  setError,
  createNewChat,
  addNewMessage,
  addMessages,
  deleteChat,
  clearChats,
  resetChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
