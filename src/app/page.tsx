// page.tsx
"use client";

import { useState, useRef } from "react";
import Sheet from "./sheet";
import Chatbot from "./chatbot";
import ExportPDFButton from "./ExportPDFButton"; // same as before

export default function Home() {
  const [latestAnswer, setLatestAnswer] = useState<string>("");
  // This ref now points at the div in Sheet where abcjs renders
  const svgContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-row gap-6">
        <Sheet exportRef={svgContainerRef} answer={latestAnswer} />

        <div>
          <Chatbot onAnswer={setLatestAnswer} />
          <ExportPDFButton
            targetRef={svgContainerRef}
            fileName="abc-score.pdf"
          />
        </div>
      </div>
    </div>
  );
}
