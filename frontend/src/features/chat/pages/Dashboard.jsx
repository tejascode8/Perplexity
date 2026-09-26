import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import { useAuth } from "../../auth/hook/useAuth";
import { disconnectSocket } from "../service/chat.socket";
import { CodeBlock } from "../components/CodeBlock";
import { useTheme } from "../../../app/theme.context";
import { ThemeToggle } from "../../../app/components/ThemeToggle";
import { UniversalLoader } from "../../../app/components/UniversalLoader";

// Suggested Prompts (Zero emojis, Vector SVG icons)
const SUGGESTED_PROMPTS = [
  {
    title: "Quantum Computing Foundations",
    subtitle: "Core principles of qubits, superposition, and quantum gates",
    prompt: "Explain quantum computing in simple terms, including qubits and superposition.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <circle cx="12" cy="12" r="3" />
        <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(30 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-30 12 12)" />
      </svg>
    ),
  },
  {
    title: "Frontier AI & LLM Breakthroughs",
    subtitle: "Recent advancements in multi-agent systems and reasoning models",
    prompt: "What are the latest breakthroughs and developments in artificial intelligence this year?",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    title: "React Performance Hook",
    subtitle: "Custom debounce and throttle implementation with cleanup",
    prompt: "Write a high-performance custom React hook for debouncing search input in TypeScript/JavaScript.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: "Architecture: Next.js vs Vite",
    subtitle: "Production tradeoffs, SSR capabilities, and bundling benchmarks",
    prompt: "Compare Next.js vs Vite + React for production web applications.",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
];

