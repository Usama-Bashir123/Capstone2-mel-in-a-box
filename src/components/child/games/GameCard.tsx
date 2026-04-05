"use client";

// Game Card — node 213:11000
// Card: col gap=12 p=12, r=12, border #E5E5E5 1px, bg white
// Image area: fill height r=8, real image
// Difficulty badge: absolute top-left, bg #ECFDF3 border #ABEFC6 text #067647, r=9999, Nunito 600 12px
// Title: Nunito 600 16px lh=24 #141414
// "Badges:" Nunito 500 14px lh=20 #424242 + badge icons
// "Star To earn:" Nunito 500 14px lh=20 #424242 + star icons
// Button: bg=#F63D68 r=8 h=40, "Play Again"/"Play Now" Nunito 700 14px white

import Image from "next/image";

export type Difficulty = "Easy" | "Medium" | "Hard";

interface GameCardProps {
  id: string;
  title: string;
  difficulty: Difficulty;
  badges: number;
  starsToEarn: number;
  image: string;
  played?: boolean;
  onPlay?: (id: string) => void;
}

const difficultyColors: Record<Difficulty, { bg: string; border: string; text: string }> = {
  Easy:   { bg: "#ECFDF3", border: "#ABEFC6", text: "#067647" },
  Medium: { bg: "#FFF8E1", border: "#FDE68A", text: "#B45309" },
  Hard:   { bg: "#FEE2E2", border: "#FCA5A5", text: "#B91C1C" },
};

export function GameCard({ id, title, difficulty, badges, starsToEarn, image, played, onPlay }: GameCardProps) {
  const diff = difficultyColors[difficulty];

  return (
    <div
      className="bg-white flex flex-col flex-1"
      style={{ borderRadius: "12px", padding: "12px", border: "1px solid #E5E5E5" }}
    >
      {/* Image area with difficulty badge */}
      <div
        className="relative overflow-hidden"
        style={{ height: "192px", borderRadius: "8px", border: "1px solid #E5E5E5", flexShrink: 0 }}
      >
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
        />

        {/* Difficulty badge — absolute top-left */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            top: "8px",
            left: "8px",
            background: diff.bg,
            border: `1px solid ${diff.border}`,
            borderRadius: "9999px",
            padding: "2px 8px",
          }}
        >
          <span
            className="font-nunito font-semibold"
            style={{ fontSize: "12px", lineHeight: "18px", color: diff.text }}
          >
            {difficulty}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 mt-3">

        {/* Title — Nunito 600 16px lh=24 #141414 */}
        <p
          className="font-nunito font-semibold"
          style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}
        >
          {title}
        </p>

        {/* Badges + Stars rows */}
        <div className="flex flex-col gap-2">

          {/* Badges row */}
          <div className="flex items-center gap-2" style={{ height: "24px" }}>
            <span
              className="font-nunito font-medium shrink-0"
              style={{ fontSize: "14px", lineHeight: "20px", color: "#424242", minWidth: "52px" }}
            >
              Badges:
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: badges }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center"
                  style={{ width: "24px", height: "24px", borderRadius: "4px", background: "#FEF1F2" }}
                >
                  <span style={{ fontSize: "14px" }}>🏅</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stars row */}
          <div className="flex items-center gap-2" style={{ height: "24px" }}>
            <span
              className="font-nunito font-medium shrink-0"
              style={{ fontSize: "14px", lineHeight: "20px", color: "#424242", minWidth: "80px" }}
            >
              Star To earn:
            </span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: starsToEarn }).map((_, i) => (
                <span key={i} style={{ fontSize: "16px" }}>⭐</span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA button */}
        <button
          onClick={() => onPlay?.(id)}
          className="w-full flex items-center justify-center font-nunito font-bold text-white hover:opacity-90 transition-opacity"
          style={{
            height: "40px",
            borderRadius: "8px",
            background: "#F63D68",
            fontSize: "14px",
            lineHeight: "20px",
            boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)",
          }}
        >
          {played ? "Play Again" : "Play Now"}
        </button>
      </div>
    </div>
  );
}
