"use client";

import { useEffect, useRef, useState } from "react";

interface SheetProps {
  answer: string;
}

export default function Sheet({ answer }: SheetProps) {
  const paperRef = useRef<HTMLDivElement | null>(null);

  const [abc, setAbc] = useState<string>(
    `
X:1
T:Mary Had a Little Lamb
M:4/4
L:1/4
K:C
E D C D | E E E2 |
D D D2 | E G G2 |
E D C D | E E E E |
D D E D | C4 |
`.trim()
  );

  // render helper with clickListener
  const draw = (str: string) => {
    import("abcjs").then(({ default: abcjs }) => {
      if (!paperRef.current) return;

      abcjs.renderAbc(paperRef.current, str, {
        responsive: "resize",
        clickListener: (_elem, tuneNumber, classes, analysisEvent) => {
          console.log("Clicked note data:", analysisEvent);
        },
      });
    });
  };

  // initial draw
  useEffect(() => {
    draw(abc);
  }, []);

  // update when answer changes
  useEffect(() => {
    if (!answer) return;
    setAbc(answer);
    draw(answer);
  }, [answer]);

  return (
    <div className="w-full max-w-4xl h-[32rem] mx-auto bg-neutral-900 border border-neutral-700 rounded-2xl shadow-lg p-6 overflow-auto">
      <h2 className="text-white text-lg font-semibold mb-4">
        🎼 Sheet Preview
      </h2>
      <div
        ref={paperRef}
        className="bg-white p-4 rounded-lg w-full shadow-inner border border-neutral-300 mb-8"
      />
    </div>
  );
}
