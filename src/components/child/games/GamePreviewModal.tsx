"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

interface GamePreviewModalProps {
  title: string;
  onClose: () => void;
}

const thumbnails = [
  { label: "Level 01", image: "/images/games/game-preview-thumbnail-1.png" },
  { label: "Level 02", image: "/images/games/game-preview-thumbnail-1.png" },
  { label: "Level 03", image: "/images/games/game-preview-thumbnail-1.png" },
  { label: "Level 04", image: "/images/games/game-preview-thumbnail-1.png" },
];

export function GamePreviewModal({ title, onClose }: GamePreviewModalProps) {
  const [activeThumb, setActiveThumb] = useState(0);

  // This component only ever mounts after a user click (previewGame starts null),
  // so it always runs on the client where document.body is available.
  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 240px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
          border: "1px solid #E5E5E5",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 className="font-nunito font-semibold" style={{ fontSize: "24px", lineHeight: "32px", color: "#141414" }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Thumbnails row */}
        <div style={{ display: "flex", gap: "16px" }}>
          {thumbnails.map((thumb, idx) => (
            <button
              key={idx}
              onClick={() => setActiveThumb(idx)}
              style={{ display: "flex", flexDirection: "column", flex: 1, alignItems: "center", gap: "8px", outline: "none", background: "none", border: "none", cursor: "pointer" }}
            >
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  width: "100%",
                  height: "240px",
                  borderRadius: "8px",
                  border: activeThumb === idx ? "4px solid #F63D68" : "4px solid transparent",
                }}
              >
                <Image src={thumb.image} alt={thumb.label} fill style={{ objectFit: "cover" }} />
              </div>
              <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414", paddingBottom: "6px" }}>
                {thumb.label}
              </span>
            </button>
          ))}
        </div>

        {/* Bottom row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px" }}>
          <span className="font-nunito font-normal" style={{ fontSize: "12px", lineHeight: "18px", color: "#424242" }}>
            Play time 10 mint
          </span>
          <button
            className="font-nunito font-bold"
            style={{ padding: "8px 12px", borderRadius: "8px", background: "#F63D68", fontSize: "14px", lineHeight: "20px", border: "none", cursor: "pointer", color: "#fff" }}
          >
            Play Now
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
