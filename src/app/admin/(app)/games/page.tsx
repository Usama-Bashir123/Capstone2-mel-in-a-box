"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search, SlidersHorizontal, Pencil, Trash2,
  ChevronLeft, ChevronRight,
} from "lucide-react";

// ── Mock data ────────────────────────────────────────────────────
const ALL_GAMES = [
  { id: "1", no: "01", title: "Counting Jungle",     story: "The Magical Jungle",  status: "Published", updated: "Today, 09:45 AM" },
  { id: "2", no: "02", title: "Match the Letters",   story: "Space Explorer Mel",  status: "Draft",     updated: "Yesterday, 5:20PM" },
  { id: "3", no: "03", title: "Hidden Tiger Hunt",   story: "The Magical Jungle",  status: "Published", updated: "Yesterday, 5:20PM" },
  { id: "4", no: "04", title: "Space Puzzle Pieces", story: "Space Explorer Mel",  status: "Draft",     updated: "Mar 14, 2025" },
  { id: "5", no: "05", title: "The Magical Jungle",  story: "Underwater Kingdom",  status: "Draft",     updated: "Mar 10, 2025" },
  { id: "6", no: "06", title: "Ocean Memory Cards",  story: "Underwater Kingdom",  status: "Draft",     updated: "Mar 03, 2025" },
  { id: "7", no: "07", title: "Dino Number Quest",   story: "Dino Land Adventure", status: "Published", updated: "Feb 27, 2025" },
  { id: "8", no: "08", title: "Match the Letters",   story: "Dino Land Adventure", status: "Published", updated: "Feb 27, 2025" },
];

const ICON_BG    = ["#FFF1F3","#F0F4FF","#ECFDF3","#FFFAEB","#F0F9FF","#FDF4FF","#FFF7ED","#F0FDF4"];
const ICON_EMOJI = ["🎮","🎯","🧩","🚀","🌊","🦕","⭐","🎲"];

type Tab = "All" | "Active" | "Draft";

// ── Status badge ─────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const pub = status === "Published";
  return (
    <span
      className="font-nunito font-semibold"
      style={{
        display: "inline-flex", alignItems: "center", width: "fit-content",
        whiteSpace: "nowrap", fontSize: "12px", lineHeight: "18px",
        padding: "2px 10px", borderRadius: "9999px",
        background: pub ? "#ECFDF3" : "#FFFAEB",
        border: `1px solid ${pub ? "#ABEFC6" : "#FEDF89"}`,
        color: pub ? "#067647" : "#B54708",
      }}
    >
      {status}
    </span>
  );
}

// ── Checkbox ──────────────────────────────────────────────────────
function Checkbox({
  checked, indeterminate = false, onChange,
}: { checked: boolean; indeterminate?: boolean; onChange: () => void }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      ref={(el) => { if (el) el.indeterminate = indeterminate; }}
      onChange={onChange}
      style={{
        width: "16px", height: "16px", borderRadius: "4px",
        accentColor: "#F63D68", cursor: "pointer", flexShrink: 0,
      }}
    />
  );
}

