"use client";

import { useEffect, useRef } from "react";
import abcjs from "abcjs";

const abcjsString =
  "M:4/4\nL:1/8\nK:C\nE D C D | E E E2 | D D D2 | E G G2 |\nE D C D | E E E E | D D E D | C2 z2 |";

export default function Sheet() {
  const abcRef = useRef(null);

  useEffect(() => {
    if (abcRef.current) {
      abcjs.renderAbc(abcRef.current, abcjsString, { responsive: "resize" });
    }
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-1/2 h-3/4 bg-blue-500 rounded-2xl shadow-lg p-3 overflow-auto">
        <div
          ref={abcRef}
          className="bg-white p-4 rounded w-full overflow-auto"
        />
      </div>
    </div>
  );
}
