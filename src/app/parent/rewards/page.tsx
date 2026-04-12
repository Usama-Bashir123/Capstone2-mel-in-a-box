"use client";

// Rewards & Badges — Figma node 214:11645
// Page header: "Rewards & Badges" + subtitle
// Card 1: "Story Progress" section title + Select Child dropdown + 3 metric cards
// Card 2: Filter tabs (All/Story Badges/Game Badges/Special Badges) + single-column badge list
//   Each badge card: 88×88px icon (#FFF1F3 bg, r=16) | name + desc + Earned/Lock pill + date | View Detail →
// Card 3: Recent Activity table

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown, ChevronRight } from "lucide-react";

/* ── Types ─────────────────────────────────────────────── */
type BadgeState = "earned" | "locked";

interface Badge {
  id: string;
  name: string;
  description: string;
  state: BadgeState;
  earnedOn: string;
  image: string;
  category: "story" | "game" | "special";
}

/* ── Data ──────────────────────────────────────────────── */
const badges: Badge[] = [
  {
    id: "1",
    name: "Jungle Explorer",
    description: 'Awarded for completing "The Magical Jungle" story.',
    state: "earned",
    earnedOn: "Today, 9:10 am",
    image: "/images/rewards/reward-badge-jungle-explorer.png",
    category: "story",
  },
  {
    id: "2",
    name: "Counting Star",
    description: "Earned by scoring 100% in the Counting Jungle mini-game.",
    state: "earned",
    earnedOn: "Today, 9:10 am",
    image: "/images/rewards/reward-badge-counting-star-earned.png",
    category: "game",
  },
  {
    id: "3",
    name: "Counting Star",
    description: "Earned by scoring 100% in the Counting Jungle mini-game.",
    state: "locked",
    earnedOn: "—",
    image: "/images/rewards/reward-badge-counting-star-earned.png",
    category: "game",
  },
  {
    id: "4",
    name: "Jungle Explorer",
    description: 'Awarded for completing "The Magical Jungle" story.',
    state: "locked",
    earnedOn: "—",
    image: "/images/rewards/reward-badge-jungle-explorer-locked.png",
    category: "story",
  },
];

const activityRows = [
  { activity: 'Mia earned the "Jungle Explorer" badge',           date: "Today" },
  { activity: 'Mia earned the "Counting Star" badge',             date: "Yesterday" },
  { activity: 'Noah earned the "Jungle Explorer" badge',          date: "24 March" },
  { activity: 'New badge available: "Ocean Guardian"',            date: "22 March" },
];

const FILTER_TABS = ["All", "Story Badges", "Game Badges", "Special Badges"] as const;
type FilterTab = (typeof FILTER_TABS)[number];

