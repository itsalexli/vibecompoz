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
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <h1 className="text-3xl font-bold mb-6 tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
        ✏️ ABC Notation Editor
      </h1>

      <div className="flex flex-row gap-6 items-start">
        {/* Left column: Editor + Chatbot */}
        <div className="flex flex-col gap-4 w-full max-w-xl">
          <ABCEditor value={abc} onChange={setAbc} className="w-full" />
          <Chatbot onAnswer={setLatestAnswer} />
        </div>

        {/* Right column: Sheet + Centered PDF Button */}
        <div className="flex-grow">
          <Sheet exportRef={svgContainerRef} abc={abc} />
          <div className="flex justify-center mt-4">
            <ExportPDFButton
              targetRef={svgContainerRef}
              fileName="abc-score.pdf"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
