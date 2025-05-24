// components/ExportPDFButton.tsx
"use client";

import React from "react";
import { jsPDF } from "jspdf";

interface ExportPDFButtonProps {
  /** Pass in a ref whose current may be null */
  targetRef: React.RefObject<HTMLDivElement | null>;
  fileName?: string;
}

export default function ExportPDFButton({
  targetRef,
  fileName = "abc-score.pdf",
}: ExportPDFButtonProps) {
  const handleExport = () => {
    const svgContainer = targetRef.current;
    if (!svgContainer) return;
    const svgElem = svgContainer.querySelector("svg");
    if (!svgElem) return;

    // capture on-screen size
    const { width: origW, height: origH } = svgElem.getBoundingClientRect();

    // serialize SVG → blob URL
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgElem);
    const blob = new Blob([svgStr], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const scale = 3;
      const canvas = document.createElement("canvas");
      canvas.width = origW * scale;
      canvas.height = origH * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: origW > origH ? "landscape" : "portrait",
        unit: "px",
        format: [origW, origH],
      });
      pdf.addImage(imgData, "PNG", 0, 0, origW, origH);
      pdf.save(fileName);
    };
    img.src = url;
  };

  return (
    <button
      onClick={handleExport}
      className="mt-4 ml-0 w-full self-start bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
    >
      Export PDF
    </button>
  );
}
