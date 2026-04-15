"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search, SlidersHorizontal, Pencil, Trash2,
  ChevronLeft, ChevronRight,
} from "lucide-react";

const ALL_STORIES = [
  { id: "1", no: "01", title: "The Magical Jungle",  age: "3-6", status: "Published", updated: "Today, 09:45 AM" },
  { id: "2", no: "02", title: "Space Explorer Mel",  age: "N/A", status: "Draft",     updated: "Yesterday, 5:20PM" },
  { id: "3", no: "03", title: "The Magical Jungle",  age: "3-6", status: "Published", updated: "Yesterday, 5:20PM" },
  { id: "4", no: "04", title: "Space Explorer Mel",  age: "4-7", status: "Draft",     updated: "Mar 14, 2025" },
  { id: "5", no: "05", title: "The Magical Jungle",  age: "4-7", status: "Draft",     updated: "Mar 10, 2025" },
  { id: "6", no: "06", title: "Space Explorer Mel",  age: "4-7", status: "Draft",     updated: "Mar 03, 2025" },
  { id: "7", no: "07", title: "The Magical Jungle",  age: "4-7", status: "Published", updated: "Feb 27, 2025" },
  { id: "8", no: "08", title: "Space Explorer Mel",  age: "4-7", status: "Published", updated: "Feb 27, 2025" },
];

const COVER_COLORS = ["#FFF1F3","#F0F4FF","#FFF1F3","#F0F4FF","#FFF1F3","#F0F4FF","#FFF1F3","#F0F4FF"];
const COVER_EMOJI  = ["📖","🚀","📖","🚀","📖","🚀","📖","🚀"];

type Tab = "All" | "Active" | "Draft";

// Badge sizes itself to text content — no fixed width
function StatusBadge({ status }: { status: string }) {
  const isPublished = status === "Published";
  return (
    <span
      className="font-nunito font-semibold"
      style={{
        display: "inline-flex",
        alignItems: "center",
        width: "fit-content",
        fontSize: "12px",
        lineHeight: "18px",
        padding: "2px 10px",
        borderRadius: "9999px",
        background: isPublished ? "#ECFDF3" : "#FFFAEB",
        border: `1px solid ${isPublished ? "#ABEFC6" : "#FEDF89"}`,
        color: isPublished ? "#067647" : "#B54708",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

function EmptyState() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", gap: "20px" }}>
      <div style={{ width: "148px", height: "148px", borderRadius: "999px", background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "64px" }}>
        📚
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", maxWidth: "448px" }}>
        <p className="font-nunito font-semibold" style={{ fontSize: "20px", lineHeight: "30px", color: "#141414", textAlign: "center" }}>
          You haven&apos;t added any stories yet
        </p>
        <p className="font-nunito font-normal" style={{ fontSize: "14px", lineHeight: "20px", color: "#525252", textAlign: "center" }}>
          Start creating stories for children — set the age range, add a cover image, and publish when ready.
        </p>
      </div>
      <Link
        href="/admin/stories/add"
        style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "10px 14px", borderRadius: "8px",
          border: "1px solid #F63D68", background: "#F63D68",
          boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
          textDecoration: "none", fontSize: "14px", fontWeight: 700, color: "#FFFFFF",
        }}
        className="font-nunito font-bold"
      >
        Add Story
      </Link>
    </div>
  );
}

export default function StoriesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [search, setSearch] = useState("");

  const filtered = ALL_STORIES.filter((s) => {
    const matchTab =
      activeTab === "All"    ? true :
      activeTab === "Active" ? s.status === "Published" :
      s.status === "Draft";
    return matchTab && s.title.toLowerCase().includes(search.toLowerCase());
  });

  const tabs: Tab[] = ["All", "Active", "Draft"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <h1 className="font-nunito font-semibold" style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}>
            Stories
          </h1>
          <p className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
            Manage and track your digital stories.
          </p>
        </div>
        <Link
          href="/admin/stories/add"
          className="font-nunito font-bold"
          style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            padding: "10px 14px", borderRadius: "8px",
            border: "1px solid #F63D68", background: "#F63D68",
            color: "#FFFFFF", textDecoration: "none", fontSize: "14px",
            boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", whiteSpace: "nowrap",
          }}
        >
          Add Story
        </Link>
      </div>

      {/* Table container */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", overflow: "hidden", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)" }}>

        {/* Toolbar: tabs + search + filter */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #F2F4F7", gap: "16px", flexWrap: "wrap" }}>
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
                  borderRadius: "8px", border: "1px solid #E5E5E5", fontSize: "14px",
                  color: "#141414", background: "#FFFFFF",
                  boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
                }}
              />
            </div>
            <button
              className="font-nunito font-bold"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "9px 14px", borderRadius: "8px", border: "1px solid #D6D6D6",
                background: "#FFFFFF", fontSize: "14px", color: "#424242",
                cursor: "pointer", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", whiteSpace: "nowrap",
              }}
            >
              <SlidersHorizontal size={16} style={{ color: "#424242" }} />
              Filter
            </button>
          </div>
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
                gridTemplateColumns: "52px 72px 1fr 80px 130px 180px 80px",
                padding: "12px 20px",
                background: "#F9FAFB",
                borderBottom: "1px solid #F2F4F7",
              }}
            >
              {["No#", "Cover", "Title", "Age", "Status", "Last Updated", "Action"].map((h) => (
                <span key={h} className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {filtered.map((story, i) => (
              <div
                key={story.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "52px 72px 1fr 80px 130px 180px 80px",
                  padding: "16px 20px",
                  background: "#FFFFFF",
                  borderBottom: i < filtered.length - 1 ? "1px solid #EAECF0" : "none",
                  alignItems: "center",
                }}
              >
                <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>
                  {story.no}
                </span>

                <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: COVER_COLORS[i % COVER_COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", border: "1px solid #E5E5E5" }}>
                  {COVER_EMOJI[i % COVER_EMOJI.length]}
                </div>

                <span className="font-nunito font-medium" style={{ fontSize: "14px", color: "#141414" }}>
                  {story.title}
                </span>

                <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>
                  {story.age}
                </span>

                {/* Status badge — sizes to text */}
                <div>
                  <StatusBadge status={story.status} />
                </div>

                <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>
                  {story.updated}
                </span>

                {/* Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {/* Edit — Link for reliable navigation */}
                  <Link
                    href={`/admin/stories/${story.id}/edit`}
                    title="Edit"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4px", color: "#525252", textDecoration: "none" }}
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    title="Delete"
                    style={{ background: "none", border: "none", padding: "4px", cursor: "pointer", display: "flex", alignItems: "center", color: "#525252" }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

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
