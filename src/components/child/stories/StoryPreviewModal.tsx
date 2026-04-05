"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

interface StoryPreviewModalProps {
  title: string;
  onClose: () => void;
}

const pages = [
  { label: "Page 01", image: "/images/stories/story-page.png" },
  { label: "Page 02", image: "/images/stories/story-page.png" },
  { label: "Page 03", image: "/images/stories/story-page.png" },
  { label: "Page 04", image: "/images/stories/story-page.png" },
];

export function StoryPreviewModal({ title, onClose }: StoryPreviewModalProps) {
  const [activePage, setActivePage] = useState(0);

  // This component only ever mounts after a user click (previewStory starts null),
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

        {/* Page thumbnails */}
        <div style={{ display: "flex", gap: "16px" }}>
          {pages.map((page, idx) => (
            <button
              key={idx}
              onClick={() => setActivePage(idx)}
              style={{ display: "flex", flexDirection: "column", flex: 1, alignItems: "center", gap: "8px", outline: "none", background: "none", border: "none", cursor: "pointer" }}
            >
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  width: "100%",
                  height: "328px",
                  borderRadius: "8px",
                  border: activePage === idx ? "4px solid #F63D68" : "4px solid transparent",
                }}
              >
                <Image src={page.image} alt={page.label} fill style={{ objectFit: "cover" }} />
              </div>
              <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414", paddingBottom: "6px" }}>
                {page.label}
              </span>
            </button>
          ))}
        </div>

        {/* Info row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#292929" }}>Info:</span>
            <span className="font-nunito font-normal" style={{ fontSize: "12px", lineHeight: "18px", color: "#424242" }}>Stars you can earn: 3</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span className="font-nunito font-normal" style={{ fontSize: "14px", lineHeight: "20px", color: "#525252" }}>Reading time: 10 min</span>
            <button
              className="font-nunito font-bold"
              style={{ padding: "8px 12px", borderRadius: "8px", background: "#F63D68", fontSize: "14px", lineHeight: "20px", border: "none", cursor: "pointer", color: "#fff" }}
            >
              Start Reading
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