// ── Empty state ───────────────────────────────────────────────────
function EmptyState() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", gap: "20px" }}>
      <div style={{ width: "148px", height: "148px", borderRadius: "999px", background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "64px" }}>
        🎮
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", maxWidth: "448px" }}>
        <p className="font-nunito font-semibold" style={{ fontSize: "20px", lineHeight: "30px", color: "#141414", textAlign: "center" }}>
          No games yet
        </p>
        <p className="font-nunito font-normal" style={{ fontSize: "14px", lineHeight: "20px", color: "#525252", textAlign: "center" }}>
          Create interactive games linked to your stories to keep children engaged.
        </p>
      </div>
      <Link
        href="/admin/games/add"
        className="font-nunito font-bold"
        style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "10px 14px", borderRadius: "8px",
          border: "1px solid #F63D68", background: "#F63D68",
          color: "#FFFFFF", textDecoration: "none", fontSize: "14px",
          boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
        }}
      >
        Add New Game
      </Link>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function GamesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [search, setSearch]       = useState("");
  const [games, setGames]         = useState(ALL_GAMES);
  // Plain string[] — always creates a new array reference so React
  // detects every change without any Set-mutation ambiguity.
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const tabs: Tab[] = ["All", "Active", "Draft"];

  const filtered = games.filter((g) => {
    const matchTab =
      activeTab === "All"    ? true :
      activeTab === "Active" ? g.status === "Published" :
      g.status === "Draft";
    return matchTab && g.title.toLowerCase().includes(search.toLowerCase());
  });

  // Derive a Set once per render for O(1) lookups in the JSX below
  const selectedSet   = new Set(selectedIds);
  const allSelected   = filtered.length > 0 && filtered.every((g) => selectedSet.has(g.id));
  const someSelected  = filtered.some((g) => selectedSet.has(g.id)) && !allSelected;
  const selectedCount = filtered.filter((g) => selectedSet.has(g.id)).length;

  const toggleAll = () => {
    if (allSelected) {
      // Remove all currently-visible rows from selection
      const visibleIds = new Set(filtered.map((g) => g.id));
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.has(id)));
    } else {
      // Add all currently-visible rows that aren't already selected
      const toAdd = filtered.map((g) => g.id).filter((id) => !selectedSet.has(id));
      setSelectedIds((prev) => [...prev, ...toAdd]);
    }
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Bulk delete
  const handleBulkDelete = () => {
    setGames((prev) => prev.filter((g) => !selectedSet.has(g.id)));
    setSelectedIds([]);
  };

  // Single delete
  const handleDelete = (id: string) => {
    setGames((prev) => prev.filter((g) => g.id !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <h1 className="font-nunito font-semibold" style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}>
            Games Management
          </h1>
          <p className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
            Manage all learning games connected to stories.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          <Link
            href="/admin/games/add"
            className="font-nunito font-bold"
            style={{
              display: "inline-flex", alignItems: "center", gap: "4px",
              padding: "10px 14px", borderRadius: "8px",
              border: "1px solid #F63D68", background: "#F63D68",
              color: "#FFFFFF", textDecoration: "none", fontSize: "14px",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", whiteSpace: "nowrap",
            }}
          >
            Add New Game
          </Link>
        </div>
      </div>

      {/* Table container */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", overflow: "hidden", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)" }}>

        {/* Toolbar: tabs + (delete when selected | search+filter when nothing selected) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #F2F4F7", gap: "16px", flexWrap: "wrap" }}>
          {/* Filter tabs */}
          <div style={{ display: "inline-flex", background: "#F5F5F5", borderRadius: "10px", padding: "4px", gap: "2px" }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="font-nunito font-semibold"
                style={{
                  padding: "6px 12px", borderRadius: "8px", border: "none",
                  background: activeTab === tab ? "#FFFFFF" : "transparent",
                  color: activeTab === tab ? "#141414" : "#525252",
                  fontSize: "14px", cursor: "pointer",
                  boxShadow: activeTab === tab ? "0px 1px 2px rgba(16,24,40,0.05)" : "none",
                  transition: "all 0.15s",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {selectedCount > 0 ? (
            /* ── Selection mode: show delete button, hide search + filter ── */
            <button
              onClick={handleBulkDelete}
              className="font-nunito font-bold"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "9px 14px", borderRadius: "8px",
                border: "1px solid #FECDCA", background: "#FEF3F2",
                fontSize: "14px", color: "#F04438", cursor: "pointer",
                boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", whiteSpace: "nowrap",
              }}
            >
              <Trash2 size={16} style={{ color: "#F04438" }} />
              Delete ({selectedCount})
            </button>
          ) : (
            /* ── Normal mode: show search + filter ── */
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ position: "relative", width: "280px" }}>
                <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#A3A3A3", pointerEvents: "none" }} />
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
                  style={{
                    width: "100%", height: "40px", paddingLeft: "38px", paddingRight: "12px",
                    borderRadius: "8px", border: "1px solid #E5E5E5",
                    fontSize: "14px", color: "#141414", background: "#FFFFFF",
                    boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
                  }}
                />
              </div>
              <button
                className="font-nunito font-bold"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "9px 14px", borderRadius: "8px",
                  border: "1px solid #D6D6D6", background: "#FFFFFF",
                  fontSize: "14px", color: "#424242", cursor: "pointer",
                  boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", whiteSpace: "nowrap",
                }}
              >
                <SlidersHorizontal size={16} style={{ color: "#424242" }} />
                Filter
              </button>
            </div>
          )}
        </div>

        {/* Table body */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Column headers */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "44px 56px 1fr 1fr 130px 175px 80px",
                padding: "12px 20px",
                background: "#F9FAFB",
                borderBottom: "1px solid #F2F4F7",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {/* Header checkbox (select all) */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Checkbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} />
              </div>
              <span className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>Icon</span>
              <span className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>Game Title</span>
              <span className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>Linked Story</span>
              <span className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>Status</span>
              <span className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>Last Updated</span>
              <span className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>Action</span>
            </div>

            {/* Rows */}
            {filtered.map((game, i) => {
              const isSelected = selectedSet.has(game.id);
              return (
                <div
                  key={game.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "44px 56px 1fr 1fr 130px 175px 80px",
                    padding: "16px 20px",
                    background: isSelected ? "#FFF5F6" : "#FFFFFF",
                    borderBottom: i < filtered.length - 1 ? "1px solid #EAECF0" : "none",
                    alignItems: "center",
                    gap: "12px",
                    transition: "background 0.1s",
                  }}
                >
                  {/* Checkbox */}
                  <Checkbox checked={isSelected} onChange={() => toggleRow(game.id)} />

                  {/* Icon */}
                  <div
                    style={{
                      width: "40px", height: "40px", borderRadius: "8px",
                      background: ICON_BG[i % ICON_BG.length],
                      border: "1px solid #E5E5E5",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "20px",
                    }}
                  >
                    {ICON_EMOJI[i % ICON_EMOJI.length]}
                  </div>

                  {/* Game Title */}
                  <span className="font-nunito font-medium" style={{ fontSize: "14px", color: "#141414" }}>
                    {game.title}
                  </span>

                  {/* Linked Story */}
                  <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>
                    {game.story}
                  </span>

                  {/* Status */}
                  <div>
                    <StatusBadge status={game.status} />
                  </div>

                  {/* Last Updated */}
                  <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>
                    {game.updated}
                  </span>

                  {/* Actions */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Link
                      href={`/admin/games/${game.id}/edit`}
                      title="Edit"
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4px", color: "#525252", textDecoration: "none" }}
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      title="Delete"
                      onClick={() => handleDelete(game.id)}
                      style={{ background: "none", border: "none", padding: "4px", cursor: "pointer", display: "flex", alignItems: "center", color: "#525252" }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: "1px solid #EAECF0" }}>
              <button
                className="font-nunito font-semibold"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  padding: "8px 12px", borderRadius: "8px", border: "1px solid #E5E5E5",
                  background: "#FFFFFF", fontSize: "14px", color: "#424242",
                  cursor: "pointer", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
                }}
              >
                <ChevronLeft size={14} /> Previous
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    className="font-nunito font-semibold"
                    style={{
                      width: "36px", height: "36px", borderRadius: "8px",
                      border: n === 1 ? "1px solid #F63D68" : "none",
                      background: n === 1 ? "#FFF1F3" : "transparent",
                      color: n === 1 ? "#F63D68" : "#525252",
                      fontSize: "14px", cursor: "pointer",
                    }}
                  >
                    {n}
                  </button>
                ))}
                <span className="font-nunito" style={{ fontSize: "14px", color: "#525252", padding: "0 4px" }}>...</span>
                {[8, 9, 10].map((n) => (
                  <button
                    key={n}
                    className="font-nunito font-semibold"
                    style={{
                      width: "36px", height: "36px", borderRadius: "8px",
                      border: "none", background: "transparent",
                      color: "#525252", fontSize: "14px", cursor: "pointer",
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <button
                className="font-nunito font-semibold"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  padding: "8px 12px", borderRadius: "8px", border: "1px solid #E5E5E5",
                  background: "#FFFFFF", fontSize: "14px", color: "#424242",
                  cursor: "pointer", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
                }}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
