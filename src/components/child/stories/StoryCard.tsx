"use client";

// Story Card — node 213:10590 (card inside layout_C8LNO1)
// Card: col gap=16 p=12, r=12, border #E5E5E5 1px, bg white
// Thumbnail (Profile): fill area height=200, r=8, real image
// Title: Nunito 600 16px lh=24 #141414
// "Progress" label: Nunito 500 14px lh=20 #424242
// Progress bar: height=8 track=#F5F5F5 fill=#F63D68
// "50%": Inter 500 14px lh=20 #424242
// "Last Read:" Nunito 500 12px lh=18 #525252
// "2 hrs ago" Nunito 600 12px lh=18 #424242
// Button: bg=#F63D68 h=40 r=8, "Continue Story" Nunito 700 14px white

import Image from "next/image";

interface StoryCardProps {
  id: string;
  title: string;
  progress: number;
  lastRead: string;
  image: string;
  onContinue?: (id: string) => void;
}

export function StoryCard({ id, title, progress, lastRead, image, onContinue }: StoryCardProps) {
  return (
    <div
      className="bg-white flex flex-col flex-1"
      style={{ borderRadius: "12px", padding: "12px", border: "1px solid #E5E5E5" }}
    >
      {/* Thumbnail — height=200 r=8 */}
      <div
        className="relative overflow-hidden"
        style={{
          height: "200px",
          borderRadius: "8px",
          flexShrink: 0,
        }}
      >
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
        />
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

        {/* Progress row */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {/* "Progress" — Nunito 500 14px lh=20 #424242 */}
            <span
              className="font-nunito font-medium shrink-0"
              style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}
            >
              Progress
            </span>
            {/* Bar */}
            <div
              className="flex-1 relative"
              style={{ height: "8px", borderRadius: "9999px", background: "#F5F5F5" }}
            >
              <div
                className="absolute inset-y-0 left-0"
                style={{
                  width: `${progress}%`,
                  background: "#F63D68",
                  borderRadius: "9999px",
                }}
              />
            </div>
            {/* Percentage — Inter 500 14px lh=20 #424242 */}
            <span
              className="font-inter font-medium shrink-0"
              style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}
            >
              {progress}%
            </span>
          </div>

          {/* Last Read */}
          <div className="flex items-center gap-1">
            <span
              className="font-nunito font-medium"
              style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}
            >
              Last Read:
            </span>
            <span
              className="font-nunito font-semibold"
              style={{ fontSize: "12px", lineHeight: "18px", color: "#424242" }}
            >
              {lastRead}
            </span>
          </div>
        </div>

        {/* CTA — bg=#F63D68 h=40 r=8, Nunito 700 14px white */}
        <button
          onClick={() => onContinue?.(id)}
          className="w-full flex items-center justify-center font-nunito font-bold text-white hover:opacity-90 transition-opacity"
          style={{
            height: "40px",
            borderRadius: "8px",
            background: "#F63D68",
            fontSize: "14px",
            lineHeight: "20px",
          }}
        >
          Continue Story
        </button>
      </div>
    </div>
  );
}
