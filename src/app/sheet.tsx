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

    // Force SVG elements to be black
    const svgElement = exportRef.current.querySelector("svg");
    if (svgElement) {
      // Make text elements black (fill only)
      const textElements = svgElement.querySelectorAll("text");
      textElements.forEach((element) => {
        (element as SVGElement).style.fill = "#000000";
        (element as SVGElement).style.stroke = "none";
      });

      // Make line elements black (stroke only)
      const lineElements = svgElement.querySelectorAll("line, path[stroke]");
      lineElements.forEach((element) => {
        (element as SVGElement).style.stroke = "#000000";
        (element as SVGElement).style.fill = "none";
      });

      // Make filled shapes black (fill only)
      const filledElements = svgElement.querySelectorAll(
        "path:not([stroke]), circle, rect"
      );
      filledElements.forEach((element) => {
        (element as SVGElement).style.fill = "#000000";
        (element as SVGElement).style.stroke = "none";
      });
    }

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
    <div className="flex flex-col w-250 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-xl border border-slate-700/50 m-0 shadow-2xl backdrop-blur-sm">
      <h2 className="text-xl font-bold mb-4 tracking-tight">🎼 Preview</h2>

      {/* notation canvas - fixed height with scroll */}
      <div className="w-full h-125 bg-white border border-slate-600/50 rounded-xl overflow-auto shadow-inner">
        <div className="w-full h-full overflow-auto p-4" ref={exportRef} />
      </div>

      {/* audio controls */}
      <div
        ref={controlsRef}
        className="w-full flex items-center justify-start mt-4"
      />
    </div>
  );
}
