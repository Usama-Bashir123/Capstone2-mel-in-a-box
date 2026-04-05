"use client";

// Party Video Preview Modal — node 213:15648
// Backdrop: rgba(0,0,0,0.9), padding 0 240px
// Card: white r=12 p=24 gap=20 border #E5E5E5
// Header: title Nunito 600 24px #141414 + X close 24×24
// Video area: fill-width × 525px, r=8
//   Thumbnail: party-video-preview-thumbnail.png (cover)
//   Overlay: party-video-preview-overlay.png (cover, on top)
//   Progress bar: pinned at bottom, white bg r=8 p=20 20 12
// Portal-rendered to escape overflow containers

import Image from "next/image";
import { X, Play } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

interface PartyVideoModalProps {
  title: string;
  onClose: () => void;
}

export function PartyVideoModal({ title, onClose }: PartyVideoModalProps) {
  const [progress] = useState(35); // demo progress %

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.9)", padding: "0 240px" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal card */}
      <div
        className="bg-white flex flex-col w-full"
        style={{ borderRadius: "12px", padding: "24px", gap: "20px", border: "1px solid #E5E5E5" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2
            className="font-nunito font-semibold"
            style={{ fontSize: "24px", lineHeight: "32px", color: "#141414" }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
            style={{ width: "24px", height: "24px" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Video player area */}
        <div
          className="relative overflow-hidden w-full"
          style={{ height: "525px", borderRadius: "8px", background: "rgba(0,0,0,0.1)" }}
        >
          {/* Thumbnail layer */}
          <Image
            src="/images/party/party-video-preview-thumbnail.png"
            alt="Video thumbnail"
            fill
            style={{ objectFit: "cover" }}
          />

          {/* Overlay layer (play UI / branding) */}
          <div className="absolute inset-0">
            <Image
              src="/images/party/party-video-preview-overlay.png"
              alt="Video overlay"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>

          {/* Center play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="flex items-center justify-center"
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "9999px",
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(16px)",
              }}
            >
              <Play size={28} style={{ color: "#141414", fill: "#141414", marginLeft: "4px" }} />
            </button>
          </div>

          {/* Progress bar — pinned at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 flex flex-col gap-2"
            style={{ background: "rgba(255,255,255,0.95)", borderRadius: "8px", padding: "20px 20px 12px" }}
          >
            {/* Timestamps row */}
            <div className="flex items-center justify-between">
              <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#424242" }}>
                1:24
              </span>
              <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#424242" }}>
                3:58
              </span>
            </div>
            {/* Progress track */}
            <div
              className="relative w-full cursor-pointer"
              style={{ height: "4px", borderRadius: "9999px", background: "#E5E5E5" }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${progress}%`,
                  background: "#F63D68",
                  borderRadius: "9999px",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
