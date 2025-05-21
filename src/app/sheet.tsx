"use client";

import { useEffect, useRef, useState } from "react";

export default function Sheet() {
  const paper = useRef<HTMLDivElement | null>(null);

  const [abc, setAbc] = useState<string>(`X:1
T:Mary Had a Little Lamb
M:4/4
L:1/4
K:C
E D C D | E E E2 |
D D D2 | E G G2 |
E D C D | E E E E |
D D E D | C4 |`);

  useEffect(() => {
    // load abcjs only in the browser
    import("abcjs").then(({ default: abcjs }) => {
      if (paper.current) {
        abcjs.renderAbc(paper.current, abc, { responsive: "resize" });
      }
    });
  }, []);

  return (
    <div className="w-[40rem] h-[32rem] bg-blue-500 rounded-2xl shadow-lg p-3">
      <div ref={paper} className="bg-white p-4 rounded w-full overflow-auto" />
    </div>
  );
}
