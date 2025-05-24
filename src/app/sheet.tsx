"use client";

import { useEffect, useRef, useState } from "react";

export default function Sheet({ answer }: { answer?: string }) {
  const paperRef = useRef<HTMLDivElement | null>(null);
  const [abc, setAbc] = useState<string>(
    answer ||
      `X:1
T:Mary Had a Little Lamb
M:4/4
L:1/4
K:C
E D C D | E E E2 |
D D D D | E G G2 |
E D C D | E E E E |
D D E D | C4 |`
  );
  const [ABCJS, setABCJS] = useState<any>(null);

  // Load abcjs library on client
  useEffect(() => {
    import("abcjs").then((mod) => {
      const lib = (mod as any).default ?? mod;
      setABCJS(lib);
    });
  }, []);

  // Render on abc or library load
  useEffect(() => {
    if (!paperRef.current || !ABCJS) return;
    paperRef.current.innerHTML = "";
    ABCJS.renderAbc(paperRef.current, abc, {
      responsive: "resize",
      add_classes: true,
      scale: 1.8, // increase size of notation
      clickListener: (_el: any, tuneNum: any, classes: any, analysis: any) => {
        console.log("Clicked note:", analysis);
      },
    });
  }, [abc, ABCJS]);

  // Sync external answer prop
  useEffect(() => {
    if (answer) setAbc(answer);
  }, [answer]);

  return (
    <div className="flex flex-col bg-neutral-800 text-white p-4 rounded-lg border border-neutral-700">
      <h2 className="text-xl font-semibold mb-3">🎼 ABC Quick Editor</h2>

      {/* enlarged notation panel */}
      <div className="w-220 h-96 overflow-auto bg-black border border-neutral-700 rounded-2xl p-2">
        <div ref={paperRef} />
      </div>

      {/* editor textarea */}
      <textarea
        className="w-full h-40 mt-4 bg-neutral-800 text-white p-2 rounded-lg border border-neutral-700 focus:outline-none"
        value={abc}
        onChange={(e) => setAbc(e.target.value)}
      />
    </div>
  );
}
