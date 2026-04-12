"use client";

// Party Themes — Figma node 214:16999
// Page header: "Party Themes" + subtitle
// Main card: filter tabs (All/3-4/5-6/7+) + search + Filter btn + single-column card list
// Each card: 343px image left | Age Group row + Title/Description + Included items grid + View Details btn

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, CheckCircle2 } from "lucide-react";

/* ── Types & Data ──────────────────────────────────────── */
interface PartyTheme {
  id: string;
  title: string;
  description: string;
  ageGroup: string;
  ageFilter: string;
  image: string;
  included: string[];
}

const themes: PartyTheme[] = [
  {
    id: "1",
    title: "Jungle Adventure Party",
    description: "Transform your home into a magical jungle with animal masks, vine decorations, and themed games.",
    ageGroup: "3-7",
    ageFilter: "3-4",
    image: "/images/parent/party-themes/party-jungle-adventure.png",
    included: ["Printable decorations", "Party games sheet", "Animal masks", "Cake toppers"],
  },
  {
    id: "2",
    title: "Space Explorer Party",
    description: "Launch into space with rocket crafts, space helmets, and planet-themed cupcake toppers.",
    ageGroup: "3-7",
    ageFilter: "5-6",
    image: "/images/parent/party-themes/party-space-explorer.png",
    included: ["Rocket craft template", "Decorations kit", "Space helmets", "Coloring sheets"],
  },
  {
    id: "3",
    title: "Pirate Island Party",
    description: "A high-energy pirate-themed party with treasure hunts, pirate hats, and map-based activities.",
    ageGroup: "3-7",
    ageFilter: "7+",
    image: "/images/parent/party-themes/party-pirate-island.png",
    included: ["Treasure map activity", "Pirate hats", "Bandana craft", "Party games sheet"],
  },
  {
    id: "4",
    title: "Pirate Island Party",
    description: "A high-energy pirate-themed party with treasure hunts, pirate hats, and map-based activities.",
    ageGroup: "3-7",
    ageFilter: "7+",
    image: "/images/parent/party-themes/party-pirate-island.png",
    included: ["Treasure map activity", "Pirate hats", "Bandana craft", "Party games sheet"],
  },
];

const FILTER_TABS = ["All", "3-4", "5-6", "7+"] as const;
type FilterTab = (typeof FILTER_TABS)[number];

/* ── Theme Card ────────────────────────────────────────── */
function ThemeCard({ theme }: { theme: PartyTheme }) {
  // Split included items into 2 columns
  const half = Math.ceil(theme.included.length / 2);
  const col1 = theme.included.slice(0, half);
  const col2 = theme.included.slice(half);

  return (
    <div
      style={{
        border: "1px solid #E5E5E5",
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        background: "#FFFFFF",
      }}
    >
      {/* Image — 343px wide, fills card height */}
      <div
        style={{
          width: "343px",
          minHeight: "200px",
          flexShrink: 0,
          borderRadius: "8px",
          border: "1px solid #E5E5E5",
          position: "relative",
          overflow: "hidden",
          alignSelf: "stretch",
        }}
      >
        <Image
          src={theme.image}
          alt={theme.title}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Top section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Age Group row */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#141414" }}>
              Age Group
            </span>
            <span className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>
              {theme.ageGroup}
            </span>
          </div>

          {/* Title + Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span className="font-nunito font-semibold" style={{ fontSize: "20px", lineHeight: "30px", color: "#141414" }}>
              {theme.title}
            </span>
            <span className="font-nunito font-normal" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>
              {theme.description}
            </span>
          </div>
        </div>

        {/* Bottom row: Included items + View Details button */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
          {/* Included label + 2-column grid */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", flex: 1 }}>
            <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414", flexShrink: 0 }}>
              Included
            </span>
            <div style={{ display: "flex", gap: "16px", flex: 1 }}>
              {[col1, col2].map((col, ci) => (
                <div key={ci} style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                  {col.map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <CheckCircle2 size={16} style={{ color: "#17B26A", flexShrink: 0 }} />
                      <span className="font-nunito font-normal" style={{ fontSize: "12px", lineHeight: "18px", color: "#141414" }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* View Details button — right-aligned, aligned to bottom of included section */}
          <Link
            href={`/parent/party-themes/${theme.id}`}
            className="font-nunito font-bold text-white"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 14px",
              borderRadius: "8px",
              background: "#F63D68",
              border: "1px solid #F63D68",
              fontSize: "14px",
              lineHeight: "20px",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────── */
export default function PartyThemesPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [search, setSearch] = useState("");

  const filtered = themes.filter((t) => {
    const matchTab = activeTab === "All" || t.ageFilter === activeTab;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <h1 className="font-nunito font-semibold" style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}>
          Party Themes
        </h1>
        <p className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
          Explore themed birthday party ideas inspired by Mel&apos;s stories.
        </p>
      </div>

      {/* ── Main card ── */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #EAECF0",
          borderRadius: "12px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
        }}
      >
        {/* Filter / controls bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          {/* Age group tabs */}
          <div style={{ padding: "4px", background: "#FAFAFA", borderRadius: "10px", display: "flex", gap: "4px" }}>
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="font-nunito font-medium"
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
            {/* Filter button */}
            <button
              className="font-nunito font-bold"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #D6D6D6",
                background: "#FFFFFF",
                fontSize: "14px",
                lineHeight: "20px",
                color: "#424242",
                boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
                cursor: "pointer",
              }}
            >
              <SlidersHorizontal size={20} style={{ color: "#424242" }} />
              Filter
            </button>
          </div>
        </div>

        {/* Theme cards — single column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {filtered.map((theme) => (
            <ThemeCard key={theme.id} theme={theme} />
          ))}
        </div>
      </div>

    </div>
  );
}
