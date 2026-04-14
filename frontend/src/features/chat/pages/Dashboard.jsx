import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import { disconnectSocket } from "../service/chat.socket";

const Dashboard = () => {
  const chat = useChat();
  const [chatInput, setChatInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const isLoading = useSelector((state) => state.chat.isLoading);
  const error = useSelector((state) => state.chat.error);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    chat.initializeSocketConnection();
    chat.handleGetChats();

    return () => disconnectSocket();
  }, [chat]);

  const handleSubmitMessage = (event) => {
    event.preventDefault();
    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) return;

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId });
    setChatInput("");
  };

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats);
    setSidebarOpen(false);
  };

  const handleDelete = async (chatId) => {
    if (!chatId) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this chat?",
    );
    if (!confirmDelete) return;

    await chat.handleDeleteChat(chatId);
    if (chatId === currentChatId) setChatInput("");
  };

  const handleNewChat = () => {
    chat.handleStartNewChat();
    setChatInput("");
  };

  return (
    <main className="min-h-screen w-full bg-[#000000] p-3 text-white md:p-5">
      {error && (
        <div className="mx-auto mb-4 max-w-6xl rounded-xl bg-red-900/30 border border-red-700 p-4 text-red-200">
          <div className="flex items-center justify-between">
            <span className="font-medium">
              Error: {error.message || String(error)}
            </span>
            <button
              onClick={() => {}}
              className="text-red-300 hover:text-white"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white"></div>
        </div>
      )}

      <section className="mx-auto flex h-[calc(100vh-1.5rem)] w-full gap-4 rounded-3xl border p-1 md:h-[calc(100vh-2.5rem)] md:gap-6 md:p-1 border-none">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`${
            sidebarOpen ? "flex" : "hidden"
          } md:flex fixed md:relative z-50 h-full w-72 shrink-0 rounded-3xl  bg-[#292929] p-4 flex-col`}
        >
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-3xl font-semibold tracking-tight">
              Perplexity
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden rounded-lg border border-white/30 bg-white/10 p-2 text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="mb-4 w-full rounded-xl  cursor-pointer bg-[#ffffff] px-3 py-2 text-left text-base font-medium text-black transition  hover:bg-white/90"
          >
            + New Chat
          </button>

          <div className="space-y-2">
            {Object.values(chats).map((chatItem) => (
              <div
                key={chatItem.id}
                className="flex items-center justify-between"
              >
                <button
                  onClick={() => openChat(chatItem.id)}
                  type="button"
                  className="w-full cursor-pointer rounded-xl  bg-[#000000] px-3 py-2 text-left text-base font-medium text-white transition hover:bg-black/50 "
                >
                  {chatItem.title}
                </button>
                <button
                  onClick={() => handleDelete(chatItem.id)}
                  className="ml-2 text-2xl cursor-pointer text-white hover:text-red-600"
                  title="Delete Chat"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat Area */}
        <section className="relative max-w-[60%] mx-auto flex h-full min-w-0 flex-1 flex-col gap-4">
          <div className="md:hidden flex items-center justify-between mb-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-white/30 bg-white/10 p-2 text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h2 className="text-xl font-semibold">Chat</h2>
            <div className="w-10" />
          </div>

          <div className="messages flex-1 space-y-3 overflow-y-auto pr-1 pb-[30px]">
            {(chats[currentChatId]?.messages ?? []).length > 0 ? (
              (chats[currentChatId]?.messages ?? []).map((message, index) => (
                <div
                  key={index}
                  className={`max-w-[82%] w-fit rounded-2xl px-4 py-3 text-sm md:text-base ${
                    message.role === "user"
                      ? "ml-auto rounded-br-none bg-[#303030] text-white"
                      : "mr-auto border-none text-white"
                  }`}
                >
                  {message.role === "user" ? (
                    <p>{message.content}</p>
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="mb-2 list-disc pl-5">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="mb-2 list-decimal pl-5">{children}</ol>
                        ),
                        code: ({ children }) => (
                          <code className="rounded px-1 py-0.5">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="mb-2 overflow-x-auto rounded-xl bg-neutral-900 p-3">
                            {children}
                          </pre>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                </div>
              ))
            ) : (
              <div className="flex h-full items-center justify-center text-white/40">
                <p>No messages yet. Start a conversation!</p>
              </div>
            )}
          </div>

          <footer className="rounded-2xl w-full absolute bottom-2  bg-transparent  p-4 md:p-1">
            <form
              onSubmit={handleSubmitMessage}
              className="flex flex-col gap-3 md:flex-row"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Type your message..."
                className="w-full rounded-2xl  bg-[#303030] px-4 py-3 text-lg text-white outline-none transition placeholder:text-white/30 focus:border-white/90"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="rounded-2xl bg-[#303030] px-6 py-3 cursor-pointer text-lg font-semibold text-white transition hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </footer>
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
