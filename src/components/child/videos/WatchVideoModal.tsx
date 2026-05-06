"use client";

import Image from "next/image";
import { X, Play, Clock, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

interface VideoItem {
  id: string;
  title: string;
  duration: string;
  progress: number;
  image: string;
  description?: string;
  stars?: number;
  episode?: string;
}

interface WatchVideoModalProps {
  video: VideoItem;
  onClose: () => void;
}

const RELATED_EPISODES = [
  { label: "Episode 01", image: "/images/stories/story-1.png" },
  { label: "Episode 02", image: "/images/stories/story-2.png" },
  { label: "Episode 03", image: "/images/stories/story-3.png" },
  { label: "Episode 04", image: "/images/stories/story-4.png" },
];

export function WatchVideoModal({ video, onClose }: WatchVideoModalProps) {
  const [activeEpisode, setActiveEpisode] = useState(0);
  const [playing, setPlaying] = useState(false);

  return createPortal(
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0 200px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "#FFFFFF", borderRadius: "16px",
          width: "100%", maxWidth: "900px",
          display: "flex", flexDirection: "column", gap: "0",
          overflow: "hidden",
          boxShadow: "0px 24px 48px rgba(16,24,40,0.18)",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "18px 24px", borderBottom: "1px solid #F5F5F5",
          }}
        >
          <h2 className="font-nunito font-semibold" style={{ fontSize: "20px", lineHeight: "30px", color: "#141414", margin: 0 }}>
            {video.title}
          </h2>
          <button
            onClick={onClose}
            style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #E5E5E5", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#525252" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Video player area */}
          <div
            style={{
              position: "relative", width: "100%", height: "340px",
              borderRadius: "12px", overflow: "hidden", background: "#000000",
              cursor: "pointer",
            }}
            onClick={() => setPlaying(!playing)}
          >
            <Image
              src={RELATED_EPISODES[activeEpisode].image}
              alt={video.title}
              fill
              style={{ objectFit: "cover", opacity: playing ? 0.5 : 1, transition: "opacity 0.2s" }}
            />

            {/* Gradient overlay */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)" }} />

            {/* Play / Pause button */}
            {!playing ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  style={{
                    width: "72px", height: "72px", borderRadius: "50%",
                    background: "rgba(255,255,255,0.95)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0px 8px 24px rgba(0,0,0,0.3)",
                  }}
                >
                  <Play size={32} style={{ color: "#F63D68", marginLeft: "3px" }} fill="#F63D68" />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  style={{
                    width: "72px", height: "72px", borderRadius: "50%",
                    background: "rgba(255,255,255,0.92)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0px 8px 24px rgba(0,0,0,0.3)",
                  }}
                >
                  {/* Pause bars */}
                  <div style={{ display: "flex", gap: "5px" }}>
                    <div style={{ width: "5px", height: "22px", background: "#F63D68", borderRadius: "2px" }} />
                    <div style={{ width: "5px", height: "22px", background: "#F63D68", borderRadius: "2px" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Duration + episode label bottom-left */}
            <div style={{ position: "absolute", bottom: "14px", left: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  background: "rgba(0,0,0,0.7)", borderRadius: "6px", padding: "3px 10px",
                  fontSize: "12px", fontWeight: 700, color: "#FFFFFF", fontFamily: "Nunito, sans-serif",
                }}
              >
                {RELATED_EPISODES[activeEpisode].label}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <Clock size={13} style={{ color: "rgba(255,255,255,0.85)" }} />
                <span className="font-nunito font-medium" style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)" }}>{video.duration}</span>
              </div>
            </div>

            {/* Nav arrows */}
            {activeEpisode > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setActiveEpisode((p) => p - 1); setPlaying(false); }}
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <ChevronLeft size={20} style={{ color: "#525252" }} />
              </button>
            )}
            {activeEpisode < RELATED_EPISODES.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setActiveEpisode((p) => p + 1); setPlaying(false); }}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <ChevronRight size={20} style={{ color: "#525252" }} />
              </button>
            )}
          </div>

          {/* Episode thumbnails row */}
          <div style={{ display: "flex", gap: "12px" }}>
            {RELATED_EPISODES.map((ep, idx) => (
              <button
                key={idx}
                onClick={() => { setActiveEpisode(idx); setPlaying(false); }}
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                <div
                  style={{
                    position: "relative", width: "100%", height: "90px",
                    borderRadius: "8px", overflow: "hidden",
                    border: activeEpisode === idx ? "3px solid #F63D68" : "3px solid transparent",
                    transition: "border-color 0.15s",
                  }}
                >
                  <Image src={ep.image} alt={ep.label} fill style={{ objectFit: "cover" }} />
                  {/* Play overlay on inactive */}
                  {activeEpisode !== idx && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Play size={16} style={{ color: "#FFFFFF" }} fill="white" />
                    </div>
                  )}
                </div>
                <span
                  className="font-nunito font-semibold"
                  style={{ fontSize: "13px", lineHeight: "20px", color: activeEpisode === idx ? "#F63D68" : "#525252" }}
                >
                  {ep.label}
                </span>
              </button>
            ))}
          </div>

          {/* Info row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#292929" }}>Info:</span>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <Star size={14} style={{ color: "#F79009" }} fill="#F79009" />
                  <span className="font-nunito font-normal" style={{ fontSize: "12px", lineHeight: "18px", color: "#424242" }}>
                    Stars you can earn: {video.stars ?? 3}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <Clock size={14} style={{ color: "#525252" }} />
                  <span className="font-nunito font-normal" style={{ fontSize: "12px", lineHeight: "18px", color: "#424242" }}>
                    Watch time: {video.duration}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* Progress bar */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end" }}>
                <span className="font-nunito font-medium" style={{ fontSize: "12px", color: "#525252" }}>
                  {video.progress}% watched
                </span>
                <div style={{ width: "120px", height: "6px", borderRadius: "9999px", background: "#F5F5F5" }}>
                  <div style={{ width: `${video.progress}%`, height: "100%", background: "#F63D68", borderRadius: "9999px" }} />
                </div>
              </div>

              <button
                onClick={() => setPlaying(true)}
                className="font-nunito font-bold"
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "10px 20px", borderRadius: "8px",
                  background: "#F63D68", border: "none", fontSize: "14px",
                  lineHeight: "20px", cursor: "pointer", color: "#FFFFFF",
                  boxShadow: "0px 2px 8px rgba(246,61,104,0.3)",
                }}
              >
                <Play size={15} fill="white" /> {video.progress > 0 ? "Continue Watching" : "Start Watching"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
