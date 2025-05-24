// sheet.tsx
"use client";

import React, { useEffect, useState } from "react";
import type { RefObject } from "react";

interface SheetProps {
  answer?: string;
  /** Ref to the <div> where abcjs will render the SVG */
  exportRef: RefObject<HTMLDivElement | null>;
}

export default function Sheet({ answer, exportRef }: SheetProps) {
  const [abc, setAbc] = useState<string>(
    answer ??
      `X:1
T:Mary Had a Little Lamb
M:4/4
L:1/4
K:C
E D E D | E E E2 |
D D D D | E G G2 |
E D E D | E E E E |
D D E D | C4 |`
  );
  const [ABCJS, setABCJS] = useState<any>(null);

  // 1. Dynamically load abcjs on client
  useEffect(() => {
    import("abcjs").then((mod) => {
      setABCJS((mod as any).default ?? mod);
    });
  }, []);

  // 2. Sync external answer prop
  useEffect(() => {
    if (answer !== undefined) {
      setAbc(answer);
    }
  }, [answer]);

  // 3. Render notation into exportRef.current
  useEffect(() => {
    if (!exportRef.current || !ABCJS) return;
    exportRef.current.innerHTML = "";
    ABCJS.renderAbc(exportRef.current, abc, {
      responsive: "resize",
      scale: 1,
      staffwidth: 800,
      add_classes: true,
    });
  }, [abc, ABCJS, exportRef]);

  return (
    <div className="flex flex-col w-250 bg-neutral-800 text-white mt-10 p-4 rounded-lg border ml-20 border-neutral-700">
      <h2 className="text-xl font-semibold mb-3">🎼 Preview</h2>

      {/* this div is now driven by the parent via exportRef */}
      <div
        ref={exportRef}
        className="w-full h-96 overflow-auto bg-gray-50 text-neutral-800 border border-neutral-700 rounded-2xl p-2"
      />

      <textarea
        className="w-full h-40 mt-4 bg-neutral-800 text-white p-2 rounded-lg border border-neutral-700 focus:outline-none resize-none"
        value={abc}
        onChange={(e) => setAbc(e.target.value)}
      />
    </div>
  );
}
