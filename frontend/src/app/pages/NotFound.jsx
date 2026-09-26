import React from "react";
import { Link } from "react-router";
import { useTheme } from "../theme.context";
import { ThemeToggle } from "../components/ThemeToggle";

const NotFound = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-center px-4 text-center transition-colors duration-200 overflow-hidden ${
        isDark ? "bg-[#000000] text-white" : "bg-white text-[#000000]"
      }`}
    >
      {/* Floating Theme Toggle in Top Right */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      <div
        className={`relative z-10 max-w-md mx-auto flex flex-col items-center rounded-3xl p-10 shadow-xl transition-colors duration-200 border ${
          isDark
            ? "border-[#404040] bg-[#1d1d1b]"
            : "border-[#d6d6d6] bg-white shadow-sm"
        }`}
      >
        <img
          src="/perplexity-icon.png"
          alt="Perplexity Logo"
          className={`mb-4 h-10 w-10 object-contain transition-all duration-200 ${
            isDark ? "filter invert opacity-95" : "filter-none opacity-90"
          }`}
        />

        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono mb-6 font-bold ${
            isDark
              ? "border-[#404040] bg-[#000000] text-[#d6d6d6]"
              : "border-[#d6d6d6] bg-[#d6d6d6]/30 text-[#000000]"
          }`}
        >
          <span>Error 404</span>
        </div>

        <h1
          className={`text-6xl font-extrabold tracking-tight mb-2 font-mono ${
            isDark ? "text-white" : "text-[#000000]"
          }`}
        >
          404
        </h1>

        <h2
          className={`text-xl font-bold mb-3 ${
            isDark ? "text-white" : "text-[#000000]"
          }`}
        >
          Page Not Found
        </h2>

        <p
          className={`text-sm leading-relaxed mb-8 ${
            isDark ? "text-[#a9a9a9]" : "text-[#404040]"
          }`}
        >
          The requested page does not exist or has been relocated.
        </p>

        <Link
          to="/"
          className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-md transition-all active:scale-[0.98] ${
            isDark
              ? "bg-white text-black hover:bg-[#d6d6d6]"
              : "bg-black text-white hover:bg-[#404040]"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Return to Dashboard
        </Link>
      </div>

      <div
        className={`absolute bottom-6 text-xs font-mono ${
          isDark ? "text-[#757575]" : "text-[#757575]"
        }`}
      >
        Perplexity AI &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default NotFound;
