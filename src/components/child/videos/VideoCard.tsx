"use client";

import Image from "next/image";
import { Play } from "lucide-react";

interface VideoCardProps {
  id: string;
  title: string;
  duration: string;
  progress: number;
  lastWatched: string;
  image: string;
  onWatch: (id: string) => void;
}

export function VideoCard({ id, title, duration, progress, lastWatched, image, onWatch }: VideoCardProps) {
  return (
    <div
      className="bg-white flex flex-col flex-1"
      style={{ borderRadius: "12px", padding: "12px", border: "1px solid #E5E5E5" }}
    >
      {/* Thumbnail with play overlay */}
      <div className="relative overflow-hidden" style={{ height: "200px", borderRadius: "8px", flexShrink: 0 }}>
        <Image src={image} alt={title} fill style={{ objectFit: "cover" }} />

        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.25)" }} />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            style={{
              width: "48px", height: "48px", borderRadius: "50%",
              background: "rgba(255,255,255,0.92)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0px 4px 16px rgba(0,0,0,0.25)",
            }}
          >
            <Play size={20} style={{ color: "#F63D68", marginLeft: "2px" }} fill="#F63D68" />
          </div>
        </div>

        {/* Duration badge */}
        <div
          style={{
            position: "absolute", bottom: "8px", right: "8px",
            background: "rgba(0,0,0,0.72)", borderRadius: "4px",
            padding: "2px 7px",
          }}
        >
          <span className="font-nunito font-semibold" style={{ fontSize: "11px", color: "#FFFFFF" }}>{duration}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 mt-3">
        {/* Title */}
        <p className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>
          {title}
        </p>

        {/* Progress */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="font-nunito font-medium shrink-0" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}>
              Progress
            </span>
            <div className="flex-1 relative" style={{ height: "8px", borderRadius: "9999px", background: "#F5F5F5" }}>
              <div
                className="absolute inset-y-0 left-0"
                style={{ width: `${progress}%`, background: "#F63D68", borderRadius: "9999px" }}
              />
            </div>
            <span className="font-inter font-medium shrink-0" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}>
              {progress}%
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="font-nunito font-medium" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>
              Last Watched:
            </span>
            <span className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#424242" }}>
              {lastWatched}
            </span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => onWatch(id)}
          className="w-full flex items-center justify-center gap-2 font-nunito font-bold text-white hover:opacity-90 transition-opacity"
          style={{ height: "40px", borderRadius: "8px", background: "#F63D68", fontSize: "14px", lineHeight: "20px", border: "none", cursor: "pointer" }}
        >
          <Play size={15} fill="white" /> Watch Story
        </button>
      </div>
    </div>
  );
}
