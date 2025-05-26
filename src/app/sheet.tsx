"use client";

import React, { useEffect, useRef } from "react";
import type { RefObject } from "react";
import ABCJS from "abcjs";
// Audio control styles
import "abcjs/abcjs-audio.css";

interface SheetProps {
  abc: string;
  /** Ref to the <div> where abcjs will render the SVG */
  exportRef: RefObject<HTMLDivElement | null>;
}

const defaultABC = `X:1
T:Mary Had a Little Lamb
M:4/4
L:1/4
K:C
E D E D | E E E2 |
D D D D | E G G2 |
E D E D | E E E E |
D D E D | C4 |`;

export default function Sheet({ abc, exportRef }: SheetProps) {
  const controlsRef = useRef<HTMLDivElement | null>(null);

  // Render notation & initialize audio controls
  useEffect(() => {
    if (!exportRef.current) return;

    // Render ABC notation
    exportRef.current.innerHTML = "";
    const visualObj = ABCJS.renderAbc(exportRef.current, abc, {
      responsive: "resize",
      scale: 1,
      staffwidth: 800,
      add_classes: true,
    })[0];

    // Initialize audio synth controls
    if (controlsRef.current && ABCJS.synth && ABCJS.synth.SynthController) {
      const synthControl = new ABCJS.synth.SynthController();
      synthControl.load(controlsRef.current, /* cursorControl= */ null, {
        displayPlay: true,
        displayProgress: true,
        displayRestart: true,
        displayWarp: false,
      });
      synthControl.setTune(visualObj, true);
    }
  }, [abc, exportRef]);

  return (
    <div className="flex flex-col w-250 bg-neutral-800 text-white p-4 rounded-lg border m-0 border-neutral-700">
      <h2 className="text-xl font-semibold mb-3">🎼 Preview</h2>

      {/* notation canvas - fixed height with scroll */}
      <div className="w-full h-92 bg-gray-50 border border-neutral-700 rounded-2xl overflow-auto">
        <div
          className="w-full h-full overflow-auto p-2 text-neutral-800"
          ref={exportRef}
        />
      </div>

      {/* audio controls */}
      <div
        ref={controlsRef}
        className="w-full flex items-center justify-start mt-4"
      />
    </div>
  );
}
