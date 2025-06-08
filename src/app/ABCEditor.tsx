import React from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-markup.js";
import "prismjs/themes/prism-tomorrow.css";

interface ABCEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

// Changed: define a tiny “abc” language that highlights letters A–G
Prism.languages.abc = Prism.languages.extend("markup", {});
Prism.languages.insertBefore("abc", "punctuation", {
  note: {
    pattern: /\b[ABCDEFG]\b/g,
    alias: "keyword", // uses Prism’s `.token.keyword` styling
  },
});

// Changed: highlight fn used by react-simple-code-editor
function highlight(code: string): string {
  return Prism.highlight(code, Prism.languages.abc, "abc");
}

export default function ABCEditor({
  value,
  onChange,
  className = "",
}: ABCEditorProps) {
  return (
    // Changed: swapped <textarea> for <Editor>, wired up highlight & onValueChange
    <Editor
      value={value}
      onValueChange={onChange} // Changed: different prop name
      highlight={highlight} // Added: our Prism-based highlighter
      padding={10} // Added: internal padding prop
      textareaId="abc-editor" // Optional: for testing or styling
      className={`
        w-1/2 h-130 bg-neutral-800 text-white p-2 rounded-lg
        border border-neutral-700 focus:outline-none overflow-auto
        ${className}           // Changed: added monospaced font
      `}
    />
  );
}
