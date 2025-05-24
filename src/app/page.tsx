// page.tsx
"use client";

import { useState } from "react";
import Sheet from "./sheet";
import Chatbot from "./chatbot";
import XmlButton from "./xmlButton";

export default function Home() {
  // CHANGED: lift answer state into Home
  const [latestAnswer, setLatestAnswer] = useState<string>("");

  return (
    <div className="flex flex-row gap-6 p-6">
      {/* CHANGED: pass latestAnswer down to Sheet */}
      <Sheet answer={latestAnswer} />

      {/* CHANGED: pass setter down to Chatbot as onAnswer */}
      <Chatbot onAnswer={setLatestAnswer} />

      <XmlButton />
    </div>
  );
}
