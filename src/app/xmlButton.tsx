// components/XmlButton.tsx
"use client";

import React from "react";
// Adjust this path to wherever your converter lives:
import { convertAbcToMusicXml } from "./convertAbcToMusicXml";

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
      // 1. Convert
      const musicXml = convertAbcToMusicXml(abc);

      // 2. Log for debugging
      console.log(musicXml);

      // 3. Trigger download
      const blob = new Blob([musicXml], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "simple-scale.musicxml";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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
