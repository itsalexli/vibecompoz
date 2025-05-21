// sheet.tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface SheetProps {
  // CHANGED: accept answer prop from parent
  answer: string;
}

export default function Sheet({ answer }: SheetProps) {
  const paper = useRef<HTMLDivElement | null>(null);

  const [abc, setAbc] = useState<string>(
    // initial Mary Had a Little Lamb example (unchanged)
    `X:1
T:Mary Had a Little Lamb
M:4/4
L:1/4
K:C
E D C D | E E E2 |
D D D2 | E G G2 |
E D C D | E E E E |
D D E D | C4 |`
  );

  // initial render (unchanged)
  useEffect(() => {
    import("abcjs").then(({ default: abcjs }) => {
      if (paper.current) {
        abcjs.renderAbc(paper.current, abc, { responsive: "resize" });
      }
    });
  }, []);

  // CHANGED: whenever parent’s `answer` changes, update and re-render
  useEffect(() => {
    if (!answer) return;
    setAbc(answer);
    import("abcjs").then(({ default: abcjs }) => {
      if (paper.current) {
        abcjs.renderAbc(paper.current, answer, { responsive: "resize" });
      }
    });
  }, [answer]);

  return (
    <div className="w-[40rem] h-[32rem] bg-blue-500 rounded-2xl shadow-lg p-3">
      <div
        ref={paper}
        className="bg-white p-4 rounded w-full h-full overflow-auto"
      />
    </div>
  );
}
