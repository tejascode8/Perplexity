import React from "react";
import { useTheme } from "../theme.context";

export const UniversalLoader = ({ text = "Perplexity" }) => {
  const { isDark } = useTheme();

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors duration-200 ${
        isDark ? "bg-[#000000] text-white" : "bg-white text-[#000000]"
      }`}
    >
      <div className="relative flex items-center justify-center">
        <div
          className={`h-16 w-16 animate-spin rounded-full border-2 ${
            isDark
              ? "border-[#404040] border-t-white"
              : "border-[#d6d6d6] border-t-black"
          }`}
        />
        <div className="absolute flex h-7 w-7 items-center justify-center p-1">
          <img
            src="/perplexity-icon.png"
            alt="Perplexity Logo"
            className={`h-full w-full object-contain transition-all duration-200 ${
              isDark ? "filter invert opacity-95" : "filter-none opacity-90"
            }`}
          />
        </div>
      </div>
      <p
        className={`mt-4 font-mono text-xs font-semibold tracking-wider ${
          isDark ? "text-[#a9a9a9]" : "text-[#757575]"
        }`}
      >
        {text || "Perplexity"}
      </p>
    </div>
  );
};