/* ── Status Pill ───────────────────────────────────────── */
function StatusPill({ state }: { state: BadgeState }) {
  const earned = state === "earned";
  return (
    <span
      className="font-nunito font-semibold"
      style={{
        fontSize: "12px", lineHeight: "18px",
        color: earned ? "#067647" : "#344054",
        background: earned ? "#ECFDF3" : "#F9FAFB",
        border: `1px solid ${earned ? "#ABEFC6" : "#EAECF0"}`,
        borderRadius: "9999px",
        padding: "2px 8px",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {earned ? "Earned" : "Lock"}
    </span>
  );
}

/* ── Badge Card ────────────────────────────────────────── */
function BadgeCard({ badge }: { badge: Badge }) {
  return (
    <div
      style={{
        background: "#FCFCFC",
        border: "1px solid #E5E5E5",
        borderRadius: "12px",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Badge icon */}
        <div
          style={{
            width: "88px",
            height: "88px",
            borderRadius: "16px",
            background: "#FFF1F3",
            position: "relative",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <Image
            src={badge.image}
            alt={badge.name}
            fill
            style={{ objectFit: "contain", padding: "8px" }}
          />
        </div>

        {/* Info */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Name + description */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>
              {badge.name}
            </span>
            <span className="font-nunito font-normal" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>
              {badge.description}
            </span>
          </div>

          {/* Status + date row */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <StatusPill state={badge.state} />
            <div style={{ width: "1px", height: "20px", background: "#E5E5E5", flexShrink: 0 }} />
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="font-nunito font-medium" style={{ fontSize: "14px", lineHeight: "20px", color: "#525252" }}>
                Earned on:
              </span>
              <span className="font-nunito font-semibold" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}>
                {badge.earnedOn}
              </span>
            </div>
          </div>
        </div>

        {/* View Detail CTA */}
        <Link
          href={`/parent/rewards/${badge.id}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <span className="font-nunito font-semibold" style={{ fontSize: "16px", color: "#F63D68" }}>
            View Detail
          </span>
          <ChevronRight size={18} style={{ color: "#F63D68" }} />
        </Link>
      </div>
    </div>
  );
}

/* ── Metric Card ───────────────────────────────────────── */
function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        flex: 1,
        background: "#FFFFFF",
        border: "1px solid #E5E5E5",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
      }}
    >
      <span className="font-nunito font-medium" style={{ fontSize: "14px", lineHeight: "20px", color: "#525252" }}>
        {label}
      </span>
      <span className="font-nunito font-semibold" style={{ fontSize: "24px", lineHeight: "32px", color: "#141414" }}>
        {value}
      </span>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────── */
export default function RewardsBadgesPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [search, setSearch] = useState("");
  const [selectedChild, setSelectedChild] = useState("Mia John");

  const filtered = badges.filter((b) => {
    const matchTab =
      activeTab === "All" ||
      (activeTab === "Story Badges" && b.category === "story") ||
      (activeTab === "Game Badges" && b.category === "game") ||
      (activeTab === "Special Badges" && b.category === "special");
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <h1 className="font-nunito font-semibold" style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}>
          Rewards & Badges
        </h1>
        <p className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
          Track achievements your child earns through stories and games.
        </p>
      </div>

      {/* ── Card 1: Select Child + Metrics ── */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <span className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>
            Story Progress
          </span>
          {/* Select Child */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#424242" }}>
              Select Child
            </label>
            <div style={{ position: "relative" }}>
              <select
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
                className="font-nunito font-normal focus:outline-none"
                style={{
                  appearance: "none",
                  padding: "10px 36px 10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #E5E5E5",
                  background: "#FFFFFF",
                  fontSize: "14px",
                  color: "#141414",
                  boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
                  cursor: "pointer",
                  width: "180px",
                }}
              >
                {["Mia John", "David John", "Noah John"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown
                size={16}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#424242", pointerEvents: "none" }}
              />
            </div>
          </div>
        </div>

        {/* 3 metric cards */}
        <div style={{ display: "flex", gap: "16px" }}>
          <MetricCard label="Total Badges Earned"    value="5" />
          <MetricCard label="Total Badges Available" value="18" />
          <MetricCard label="Completion"             value="28%" />
        </div>
      </div>

      {/* ── Card 2: Badge List ── */}
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
                  padding: "4px 12px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  lineHeight: "20px",
                  border: "none",
                  cursor: "pointer",
                  color: activeTab === tab ? "#141414" : "#737373",
                  background: activeTab === tab ? "#FFFFFF" : "#FAFAFA",
                  boxShadow: activeTab === tab
                    ? "0px 1px 2px rgba(16,24,40,0.06), 0px 1px 3px rgba(16,24,40,0.10)"
                    : "none",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

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
                width: "100%",
                height: "44px",
                paddingLeft: "42px",
                paddingRight: "14px",
                borderRadius: "8px",
                border: "1px solid #E5E5E5",
                fontSize: "16px",
                color: "#141414",
                background: "#FFFFFF",
                boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
              }}
            />
          </div>
        </div>

        {/* Badge list — single column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {filtered.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      </div>

      {/* ── Card 3: Recent Activity ── */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px 12px 20px 20px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <span className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>
          Recent Activity
        </span>
        <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #F2F4F7" }}>
          {/* Header */}
          <div style={{ display: "flex", background: "#F9FAFB", borderBottom: "1px solid #F2F4F7" }}>
            <div style={{ flex: 1, padding: "14px 20px" }}>
              <span className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>Activity</span>
            </div>
            <div style={{ padding: "14px 20px", whiteSpace: "nowrap" }}>
              <span className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>Date & Time</span>
            </div>
          </div>
          {/* Rows */}
          {activityRows.map((row, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                background: "#FFFFFF",
                borderBottom: i < activityRows.length - 1 ? "1px solid #EAECF0" : "none",
              }}
            >
              <div style={{ flex: 1, padding: "16px 20px" }}>
                <span className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
                  {row.activity}
                </span>
              </div>
              <div style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                <span className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
                  {row.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
