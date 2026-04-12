"use client";

// Story Progress — Figma node 214:11347
// Page header: "Story Progress" + subtitle
// Card 1: section title + Select Child dropdown + 4 metric cards row
// Card 2: filter tabs (All/In-progress/Completed) + search + filter btn + 3 story cards row
// Card 3: Recent Story Activity table

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";

/* ── Status badge ──────────────────────────────────────── */
type StoryStatus = "In progress" | "Completed" | "Not Started";

const STATUS_STYLES: Record<StoryStatus, { bg: string; border: string; color: string }> = {
  "In progress":  { bg: "#FAFAFA",  border: "#FECDD6", color: "#F63D68" },
  "Completed":    { bg: "#ECFDF3",  border: "#ABEFC6", color: "#067647" },
  "Not Started":  { bg: "#F9FAFB",  border: "#EAECF0", color: "#344054" },
};

function StatusBadge({ status }: { status: StoryStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className="font-nunito font-semibold"
      style={{
        fontSize: "12px", lineHeight: "18px",
        color: s.color, background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: "9999px", padding: "2px 8px",
        alignSelf: "flex-start",
      }}
    >
      {status}
    </span>
  );
}

/* ── Progress bar ──────────────────────────────────────── */
function ProgressBar({ pct }: { pct: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{ flex: 1, height: "8px", borderRadius: "8px", background: "#F5F5F5", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "#F63D68", borderRadius: "8px" }} />
      </div>
      <span className="font-nunito font-medium" style={{ fontSize: "14px", lineHeight: "20px", color: "#344054", flexShrink: 0 }}>
        {pct}%
      </span>
    </div>
  );
}

/* ── Story Card ────────────────────────────────────────── */
function StoryCard({ id, title, status, progress, timeSpent, starsEarned, lastRead }: {
  id: string; title: string; status: StoryStatus;
  progress: number; timeSpent: string; starsEarned: string; lastRead: string;
}) {
  return (
    <div style={{
      flex: 1,
      border: "1px solid #E5E5E5", borderRadius: "12px",
      padding: "12px", display: "flex", flexDirection: "column", gap: "16px",
    }}>
      {/* Thumbnail */}
      <div style={{ position: "relative", width: "100%", height: "200px", borderRadius: "8px", overflow: "hidden", border: "1px solid #E5E5E5", flexShrink: 0 }}>
        <Image src="/images/parent/story-progress/story-thumbnail.png" alt={title} fill style={{ objectFit: "cover" }} />
      </div>

      {/* Card content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Title */}
        <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>
          {title}
        </span>

        {/* Status badge */}
        <StatusBadge status={status} />

        {/* Time + Stars row */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span className="font-inter font-medium" style={{ fontSize: "14px", color: "#525252" }}>Time Spend:</span>
          <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#424242" }}>{timeSpent}</span>
          <div style={{ width: "1px", height: "14px", background: "#D6D6D6" }} />
          <span className="font-inter font-medium" style={{ fontSize: "14px", color: "#525252" }}>Star Earned:</span>
          <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#424242" }}>{starsEarned}</span>
        </div>

        {/* Progress bar */}
        <ProgressBar pct={progress} />

        {/* Last Read */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span className="font-nunito font-medium" style={{ fontSize: "12px", color: "#525252" }}>Last Read:</span>
          <span className="font-nunito font-semibold" style={{ fontSize: "12px", color: "#424242" }}>{lastRead}</span>
        </div>

        {/* View Story Details button */}
        <Link
          href={`/parent/story-progress/${id}`}
          className="font-nunito font-bold text-white"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "10px 14px", borderRadius: "8px",
            background: "#F63D68", border: "1px solid #F63D68",
            fontSize: "14px", lineHeight: "20px",
            boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
            textDecoration: "none",
          }}
        >
          View Story Details
        </Link>
      </div>
    </div>
  );
}

/* ── Metric Card ───────────────────────────────────────── */
function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      flex: 1,
      background: "#FFFFFF", border: "1px solid #E5E5E5",
      borderRadius: "12px", padding: "20px",
      display: "flex", flexDirection: "column", gap: "8px",
      boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
    }}>
      <span className="font-nunito font-medium" style={{ fontSize: "14px", lineHeight: "20px", color: "#525252" }}>{label}</span>
      <span className="font-nunito font-semibold" style={{ fontSize: "24px", lineHeight: "32px", color: "#141414" }}>{value}</span>
    </div>
  );
}

/* ── Story data ────────────────────────────────────────── */
const stories = [
  { id: "1", title: "Underwater Kingdom",        status: "In progress" as StoryStatus, progress: 50,  timeSpent: "12 min", starsEarned: "3", lastRead: "2 hrs ago" },
  { id: "2", title: "The Magical Jungle",         status: "Completed"   as StoryStatus, progress: 100, timeSpent: "18 min", starsEarned: "3", lastRead: "Yesterday" },
  { id: "3", title: "Pirate Island Adventure",    status: "Not Started" as StoryStatus, progress: 0,   timeSpent: "0 min",  starsEarned: "0", lastRead: "—" },
];

