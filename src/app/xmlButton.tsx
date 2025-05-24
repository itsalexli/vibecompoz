// components/XmlButton.tsx
"use client";

import React from "react";

const abc = `
X:1
T:Simple Scale
M:4/4
L:1/4
K:C
C D E F | G A B c |
`;

export default function XmlButton() {
  const handleClick = () => {
    try {
    } catch (err) {
      console.error("Conversion error:", err);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
    >
      Convert & Download
    </button>
  );
}
