"use client";

// Story Details — Figma node 214:12105
// Breadcrumb: "Story Progress" > "Story Details" (Rosé/500)
// Actions: Cancel + "Restart Story" (primary rose)
// Card 1: Story Details — 4 metadata fields (Title, Stars Earned, Time Spent, Progress)
// Card 2: Pages Completed — grid of page cards (2 per row, last row 1 card half-width)

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

/* ── Story data ────────────────────────────────────────── */
const storyData: Record<string, {
  title: string; starsEarned: string; timeSpent: string; progress: string;
  pages: { number: string; label: string }[];
}> = {
  "1": {
    title: "Underwater Kingdom", starsEarned: "3 Stars", timeSpent: "12 min", progress: "50%",
    pages: [
      { number: "01", label: "Page 1" },
      { number: "02", label: "Page 2" },
      { number: "03", label: "Page 3" },
      { number: "04", label: "Page 4" },
    ],
  },
  "2": {
    title: "The Magical Jungle", starsEarned: "3 Stars", timeSpent: "18 min", progress: "100%",
    pages: [
      { number: "01", label: "Page 1" },
      { number: "02", label: "Page 2" },
      { number: "03", label: "Page 3" },
      { number: "04", label: "Page 4" },
      { number: "05", label: "Page 5" },
    ],
  },
  "3": {
    title: "Pirate Island Adventure", starsEarned: "0 Stars", timeSpent: "0 min", progress: "0%",
    pages: [],
  },
};

/* ── Page Card ─────────────────────────────────────────── */
function PageCard({ number, label, isHalf }: { number: string; label: string; isHalf?: boolean }) {
  return (
    <div
      style={{
        background: "#FAFAFA", borderRadius: "12px", padding: "12px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: "20px",
        ...(isHalf ? { width: "502.5px", flexShrink: 0 } : { flex: 1 }),
      }}
    >
      {/* Left: page number + thumbnail + label */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Page number */}
        <span className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414", minWidth: "24px" }}>
          {number}
        </span>
        {/* Thumbnail + page label */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "36px", height: "48px", borderRadius: "6px", border: "0.5px solid #E5E5E5", position: "relative", overflow: "hidden", flexShrink: 0 }}>
            <Image
              src="/images/parent/story-progress/story-thumbnail.png"
              alt={label}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>
            {label}
          </span>
        </div>
      </div>

      {/* Right: Completed badge */}
      <span
        className="font-nunito font-semibold"
        style={{
          fontSize: "12px", lineHeight: "18px",
          color: "#067647", background: "#ECFDF3",
          border: "1px solid #ABEFC6", borderRadius: "9999px",
          padding: "2px 8px", whiteSpace: "nowrap", flexShrink: 0,
        }}
      >
        Completed
      </span>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────── */
export default function StoryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const story = storyData[params.id] ?? storyData["2"];

  // Split pages into rows of 2
  const pageRows: typeof story.pages[] = [];
  for (let i = 0; i < story.pages.length; i += 2) {
    pageRows.push(story.pages.slice(i, i + 2));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Breadcrumb + Actions ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link
            href="/parent/story-progress"
            className="font-nunito font-bold"
            style={{ fontSize: "14px", lineHeight: "20px", color: "#424242", textDecoration: "none" }}
          >
            Story Progress
          </Link>
          <ChevronRight size={16} style={{ color: "#737373" }} />
          <span className="font-nunito font-bold" style={{ fontSize: "14px", lineHeight: "20px", color: "#F63D68" }}>
            Story Details
          </span>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => router.back()}
            className="font-nunito font-bold"
            style={{
              padding: "10px 14px", borderRadius: "8px",
              border: "1px solid #D6D6D6", background: "#FFFFFF",
              fontSize: "14px", lineHeight: "20px", color: "#424242",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            className="font-nunito font-bold text-white"
            style={{
              padding: "10px 14px", borderRadius: "8px",
              border: "1px solid #F63D68", background: "#F63D68",
              fontSize: "14px", lineHeight: "20px",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer",
            }}
          >
            Restart Story
          </button>
        </div>
      </div>

      {/* ── Card 1: Story Details ── */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
        <span className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>
          Story Details
        </span>

        {/* 4 metadata fields */}
        <div style={{ display: "flex", gap: "20px" }}>
          {[
            { label: "Title",        value: story.title },
            { label: "Stars Earned", value: story.starsEarned },
            { label: "Time Spent",   value: story.timeSpent },
            { label: "Progress",     value: story.progress },
          ].map((field) => (
            <div key={field.label} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
              <span className="font-nunito font-medium" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}>
                {field.label}
              </span>
              <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>
                {field.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Card 2: Pages Completed ── */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
        <span className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>
          Pages Completed
        </span>

        {story.pages.length === 0 ? (
          <p className="font-nunito font-normal" style={{ fontSize: "16px", color: "#737373" }}>
            No pages started yet.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {pageRows.map((row, ri) => (
              <div key={ri} style={{ display: "flex", gap: "24px" }}>
                {row.map((page) => {
                  // Last page card gets half-width if it's alone in its row
                  const isLastAlone = row.length === 1;
                  return (
                    <PageCard
                      key={page.number}
                      number={page.number}
                      label={page.label}
                      isHalf={isLastAlone}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
