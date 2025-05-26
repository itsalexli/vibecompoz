"use client";

import { useState, useRef, useEffect } from "react";
import Sheet from "./sheet";
import Chatbot from "./chatbot";
import ExportPDFButton from "./ExportPDFButton";
import ABCEditor from "./ABCEditor";

const defaultABC = `X:1
T:Mary Had a Little Lamb
M:4/4
L:1/4
K:C
E D E D | E E E2 |
D D D D | E G G2 |
E D E D | E E E E |
D D E D | C4 |`;

export default function Home() {
  const [latestAnswer, setLatestAnswer] = useState<string>("");
  const [abc, setAbc] = useState<string>(defaultABC);
  const svgContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (latestAnswer && latestAnswer.trim().length > 0) {
      setAbc(latestAnswer);
    }
  }, [latestAnswer]);

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold mb-4 text-white">✏️ ABC Editor</h3>

      <div className="flex flex-row gap-6 items-start">
        {/* Left column: Editor, Chatbot, PDF button */}
        <div className="flex flex-col gap-4 w-full max-w-xl">
          <ABCEditor value={abc} onChange={setAbc} className="w-full" />
          <Chatbot onAnswer={setLatestAnswer} />
        </div>

        {/* Right column: Sheet Preview */}
        <div className="flex-grow">
          <Sheet exportRef={svgContainerRef} abc={abc} />
          <ExportPDFButton
            targetRef={svgContainerRef}
            fileName="abc-score.pdf"
          />
        </div>
      </div>
    </div>
  );
}