const activityRows = [
  { activity: 'Mia completed "The Magical Jungle"',             date: "Today" },
  { activity: 'Mia reached 60% in "Pirate Island Adventure"',   date: "Yesterday" },
  { activity: 'Mia earned 1 star in "Space Explorer Mel"',       date: "24 March" },
  { activity: 'New story added: "Pirate Island Adventure"',      date: "22 March" },
];

const FILTER_TABS = ["All", "In-progress", "Completed"];

/* ── Page ──────────────────────────────────────────────── */
export default function StoryProgressPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedChild, setSelectedChild] = useState("Mia John");

  const filtered = stories.filter((s) => {
    const matchTab =
      activeTab === "All" ||
      (activeTab === "In-progress" && s.status === "In progress") ||
      (activeTab === "Completed" && s.status === "Completed");
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <h1 className="font-nunito font-semibold" style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}>
          Story Progress
        </h1>
        <p className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
          Track how each child is progressing through interactive stories.
        </p>
      </div>

      {/* ── Card 1: Select Child + Metrics ── */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <span className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>
            Story Progress
          </span>
          {/* Select Child dropdown */}
          <div style={{ position: "relative" }}>
            <label className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#424242", marginRight: "8px" }}>Select Child</label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="font-nunito font-normal focus:outline-none"
              style={{
                appearance: "none", padding: "10px 36px 10px 14px",
                borderRadius: "8px", border: "1px solid #E5E5E5",
                background: "#FFFFFF", fontSize: "14px", color: "#141414",
                boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer",
              }}
            >
              {["Mia John", "David John", "Noah John"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown size={16} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#424242", pointerEvents: "none" }} />
          </div>
        </div>

        {/* 4 metric cards */}
        <div style={{ display: "flex", gap: "16px" }}>
          <MetricCard label="Total Stories Available" value="12" />
          <MetricCard label="Stories Started"          value="4" />
          <MetricCard label="Stories Completed"        value="2" />
          <MetricCard label="Time Spent Reading"       value="68 min" />
        </div>
      </div>

      {/* ── Card 2: Story Cards ── */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Filter + Search row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          {/* Filter tabs */}
          <div style={{ padding: "4px", background: "#FAFAFA", borderRadius: "10px", display: "flex", gap: "4px" }}>
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="font-nunito font-semibold"
                style={{
                  padding: "4px 12px", borderRadius: "6px",
                  fontSize: "14px", lineHeight: "20px", border: "none", cursor: "pointer",
                  color: activeTab === tab ? "#141414" : "#737373",
                  background: activeTab === tab ? "#FFFFFF" : "#FAFAFA",
                  boxShadow: activeTab === tab ? "0px 1px 2px rgba(16,24,40,0.06), 0px 1px 3px rgba(16,24,40,0.10)" : "none",
                  transition: "all 0.15s",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Search */}
            <div style={{ position: "relative", width: "320px" }}>
              <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#A3A3A3" }} />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
                style={{
                  width: "100%", height: "44px", paddingLeft: "42px", paddingRight: "14px",
                  borderRadius: "8px", border: "1px solid #E5E5E5",
                  fontSize: "16px", color: "#141414",
                  background: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
                }}
              />
            </div>
            {/* Filter button */}
            <button
              className="font-nunito font-semibold"
              style={{
                display: "flex", alignItems: "center", gap: "4px",
                padding: "10px 14px", borderRadius: "8px",
                border: "1px solid #D6D6D6", background: "#FFFFFF",
                fontSize: "14px", color: "#424242",
                boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer",
              }}
            >
              <SlidersHorizontal size={16} style={{ color: "#424242" }} />
              Filters
            </button>
          </div>
        </div>

        {/* Story cards */}
        <div style={{ display: "flex", gap: "20px" }}>
          {filtered.map((s) => <StoryCard key={s.id} {...s} />)}
        </div>
      </div>

      {/* ── Card 3: Recent Story Activity ── */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px 12px 20px 20px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <span className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>
          Recent Story Activity
        </span>
        <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #F2F4F7" }}>
          {/* Header row */}
          <div style={{ display: "flex", background: "#F9FAFB", borderBottom: "1px solid #F2F4F7" }}>
            <div style={{ flex: 1, padding: "14px 20px" }}>
              <span className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>Activity</span>
            </div>
            <div style={{ padding: "14px 20px", whiteSpace: "nowrap" }}>
              <span className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>Date & Time</span>
            </div>
          </div>
          {/* Data rows */}
          {activityRows.map((row, i) => (
            <div
              key={i}
              style={{
                display: "flex", background: "#FFFFFF",
                borderBottom: i < activityRows.length - 1 ? "1px solid #EAECF0" : "none",
              }}
            >
              <div style={{ flex: 1, padding: "16px 20px" }}>
                <span className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>{row.activity}</span>
              </div>
              <div style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                <span className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>{row.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
