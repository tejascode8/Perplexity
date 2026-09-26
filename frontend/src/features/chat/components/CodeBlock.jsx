import React, { useState } from "react";
import { useTheme } from "../../../app/theme.context";

export const CodeBlock = ({ language, value, children }) => {
  const [copied, setCopied] = useState(false);
  const { isDark } = useTheme();

  // Extract raw text if children is passed
  const codeContent =
    value || (typeof children === "string" ? children : String(children || ""));

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      className={`relative my-4 overflow-hidden rounded-xl border shadow-lg transition-colors duration-200 ${
        isDark
          ? "border-white/10 bg-[#09090b]"
          : "border-zinc-200 bg-white shadow-zinc-200/50"
      }`}
    >
      {/* Code Header Bar */}
      <div
        className={`flex items-center justify-between border-b px-4 py-2 text-xs font-mono transition-colors duration-200 ${
          isDark
            ? "border-white/10 bg-[#121216] text-zinc-400"
            : "border-zinc-200 bg-zinc-100 text-zinc-600"
        }`}
      >
        <span
          className={`font-semibold lowercase tracking-wide ${
            isDark ? "text-zinc-300" : "text-zinc-800"
          }`}
        >
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition ${
            isDark
              ? "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
              : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-200 hover:text-black"
          }`}
          title="Copy code"
        >
          {copied ? (
            <>
              <svg
                className={`h-3.5 w-3.5 ${
                  isDark ? "text-white" : "text-black"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span
                className={`font-medium ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                Copied
              </span>
            </>
          ) : (
            <>
              <svg
                className={`h-3.5 w-3.5 ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre
        className={`overflow-x-auto p-4 font-mono text-sm leading-relaxed ${
          isDark ? "text-zinc-200" : "text-zinc-900"
        }`}
      >
        <code>{children || codeContent}</code>
      </pre>
    </div>
  );
};

