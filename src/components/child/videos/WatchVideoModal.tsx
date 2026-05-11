"use client";

import Image from "next/image";
import { X, Play, Clock, Star } from "lucide-react";
import { useState, useRef } from "react";
import { createPortal } from "react-dom";

interface VideoItem {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  progress: number;
  stars?: number;
}

interface WatchVideoModalProps {
  video: VideoItem;
  onClose: () => void;
}



export function WatchVideoModal({ video, onClose }: WatchVideoModalProps) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

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
              position: "relative", width: "100%", height: "480px",
              borderRadius: "12px", overflow: "hidden", background: "#000000",
              cursor: "pointer",
            }}
          >
            <video
              ref={videoRef}
              src={video.videoUrl}
              poster={video.thumbnailUrl}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onClick={togglePlay}
              controls
            />

            {/* Play overlay when not playing and no controls active or just as a custom UI */}
            {!playing && (
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{ pointerEvents: "none" }}
              >
                <div
                  style={{
                    width: "72px", height: "72px", borderRadius: "50%",
                    background: "rgba(255,255,255,0.95)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0px 8px 24px rgba(0,0,0,0.3)",
                    pointerEvents: "auto"
                  }}
                  onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                >
                  <Play size={32} style={{ color: "#F63D68", marginLeft: "3px" }} fill="#F63D68" />
                </div>
              </div>
            )}
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
                onClick={togglePlay}
                className="font-nunito font-bold"
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "10px 20px", borderRadius: "8px",
                  background: "#F63D68", border: "none", fontSize: "14px",
                  lineHeight: "20px", cursor: "pointer", color: "#FFFFFF",
                  boxShadow: "0px 2px 8px rgba(246,61,104,0.3)",
                }}
              >
                <Play size={15} fill="white" /> {playing ? "Pause" : (video.progress > 0 ? "Continue Watching" : "Start Watching")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
