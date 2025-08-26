"use client";

import React, { useRef, useEffect, useCallback } from "react";

interface ABCEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

// map each note to a hex colour
const noteColors: Record<string, string> = {
  "|": "#56b6c2",
  A: "#98c379",
  B: "#98c379",
  C: "#98c379",
  D: "#98c379",
  E: "#98c379",
  F: "#98c379",
  G: "#98c379",
};

export default function ABCEditor({
  value,
  onChange,
  className = "",
}: ABCEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const syncScroll = useCallback(() => {
    if (textareaRef.current && highlightRef.current) {
      const { scrollTop, scrollLeft } = textareaRef.current;
      highlightRef.current.scrollTop = scrollTop;
      highlightRef.current.scrollLeft = scrollLeft;
    }
  }, []);

  const renderHighlightedContent = useCallback(() => {
    const lines = value.split("\n");

    return lines
      .map((line, lineIndex) => {
        // Only apply highlighting after the 5th line (index 4)
        if (lineIndex >= 5) {
          return line
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .split("")
            .map((char) => {
              const color = noteColors[char as keyof typeof noteColors];
              if (color) {
                return `<span style="color: ${color}; font-weight: bold;">${char}</span>`;
              }
              return char;
            })
            .join("");
        } else {
          // For lines 1-5, just escape HTML entities but don't highlight
          return line
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        }
      })
      .join("\n");
  }, [value]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener("scroll", syncScroll, { passive: true });
      textarea.addEventListener("input", syncScroll, { passive: true });
      return () => {
        textarea.removeEventListener("scroll", syncScroll);
        textarea.removeEventListener("input", syncScroll);
      };
    }
  }, [syncScroll]);

  // Sync scroll on value changes
  useEffect(() => {
    syncScroll();
  }, [value, syncScroll]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[500px] bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl border border-slate-700/50 relative font-mono shadow-2xl overflow-hidden backdrop-blur-sm"
    >
      {/* Highlighted background layer */}
      <div
        ref={highlightRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          padding: "12px",
          margin: 0,
          border: "none",
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
          fontSize: "14px",
          lineHeight: "1.6",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          color: "#ffffff",
        }}
        dangerouslySetInnerHTML={{
          __html: renderHighlightedContent(),
        }}
      />

      {/* Input textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`absolute inset-0 w-full h-full bg-transparent text-transparent caret-indigo-400 resize-none border-none outline-none overflow-auto ${className} placeholder-slate-500`}
        style={{
          padding: "12px",
          margin: 0,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
          fontSize: "14px",
          lineHeight: "1.6",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
        }}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        placeholder="Enter your ABC notation here..."
      />
    </div>
  );
}