const Dashboard = () => {
  const { isDark } = useTheme();
  const chat = useChat();
  const auth = useAuth();
  const user = useSelector((state) => state.auth.user);
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const isLoading = useSelector((state) => state.chat.isLoading);
  const error = useSelector((state) => state.chat.error);

  const [isPageReady, setIsPageReady] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [copiedMessageIndex, setCopiedMessageIndex] = useState(null);

  const initializedRef = useRef(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    chat.initializeSocketConnection();
    chat.handleGetChats().finally(() => {
      setIsPageReady(true);
    });

    return () => disconnectSocket();
  }, [chat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, currentChatId, isLoading]);

  if (!isPageReady) {
    return <UniversalLoader text="Perplexity" />;
  }

  const handleSubmitMessage = (event) => {
    if (event) event.preventDefault();
    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage || isLoading) return;

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId });
    setChatInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitMessage();
    }
  };

  const handlePromptClick = (promptText) => {
    chat.handleSendMessage({ message: promptText, chatId: currentChatId });
  };

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats);
    setSidebarOpen(false);
  };

  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;
    await chat.handleDeleteChat(chatToDelete);
    if (chatToDelete === currentChatId) {
      setChatInput("");
    }
    setChatToDelete(null);
  };

  const handleNewChat = () => {
    chat.handleStartNewChat();
    setChatInput("");
    setSidebarOpen(false);
    inputRef.current?.focus();
  };

  const copyMessageContent = async (content, index) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageIndex(index);
      setTimeout(() => setCopiedMessageIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy message:", err);
    }
  };

  const currentMessages = currentChatId ? (chats[currentChatId]?.messages ?? []) : [];

  // Filter chats by search query
  const chatList = Object.values(chats || {}).filter((item) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden font-sans transition-colors duration-200 ${
        isDark ? "bg-[#000000] text-white" : "bg-white text-[#000000]"
      }`}
    >
      {/* Delete Confirmation Modal */}
      {chatToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in">
          <div
            className={`w-full max-w-sm rounded-2xl border p-6 shadow-2xl transition-colors duration-200 ${
              isDark ? "border-[#404040] bg-[#1d1d1b]" : "border-[#d6d6d6] bg-white"
            }`}
          >
            <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-[#000000]"}`}>
              Delete chats?
            </h3>
            <p className={`mt-2 text-xs leading-relaxed ${isDark ? "text-[#a9a9a9]" : "text-[#404040]"}`}>
              This will permanently remove this conversation and its search history.
            </p>
            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setChatToDelete(null)}
                className={`rounded-xl border px-4 py-2 text-xs font-medium transition ${
                  isDark
                    ? "border-[#404040] text-[#d6d6d6] hover:bg-[#404040] hover:text-white"
                    : "border-[#d6d6d6] text-[#404040] hover:bg-[#d6d6d6] hover:text-black"
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteChat}
                className={`rounded-xl px-4 py-2 text-xs font-semibold shadow-lg transition ${
                  isDark
                    ? "bg-white text-black hover:bg-[#d6d6d6]"
                    : "bg-black text-white hover:bg-[#404040]"
                }`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in">
          <div
            className={`w-full max-w-sm rounded-2xl border p-6 shadow-2xl transition-colors duration-200 ${
              isDark ? "border-[#404040] bg-[#1d1d1b]" : "border-[#d6d6d6] bg-white"
            }`}
          >
            <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-[#000000]"}`}>
              Sign out of Perplexity?
            </h3>
            <p className={`mt-2 text-xs leading-relaxed ${isDark ? "text-[#a9a9a9]" : "text-[#404040]"}`}>
              Are you sure you want to sign out? You will need to log in again to access your account and search history.
            </p>
            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className={`rounded-xl border px-4 py-2 text-xs font-medium transition ${
                  isDark
                    ? "border-[#404040] text-[#d6d6d6] hover:bg-[#404040] hover:text-white"
                    : "border-[#d6d6d6] text-[#404040] hover:bg-[#d6d6d6] hover:text-black"
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  auth.handleLogout();
                }}
                className={`rounded-xl px-4 py-2 text-xs font-semibold shadow-lg transition ${
                  isDark
                    ? "bg-white text-black hover:bg-[#d6d6d6]"
                    : "bg-black text-white hover:bg-[#404040]"
                }`}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Information & Architecture Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md animate-fade-in">
          <div
            className={`relative flex flex-col w-full max-w-xl max-h-[88vh] rounded-3xl border shadow-2xl overflow-hidden transition-colors duration-200 ${
              isDark ? "border-[#404040] bg-[#1d1d1b]" : "border-[#d6d6d6] bg-white"
            }`}
          >
            {/* Fixed Modal Header */}
            <div
              className={`flex items-center justify-between px-6 py-5 border-b shrink-0 ${
                isDark ? "border-[#404040] bg-[#1d1d1b]" : "border-[#d6d6d6] bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src="/perplexity-icon.png"
                  alt="Perplexity Logo"
                  className={`h-7 w-7 object-contain ${
                    isDark ? "filter invert opacity-95" : "filter-none opacity-90"
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-base sm:text-lg font-bold tracking-tight ${isDark ? "text-white" : "text-[#000000]"}`}>
                      Perplexity AI
                    </h3>
                  </div>
                  <p className={`text-[11px] font-mono ${isDark ? "text-[#a9a9a9]" : "text-[#404040]"}`}>
                    Conversational Search & Intelligence Platform
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className={`rounded-xl p-1.5 transition ${
                  isDark ? "text-[#a9a9a9] hover:bg-[#404040] hover:text-white" : "text-[#404040] hover:bg-[#d6d6d6] hover:text-black"
                }`}
                title="Close"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className={`flex-1 overflow-y-auto custom-scrollbar px-6 py-5 space-y-6 text-xs sm:text-sm ${isDark ? "text-[#d6d6d6]" : "text-[#1d1d1b]"}`}>
              {/* About the Platform & Horizontal Slider Scroller */}
              <div
                className={`rounded-2xl border p-4 sm:p-5 ${
                  isDark ? "border-[#404040] bg-[#000000]/60" : "border-[#d6d6d6] bg-[#d6d6d6]/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`text-xs font-mono uppercase tracking-wider font-bold ${isDark ? "text-[#a9a9a9]" : "text-[#000000]"}`}>
                    About the Platform
                  </h4>
                  <span className={`text-[10px] font-mono hidden sm:inline-block ${isDark ? "text-[#808081]" : "text-[#757575]"}`}>
                    Swipe or scroll horizontally
                  </span>
                </div>

                <p className={`leading-relaxed text-xs sm:text-sm mb-4 ${isDark ? "text-[#d6d6d6]" : "text-[#1d1d1b]"}`}>
                  <strong className={isDark ? "text-white" : "text-[#000000]"}>Perplexity AI</strong> is an advanced conversational search platform designed to deliver instant, cited, and comprehensive answers to complex questions by bridging live internet search with frontier Large Language Models.
                </p>

                {/* Horizontal Feature Slider Scroller */}
                <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-3 pt-1 snap-x snap-mandatory">
                  {/* Slide 1 */}
                  <div
                    className={`min-w-[210px] max-w-[210px] sm:min-w-[230px] sm:max-w-[230px] shrink-0 rounded-xl border p-3.5 snap-start shadow-sm transition ${
                      isDark
                        ? "border-[#404040] bg-[#1d1d1b] hover:border-[#757575]"
                        : "border-[#d6d6d6] bg-white hover:border-[#000000]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-mono font-bold ${
                        isDark ? "bg-[#404040] text-white" : "bg-[#d6d6d6] text-[#000000]"
                      }`}>
                        01
                      </span>
                      <h5 className={`font-semibold text-xs ${isDark ? "text-white" : "text-[#000000]"}`}>
                        Live Web Search
                      </h5>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isDark ? "text-[#a9a9a9]" : "text-[#404040]"}`}>
                      Indexes real-time internet information to provide answers without knowledge cutoff constraints.
                    </p>
                  </div>

                  {/* Slide 2 */}
                  <div
                    className={`min-w-[210px] max-w-[210px] sm:min-w-[230px] sm:max-w-[230px] shrink-0 rounded-xl border p-3.5 snap-start shadow-sm transition ${
                      isDark
                        ? "border-[#404040] bg-[#1d1d1b] hover:border-[#757575]"
                        : "border-[#d6d6d6] bg-white hover:border-[#000000]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-mono font-bold ${
                        isDark ? "bg-[#404040] text-white" : "bg-[#d6d6d6] text-[#000000]"
                      }`}>
                        02
                      </span>
                      <h5 className={`font-semibold text-xs ${isDark ? "text-white" : "text-[#000000]"}`}>
                        Multi-LLM Synthesis
                      </h5>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isDark ? "text-[#a9a9a9]" : "text-[#404040]"}`}>
                      Combines Mistral Medium reasoning with high-speed Google Gemini failover protection.
                    </p>
                  </div>

                  {/* Slide 3 */}
                  <div
                    className={`min-w-[210px] max-w-[210px] sm:min-w-[230px] sm:max-w-[230px] shrink-0 rounded-xl border p-3.5 snap-start shadow-sm transition ${
                      isDark
                        ? "border-[#404040] bg-[#1d1d1b] hover:border-[#757575]"
                        : "border-[#d6d6d6] bg-white hover:border-[#000000]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-mono font-bold ${
                        isDark ? "bg-[#404040] text-white" : "bg-[#d6d6d6] text-[#000000]"
                      }`}>
                        03
                      </span>
                      <h5 className={`font-semibold text-xs ${isDark ? "text-white" : "text-[#000000]"}`}>
                        Syntax Highlighting
                      </h5>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isDark ? "text-[#a9a9a9]" : "text-[#404040]"}`}>
                      Renders multi-language code snippets with dark glass styling and one-click clipboard copying.
                    </p>
                  </div>

                  {/* Slide 4 */}
                  <div
                    className={`min-w-[210px] max-w-[210px] sm:min-w-[230px] sm:max-w-[230px] shrink-0 rounded-xl border p-3.5 snap-start shadow-sm transition ${
                      isDark
                        ? "border-[#404040] bg-[#1d1d1b] hover:border-[#757575]"
                        : "border-[#d6d6d6] bg-white hover:border-[#000000]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-mono font-bold ${
                        isDark ? "bg-[#404040] text-white" : "bg-[#d6d6d6] text-[#000000]"
                      }`}>
                        04
                      </span>
                      <h5 className={`font-semibold text-xs ${isDark ? "text-white" : "text-[#000000]"}`}>
                        Real-Time Streams
                      </h5>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isDark ? "text-[#a9a9a9]" : "text-[#404040]"}`}>
                      WebSocket connectivity delivers low-latency responses directly to your active viewport.
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Models & Intelligence Stack */}
              <div>
                <h4 className={`text-xs font-mono uppercase tracking-wider font-bold mb-3 ${isDark ? "text-[#a9a9a9]" : "text-[#000000]"}`}>
                  AI Models & Architecture
                </h4>
                <div className="space-y-2.5">
                  {/* Mistral AI */}
                  <div
                    className={`rounded-xl border p-3.5 ${
                      isDark ? "border-[#404040] bg-[#000000]/60" : "border-[#d6d6d6] bg-white shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${isDark ? "bg-white" : "bg-black"}`}></span>
                        <span className={`font-semibold text-xs ${isDark ? "text-white" : "text-[#000000]"}`}>
                          Mistral Medium
                        </span>
                      </div>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-mono border font-bold ${
                          isDark ? "bg-[#404040] text-white border-[#404040]" : "bg-[#d6d6d6] text-[#000000] border-[#d6d6d6]"
                        }`}
                      >
                        Primary LLM
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isDark ? "text-[#a9a9a9]" : "text-[#404040]"}`}>
                      Drives conversational comprehension, multi-step logical reasoning, code generation, and automated chats titling.
                    </p>
                  </div>

                  {/* Google Gemini */}
                  <div
                    className={`rounded-xl border p-3.5 ${
                      isDark ? "border-[#404040] bg-[#000000]/60" : "border-[#d6d6d6] bg-white shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${isDark ? "bg-[#808081]" : "bg-[#757575]"}`}></span>
                        <span className={`font-semibold text-xs ${isDark ? "text-white" : "text-[#000000]"}`}>
                          Google Gemini 1.5 Flash
                        </span>
                      </div>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-mono border font-bold ${
                          isDark ? "bg-[#404040] text-white border-[#404040]" : "bg-[#d6d6d6] text-[#000000] border-[#d6d6d6]"
                        }`}
                      >
                        High-Speed Fallback
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isDark ? "text-[#a9a9a9]" : "text-[#404040]"}`}>
                      Provides automatic failover routing during upstream provider rate limits to ensure 100% platform availability.
                    </p>
                  </div>

                  {/* Tavily Search */}
                  <div
                    className={`rounded-xl border p-3.5 ${
                      isDark ? "border-[#404040] bg-[#000000]/60" : "border-[#d6d6d6] bg-white shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${isDark ? "bg-[#808081]" : "bg-[#757575]"}`}></span>
                        <span className={`font-semibold text-xs ${isDark ? "text-white" : "text-[#000000]"}`}>
                          Tavily Search Engine
                        </span>
                      </div>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-mono border font-bold ${
                          isDark ? "bg-[#404040] text-white border-[#404040]" : "bg-[#d6d6d6] text-[#000000] border-[#d6d6d6]"
                        }`}
                      >
                        Live Web Grounding
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isDark ? "text-[#a9a9a9]" : "text-[#404040]"}`}>
                      Indexes and crawls real-time web documentation, news, and technical resources to eliminate outdated information cutoffs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Core Platform Capabilities */}
              <div>
                <h4 className={`text-xs font-mono uppercase tracking-wider font-bold mb-2.5 ${isDark ? "text-[#a9a9a9]" : "text-[#000000]"}`}>
                  Core Capabilities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div
                    className={`flex items-center gap-2.5 rounded-xl border p-2.5 ${
                      isDark ? "border-[#404040] bg-[#000000]/60 text-[#d6d6d6]" : "border-[#d6d6d6] bg-white text-[#1d1d1b] shadow-sm"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isDark ? "bg-white" : "bg-black"}`}></span>
                    <span className="text-[11px] font-medium">Real-Time Web Search & Citations</span>
                  </div>
                  <div
                    className={`flex items-center gap-2.5 rounded-xl border p-2.5 ${
                      isDark ? "border-[#404040] bg-[#000000]/60 text-[#d6d6d6]" : "border-[#d6d6d6] bg-white text-[#1d1d1b] shadow-sm"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isDark ? "bg-white" : "bg-black"}`}></span>
                    <span className="text-[11px] font-medium">Syntax-Highlighted Code Blocks</span>
                  </div>
                  <div
                    className={`flex items-center gap-2.5 rounded-xl border p-2.5 ${
                      isDark ? "border-[#404040] bg-[#000000]/60 text-[#d6d6d6]" : "border-[#d6d6d6] bg-white text-[#1d1d1b] shadow-sm"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isDark ? "bg-white" : "bg-black"}`}></span>
                    <span className="text-[11px] font-medium">Multi-Turn Conversational Memory</span>
                  </div>
                  <div
                    className={`flex items-center gap-2.5 rounded-xl border p-2.5 ${
                      isDark ? "border-[#404040] bg-[#000000]/60 text-[#d6d6d6]" : "border-[#d6d6d6] bg-white text-[#1d1d1b] shadow-sm"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isDark ? "bg-white" : "bg-black"}`}></span>
                    <span className="text-[11px] font-medium">Secure JWT Session Authentication</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Modal Footer */}
            <div
              className={`px-6 py-4 border-t flex items-center justify-between shrink-0 ${
                isDark ? "border-[#404040] bg-[#1d1d1b]" : "border-[#d6d6d6] bg-white"
              }`}
            >
              <div className={`text-[11px] font-mono ${isDark ? "text-[#808081]" : "text-[#757575]"}`}>
                Pure Monochrome Intelligence
              </div>
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className={`rounded-xl px-5 py-2 text-xs font-semibold shadow-md transition ${
                  isDark ? "bg-white text-black hover:bg-[#d6d6d6]" : "bg-black text-white hover:bg-[#404040]"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:relative z-40 flex h-full w-72 shrink-0 flex-col justify-between border-r transition-all duration-300 ease-in-out ${
          isDark
            ? "border-[#404040] bg-[#1d1d1b] text-white"
            : "border-[#d6d6d6] bg-white text-[#000000] shadow-sm"
        } ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Top Header & Actions */}
        <div className="flex flex-col p-4">
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <img
                src="/perplexity-icon.png"
                alt="Perplexity Logo"
                className={`h-5 w-5 object-contain ${
                  isDark ? "filter invert opacity-95" : "filter-none opacity-90"
                }`}
              />
              <span className={`text-lg font-bold tracking-tight ${isDark ? "text-white" : "text-[#000000]"}`}>
                Perplexity
              </span>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className={`md:hidden rounded-lg p-1.5 transition ${
                isDark ? "text-[#a9a9a9] hover:bg-[#404040] hover:text-white" : "text-[#404040] hover:bg-[#d6d6d6] hover:text-black"
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className={`group mt-2 flex items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold border transition-all ${
              isDark
                ? "bg-[#000000] text-white border-[#404040] hover:bg-white hover:text-black hover:border-white"
                : "bg-black text-white border-black hover:bg-[#404040] hover:border-[#404040]"
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Chat</span>
            </div>
          </button>

          {/* Search History */}
          {Object.keys(chats || {}).length > 2 && (
            <div className="mt-3 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats..."
                className={`w-full rounded-lg border px-3 py-1.5 pl-8 text-xs outline-none transition ${
                  isDark
                    ? "bg-[#000000] border-[#404040] text-white placeholder-[#757575] focus:border-white"
                    : "bg-white border-[#d6d6d6] text-[#000000] placeholder-[#808081] focus:border-[#000000]"
                }`}
              />
              <svg
                className={`absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${
                  isDark ? "text-[#757575]" : "text-[#757575]"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Chat chats List with Dedicated Custom Scrollbar */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2 space-y-1">
          {/* Increased text size and high contrast for Recent Chats Header */}
          <div className={`flex items-center justify-between px-2 pb-2 text-xs sm:text-[13px] font-mono uppercase tracking-wider font-bold ${
            isDark ? "text-[#d6d6d6]" : "text-[#000000]"
          }`}>
            <span>Recent Chats</span>
            {chatList.length > 0 && (
              <span className={`px-2 py-0.5 text-xs font-mono font-bold rounded-full border ${
                isDark ? "bg-[#404040] text-white border-[#404040]" : "bg-[#d6d6d6] text-[#000000] border-[#d6d6d6]"
              }`}>
                {chatList.length}
              </span>
            )}
          </div>

          {chatList.length > 0 ? (
            chatList.map((chatItem) => {
              const isActive = chatItem.id === currentChatId;
              const displayTitle = chatItem.title || "Untitled chats";
              return (
                <div
                  key={chatItem.id}
                  className={`group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm transition-all ${
                    isActive
                      ? isDark
                        ? "bg-[#404040]/50 text-white font-semibold border border-[#404040] shadow-sm"
                        : "bg-[#d6d6d6] text-[#000000] font-bold border border-[#d6d6d6] shadow-sm"
                      : isDark
                      ? "text-[#d6d6d6] hover:bg-[#404040]/30 hover:text-white font-medium"
                      : "text-[#1d1d1b] hover:bg-[#d6d6d6]/60 hover:text-black font-medium"
                  }`}
                >
                  <button
                    onClick={() => openChat(chatItem.id)}
                    type="button"
                    title={displayTitle}
                    className="flex flex-1 items-center gap-2.5 text-left truncate overflow-hidden pr-1"
                  >
                    <svg
                      className={`h-4 w-4 shrink-0 ${
                        isActive
                          ? isDark ? "text-white" : "text-[#000000]"
                          : isDark ? "text-[#808081] group-hover:text-white" : "text-[#404040] group-hover:text-black"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.75}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span className="truncate text-[13.5px] leading-snug">{displayTitle}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setChatToDelete(chatItem.id);
                    }}
                    className={`opacity-0 group-hover:opacity-100 rounded-md p-1 transition shrink-0 ${
                      isDark ? "text-[#a9a9a9] hover:bg-[#404040] hover:text-white" : "text-[#404040] hover:bg-[#d6d6d6] hover:text-black"
                    }`}
                    title="Delete chats"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
            })
          ) : (
            <div className={`px-3 py-6 text-center text-xs ${isDark ? "text-[#757575]" : "text-[#757575]"}`}>
              {searchQuery ? "No matching chats" : "No chats yet"}
            </div>
          )}
        </div>

        {/* User Account Section at Sidebar Bottom */}
        <div className={`border-t p-3 ${isDark ? "border-[#404040] bg-[#1d1d1b]" : "border-[#d6d6d6] bg-white"}`}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-sm ${
                isDark ? "bg-white text-black" : "bg-black text-white"
              }`}>
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="text-left overflow-hidden">
                <p className={`truncate text-sm font-semibold leading-tight ${isDark ? "text-white" : "text-[#000000]"}`}>
                  {user?.username || "User"}
                </p>
                <p className={`truncate text-[11px] font-mono leading-tight ${isDark ? "text-[#a9a9a9]" : "text-[#757575]"}`}>
                  {user?.email || "Authenticated"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className={`rounded-lg border p-2 transition shrink-0 ${
                isDark
                  ? "border-[#404040] bg-[#000000] text-[#d6d6d6] hover:bg-[#404040] hover:text-white"
                  : "border-[#d6d6d6] bg-white text-[#404040] hover:bg-[#d6d6d6] hover:text-black"
              }`}
              title="Sign Out"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content & Chat Space */}
      <main className={`relative flex flex-1 flex-col h-full overflow-hidden transition-colors duration-200 ${
        isDark ? "bg-[#000000]" : "bg-white"
      }`}>
        {/* Top Header Bar */}
        <header
          className={`flex h-14 shrink-0 items-center justify-between border-b px-4 md:px-6 transition-colors duration-200 ${
            isDark ? "border-[#404040] bg-[#000000]" : "border-[#d6d6d6] bg-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`md:hidden rounded-lg p-1.5 transition ${
                isDark ? "text-[#d6d6d6] hover:bg-[#404040] hover:text-white" : "text-[#1d1d1b] hover:bg-[#d6d6d6] hover:text-black"
              }`}
              title="Open sidebar"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Top Navbar Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Information "i" Button */}
            <button
              type="button"
              onClick={() => setShowInfoModal(true)}
              className={`flex h-8 w-8 items-center justify-center rounded-xl border transition ${
                isDark
                  ? "border-[#404040] bg-[#1d1d1b] text-[#d6d6d6] hover:bg-[#404040] hover:text-white"
                  : "border-[#d6d6d6] bg-white text-[#1d1d1b] hover:bg-[#d6d6d6] hover:text-black"
              }`}
              title="About Perplexity & AI Models"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Global Error Banner with Refresh Action */}
        {error && (
          <div
            className={`mx-4 mt-3 flex items-center justify-between rounded-xl border p-3 text-xs animate-fade-in shadow-lg ${
              isDark ? "border-[#404040] bg-[#1d1d1b] text-[#d6d6d6]" : "border-[#d6d6d6] bg-white text-[#1d1d1b]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <svg className={`h-4 w-4 shrink-0 ${isDark ? "text-[#a9a9a9]" : "text-[#757575]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error.message || String(error)}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition ${
                  isDark
                    ? "border-[#404040] bg-[#000000] text-white hover:bg-[#404040]"
                    : "border-[#d6d6d6] bg-white text-[#000000] hover:bg-[#d6d6d6]"
                }`}
              >
                Reload
              </button>
              <button
                type="button"
                onClick={() => chat.handleStartNewChat()}
                className={`rounded-lg p-1 transition ${
                  isDark ? "text-[#a9a9a9] hover:text-white" : "text-[#757575] hover:text-black"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Chat Feed Area */}
        <div className="messages flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="mx-auto max-w-3xl space-y-6 pb-28">
            {currentMessages.length > 0 ? (
              currentMessages.map((message, index) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={index}
                    className={`flex flex-col animate-fade-in ${
                      isUser ? "items-end" : "items-start"
                    }`}
                  >
                    {isUser ? (
                      /* User Bubble */
                      <div className="flex max-w-[85%] items-start gap-3">
                        <div
                          className={`rounded-2xl border px-5 py-3.5 text-sm md:text-base shadow-sm ${
                            isDark
                              ? "bg-[#1d1d1b] border-[#404040] text-white"
                              : "bg-[#d6d6d6]/30 border-[#d6d6d6] text-[#000000]"
                          }`}
                        >
                          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        </div>
                      </div>
                    ) : (
                      /* AI Response Container */
                      <div
                        className={`w-full rounded-2xl border p-5 md:p-6 shadow-sm transition-colors ${
                          isDark
                            ? "border-[#404040] bg-[#1d1d1b] text-white"
                            : "border-[#d6d6d6] bg-white text-[#000000]"
                        }`}
                      >
                        {/* Header with Perplexity badge */}
                        <div className={`mb-4 flex items-center justify-between border-b pb-3 ${
                          isDark ? "border-[#404040]" : "border-[#d6d6d6]"
                        }`}>
                          <div className="flex items-center gap-2">
                            <img
                              src="/perplexity-icon.png"
                              alt="Perplexity"
                              className={`h-4 w-4 object-contain ${
                                isDark ? "filter invert opacity-95" : "filter-none opacity-90"
                              }`}
                            />
                            <span className={`text-xs font-semibold tracking-wide ${isDark ? "text-white" : "text-[#000000]"}`}>
                              Perplexity AI
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => copyMessageContent(message.content, index)}
                            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition ${
                              isDark
                                ? "border-[#404040] bg-[#000000] text-[#a9a9a9] hover:bg-[#404040] hover:text-white"
                                : "border-[#d6d6d6] bg-white text-[#404040] hover:bg-[#d6d6d6] hover:text-black"
                            }`}
                            title="Copy answer"
                          >
                            {copiedMessageIndex === index ? (
                              <>
                                <svg className={`h-3.5 w-3.5 ${isDark ? "text-white" : "text-black"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className={`font-medium ${isDark ? "text-white" : "text-black"}`}>Copied</span>
                              </>
                            ) : (
                              <>
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Markdown Output */}
                        <div className={`prose max-w-none text-sm md:text-[15px] leading-relaxed ${
                          isDark ? "text-white" : "text-[#000000]"
                        }`}>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => (
                                <p className="mb-3 leading-relaxed last:mb-0">{children}</p>
                              ),
                              h1: ({ children }) => (
                                <h1 className={`mt-5 mb-3 text-xl font-bold tracking-tight border-b pb-1 ${
                                  isDark ? "text-white border-[#404040]" : "text-[#000000] border-[#d6d6d6]"
                                }`}>{children}</h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className={`mt-4 mb-2 text-lg font-bold ${isDark ? "text-white" : "text-[#000000]"}`}>{children}</h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className={`mt-3 mb-2 text-base font-semibold ${isDark ? "text-[#d6d6d6]" : "text-[#1d1d1b]"}`}>{children}</h3>
                              ),
                              ul: ({ children }) => (
                                <ul className={`my-3 list-disc space-y-1 pl-5 ${isDark ? "text-[#d6d6d6]" : "text-[#1d1d1b]"}`}>{children}</ul>
                              ),
                              ol: ({ children }) => (
                                <ol className={`my-3 list-decimal space-y-1 pl-5 ${isDark ? "text-[#d6d6d6]" : "text-[#1d1d1b]"}`}>{children}</ol>
                              ),
                              li: ({ children }) => (
                                <li className="leading-relaxed">{children}</li>
                              ),
                              blockquote: ({ children }) => (
                                <blockquote className={`my-3 border-l-2 pl-4 italic py-1 rounded-r-lg ${
                                  isDark ? "border-white text-[#d6d6d6] bg-[#000000]/60" : "border-black text-[#1d1d1b] bg-[#d6d6d6]/20"
                                }`}>
                                  {children}
                                </blockquote>
                              ),
                              table: ({ children }) => (
                                <div className={`my-4 overflow-x-auto rounded-xl border ${
                                  isDark ? "border-[#404040]" : "border-[#d6d6d6]"
                                }`}>
                                  <table className={`min-w-full divide-y text-left text-xs md:text-sm ${
                                    isDark ? "divide-[#404040]" : "divide-[#d6d6d6]"
                                  }`}>
                                    {children}
                                  </table>
                                </div>
                              ),
                              thead: ({ children }) => (
                                <thead className={`font-semibold ${isDark ? "bg-[#000000] text-white" : "bg-[#d6d6d6]/30 text-[#000000]"}`}>{children}</thead>
                              ),
                              th: ({ children }) => (
                                <th className="px-4 py-2.5 font-medium">{children}</th>
                              ),
                              td: ({ children }) => (
                                <td className={`px-4 py-2 border-t ${
                                  isDark ? "border-[#404040] text-[#d6d6d6]" : "border-[#d6d6d6] text-[#1d1d1b]"
                                }`}>{children}</td>
                              ),
                              code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || "");
                                if (!inline && (match || String(children).includes("\n"))) {
                                  return (
                                    <CodeBlock language={match ? match[1] : ""}>
                                      {String(children).replace(/\n$/, "")}
                                    </CodeBlock>
                                  );
                                }
                                return (
                                  <code
                                    className={`rounded px-1.5 py-0.5 font-mono text-xs border ${
                                      isDark
                                        ? "bg-[#000000] text-white border-[#404040]"
                                        : "bg-[#d6d6d6]/40 text-[#000000] border-[#d6d6d6]"
                                    }`}
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                );
                              },
                              a: ({ href, children }) => (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`underline underline-offset-2 transition ${
                                    isDark ? "text-white hover:text-[#d6d6d6]" : "text-[#000000] hover:text-[#404040] font-medium"
                                  }`}
                                >
                                  {children}
                                </a>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              /* Hero Empty State */
              <div className="flex flex-col items-center justify-center pt-8 md:pt-16 text-center animate-fade-in">
                <h1 className={`text-3xl md:text-5xl font-bold tracking-tight mb-3 ${
                  isDark ? "text-white" : "text-[#000000]"
                }`}>
                  Where knowledge begins
                </h1>
                <p className={`max-w-lg text-sm md:text-base mb-8 leading-relaxed ${
                  isDark ? "text-[#a9a9a9]" : "text-[#404040]"
                }`}>
                  Ask anything to query the live web, synthesize answers with AI, and explore deep research.
                </p>

                {/* Suggested Prompt Cards */}
                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                  {SUGGESTED_PROMPTS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePromptClick(item.prompt)}
                      className={`group flex flex-col items-start rounded-2xl border p-4 text-left transition-all duration-200 active:scale-[0.99] ${
                        isDark
                          ? "border-[#404040] bg-[#1d1d1b] hover:border-white hover:bg-[#000000]"
                          : "border-[#d6d6d6] bg-white hover:border-[#000000] hover:bg-[#d6d6d6]/10 shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-lg border transition ${
                          isDark
                            ? "bg-[#000000] border-[#404040] text-[#d6d6d6] group-hover:text-white"
                            : "bg-[#d6d6d6]/30 border-[#d6d6d6] text-[#1d1d1b] group-hover:text-black"
                        }`}>
                          {item.icon}
                        </div>
                        <span className={`font-semibold text-xs md:text-sm transition ${
                          isDark ? "text-[#d6d6d6] group-hover:text-white" : "text-[#1d1d1b] group-hover:text-black font-semibold"
                        }`}>
                          {item.title}
                        </span>
                      </div>
                      <p className={`text-xs leading-normal pl-9 ${
                        isDark ? "text-[#a9a9a9]" : "text-[#404040]"
                      }`}>
                        {item.subtitle}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Streaming / Thinking Placeholder */}
            {isLoading && (
              <div className={`flex flex-col items-start w-full rounded-2xl border p-5 shadow-lg animate-fade-in ${
                isDark ? "border-[#404040] bg-[#1d1d1b]" : "border-[#d6d6d6] bg-white shadow-sm"
              }`}>
                <div className="flex items-center gap-3">
                  <img
                    src="/perplexity-icon.png"
                    alt="Perplexity"
                    className={`h-5 w-5 object-contain animate-pulse ${
                      isDark ? "filter invert opacity-95" : "filter-none opacity-90"
                    }`}
                  />
                  <div className="flex flex-col">
                    <span className={`text-xs font-semibold ${isDark ? "text-white" : "text-[#000000]"}`}>
                      Searching web & synthesizing answer...
                    </span>
                    <span className={`text-[10px] font-mono ${isDark ? "text-[#a9a9a9]" : "text-[#757575]"}`}>
                      Processing live information
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 w-full">
                  <div className={`h-3 w-3/4 rounded animate-pulse ${isDark ? "bg-[#404040]" : "bg-[#d6d6d6]"}`}></div>
                  <div className={`h-3 w-1/2 rounded animate-pulse ${isDark ? "bg-[#404040]/50" : "bg-[#d6d6d6]/50"}`}></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Floating Input Dock */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 md:p-6 transition-all ${
          isDark
            ? "bg-gradient-to-t from-[#000000] via-[#000000]/95 to-transparent"
            : "bg-gradient-to-t from-white via-white/95 to-transparent"
        }`}>
          <div className="mx-auto max-w-3xl">
            <form
              onSubmit={handleSubmitMessage}
              className={`relative flex flex-col rounded-2xl border shadow-xl transition-all ${
                isDark
                  ? "border-[#404040] bg-[#1d1d1b] focus-within:border-white"
                  : "border-[#d6d6d6] bg-white focus-within:border-black"
              }`}
            >
              <textarea
                ref={inputRef}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                data-gramm="false"
                data-gramm_editor="false"
                data-enable-grammarly="false"
                spellCheck={false}
                placeholder="Ask anything or search the web..."
                className={`w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-sm md:text-base outline-none max-h-36 min-h-[48px] ${
                  isDark ? "text-white placeholder-[#757575]" : "text-[#000000] placeholder-[#808081]"
                }`}
              />

              <div className={`flex items-center justify-between border-t px-3 py-2 ${
                isDark ? "border-[#404040]" : "border-[#d6d6d6]"
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-medium ${
                    isDark
                      ? "border-[#404040] bg-[#000000] text-[#d6d6d6]"
                      : "border-[#d6d6d6] bg-[#d6d6d6]/30 text-[#1d1d1b]"
                  }`}>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="1.75" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                    </svg>
                    <span>Internet Search</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`hidden sm:inline text-[11px] font-mono ${
                    isDark ? "text-[#808081]" : "text-[#757575]"
                  }`}>
                    Enter to send
                  </span>
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isLoading}
                    className={`flex h-8 w-8 items-center justify-center rounded-xl shadow-md transition disabled:cursor-not-allowed disabled:opacity-30 ${
                      isDark
                        ? "bg-white text-black hover:bg-[#d6d6d6]"
                        : "bg-black text-white hover:bg-[#404040]"
                    }`}
                    title="Send message"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </button>
                </div>
              </div>
            </form>

            <p className={`mt-2 text-center text-[11px] font-mono ${
              isDark ? "text-[#757575]" : "text-[#757575]"
            }`}>
              Perplexity AI &bull; Verify important facts
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
