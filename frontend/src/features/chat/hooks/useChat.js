import { initializeSocketConnection } from "../service/chat.socket";
import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat as apiDeleteChat,
} from "../service/chat.api";
import {
  setChats,
  setCurrentChatId,
  setError,
  setLoading,
  createNewChat,
  addNewMessage,
  addMessages,
  deleteChat,
} from "../chat.slice";
import { useDispatch } from "react-redux";

export const useChat = () => {
  const dispatch = useDispatch();

  async function handleSendMessage({ message, chatId }) {
    if (!message) return;

    try {
      dispatch(setLoading(true));

      const data = await sendMessage({ message, chatId });
      const { chat, aiMessage } = data;

      const activeChatId = chatId || chat._id;

      if (!chatId) {
        dispatch(
          createNewChat({
            chatId: chat._id,
            title: chat.title,
          }),
        );
      }

      dispatch(
        addNewMessage({
          chatId: activeChatId,
          content: message,
          role: "user",
        }),
      );

      dispatch(
        addNewMessage({
          chatId: activeChatId,
          content: aiMessage?.content || "",
          role: aiMessage?.role || "assistant",
        }),
      );

      dispatch(setCurrentChatId(activeChatId));
    } catch (error) {
      dispatch(
        setError({
          message: error?.message || String(error),
        }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetChats() {
    try {
      dispatch(setLoading(true));

      const data = await getChats();
      const { chats } = data;

      const formattedChats = chats.reduce((acc, chat) => {
        acc[chat._id] = {
          id: chat._id,
          title: chat.title,
          messages: [],
          lastUpdated: chat.updatedAt,
        };
        return acc;
      }, {});

      dispatch(setChats(formattedChats));
    } catch (error) {
      dispatch(
        setError({
          message: error?.message || String(error),
        }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleOpenChat(chatId, chats) {
    if (!chatId) return;

    try {
      const hasMessages = chats?.[chatId]?.messages?.length > 0;

      if (!hasMessages) {
        dispatch(setLoading(true));

        const data = await getMessages(chatId);
        const { messages } = data;

        const formattedMessages = messages.map((msg) => ({
          content: msg.content,
          role: msg.role,
        }));

        dispatch(
          addMessages({
            chatId,
            messages: formattedMessages,
          }),
        );
      }

      dispatch(setCurrentChatId(chatId));
    } catch (error) {
      dispatch(
        setError({
          message: error?.message || String(error),
        }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleDeleteChat(chatId) {
    if (!chatId) return;

    try {
      dispatch(setLoading(true));

      await apiDeleteChat(chatId);

      dispatch(deleteChat(chatId));

      dispatch(setCurrentChatId(null));
    } catch (error) {
      dispatch(
        setError({
          message: error?.message || "Failed to delete chat",
        }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  function handleStartNewChat() {
    dispatch(setCurrentChatId(null));
    dispatch(setError(null));
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
    handleDeleteChat,
    handleStartNewChat,
  };
};
