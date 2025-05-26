import React from "react";

interface ABCEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function ABCEditor({
  value,
  onChange,
  className = "",
}: ABCEditorProps) {
  return (
    <textarea
      className={`w-1/2 h-130 bg-neutral-800 text-white p-2 rounded-lg border border-neutral-700 focus:outline-none resize-none ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter ABC notation here..."
    />
  );
}
