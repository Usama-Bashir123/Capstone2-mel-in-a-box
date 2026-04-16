"use client";

import { useState, useEffect } from "react";
import {
  Search, SlidersHorizontal,
  ChevronLeft, ChevronRight, X, Loader2
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, limit, Timestamp } from "firebase/firestore";

// ── Types ─────────────────────────────────────────────────────────
type MadeBy   = "Admin" | "Parent" | "Child" | "System";
type TabFilter = "All" | "Admin" | "Parent" | "Child";

interface ActivityRow {
  id: string;
  timestamp: Timestamp | null;
  displayTime: string;
  activity: string;
  role: MadeBy;
  type: string;
  targetName: string;
  changes: string[];
}

// ── Badge: "Activity Made by" ────────────────────────────────────
const MADE_BY_STYLES: Record<MadeBy, { bg: string; border: string; color: string }> = {
  Admin:  { bg: "#ECFDF3", border: "#ABEFC6", color: "#067647" },
  Parent: { bg: "#FEF5ED", border: "#F8DBAF", color: "#B54708" },
  Child:  { bg: "#F0F9FF", border: "#B9E5FD", color: "#026AA2" },
  System: { bg: "#F2F4F7", border: "#D0D5DD", color: "#344054" },
};

function MadeByBadge({ value }: { value: MadeBy }) {
  const s = MADE_BY_STYLES[value] || MADE_BY_STYLES.System;
  return (
    <span
      className="font-nunito font-semibold"
      style={{
        display: "inline-flex", alignItems: "center",
        fontSize: "12px", lineHeight: "18px",
        padding: "2px 8px", borderRadius: "9999px",
        background: s.bg, border: `1px solid ${s.border}`, color: s.color,
        whiteSpace: "nowrap",
      }}
    >
      {value}
    </span>
  );
}

// ── Segmented toggle ──────────────────────────────────────────────
function SegmentedToggle({
  options, value, onChange,
}: { options: TabFilter[]; value: TabFilter; onChange: (v: TabFilter) => void }) {
  return (
    <div style={{
      display: "inline-flex", background: "#FAFAFA",
      borderRadius: "10px", padding: "4px", gap: "4px",
    }}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className="font-nunito"
            style={{
              padding: "4px 12px", borderRadius: "6px", border: "none", cursor: "pointer",
              background: active ? "#FFFFFF" : "transparent",
              color:      active ? "#141414" : "#737373",
              fontWeight: 500, fontSize: "14px",
              boxShadow: active
                ? "0px 1px 2px rgba(16,24,40,0.06), 0px 1px 3px rgba(16,24,40,0.1)"
                : "none",
              transition: "all 0.15s",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ── Modal field ───────────────────────────────────────────────────
function ModalField({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <span className="font-nunito" style={{ fontWeight: 500, fontSize: "14px", color: "#424242" }}>
        {label}
      </span>
      <span className="font-nunito font-semibold" style={{ fontSize: "16px", color: "#141414" }}>
        {value}
      </span>
    </div>
  );
}

// ── Modal section card ────────────────────────────────────────────
function ModalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#FFFFFF", border: "1px solid #E5E5E5",
      borderRadius: "12px", padding: "16px",
      display: "flex", flexDirection: "column", gap: "16px",
    }}>
      <span className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>
        {title}
      </span>
      {children}
    </div>
  );
}

// ── Event Detail Modal ────────────────────────────────────────────
function EventModal({ row, onClose }: { row: ActivityRow; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "700px", maxHeight: "90vh", overflowY: "auto",
          background: "#FFF5F6",
          border: "1px solid #E5E5E5",
          borderRadius: "12px",
          padding: "24px",
          display: "flex", flexDirection: "column", gap: "20px",
          boxShadow: "0px 20px 24px -4px rgba(16,24,40,0.08), 0px 8px 8px -4px rgba(16,24,40,0.03)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="font-nunito font-semibold" style={{ fontSize: "24px", lineHeight: "32px", color: "#141414" }}>
            Event Details
          </span>
          <button
            onClick={onClose}
            style={{
              width: "24px", height: "24px", border: "none", background: "none",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              padding: 0,
            }}
          >
            <X size={20} style={{ color: "#424242" }} strokeWidth={2} />
          </button>
        </div>

        <ModalSection title="Event">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <ModalField label="Type" value={row.type || "N/A"} />
            <ModalField label="Target" value={row.targetName || "N/A"} />

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start" }}>
              <span className="font-nunito" style={{ fontWeight: 500, fontSize: "14px", color: "#424242" }}>
                Made By
              </span>
              <MadeByBadge value={row.role} />
            </div>

            <ModalField label="Timestamp" value={row.displayTime} />
          </div>
        </ModalSection>

        {row.changes && row.changes.length > 0 && (
          <ModalSection title="Changes:">
            <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {row.changes.map((item, i) => (
                <li key={i} className="font-nunito font-normal" style={{ fontSize: "14px", color: "#141414", lineHeight: "20px" }}>
                  {item}
                </li>
              ))}
            </ul>
          </ModalSection>
        )}

        <ModalSection title="Description">
          <p className="font-nunito font-normal" style={{ fontSize: "14px", color: "#141414", margin: 0 }}>
            {row.activity}
          </p>
        </ModalSection>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function ActivityLogPage() {
  const [tab, setTab] = useState<TabFilter>("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ActivityRow | null>(null);
  const [logs, setLogs] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "activity_logs"), orderBy("timestamp", "desc"), limit(100));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivityRow)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filtered = logs.filter((a) => {
    const matchTab = tab === "All" || a.role === tab;
    const matchSearch =
      (a.activity || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.role || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.displayTime || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.targetName || "").toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <>
      {selected && <EventModal row={selected} onClose={() => setSelected(null)} />}

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <h1 className="font-nunito font-semibold" style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}>
            Activity Log
          </h1>
          <p className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
            Track all admin and system events in real-time.
          </p>
        </div>

        <div style={{
          background: "#FFFFFF", border: "1px solid #E5E5E5",
          borderRadius: "12px", overflow: "hidden", minHeight: "600px"
        }}>

          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 20px", borderBottom: "1px solid #F2F4F7",
            gap: "16px", flexWrap: "wrap",
          }}>
            <SegmentedToggle
              options={["All", "Admin", "Parent", "Child"]}
              value={tab}
              onChange={setTab}
            />

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ position: "relative", width: "320px" }}>
                <Search
                  size={20}
                  style={{
                    position: "absolute", left: "14px", top: "50%",
                    transform: "translateY(-50%)", color: "#737373", pointerEvents: "none",
                  }}
                />
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="font-nunito font-normal focus:outline-none"
                  style={{
                    width: "100%", height: "40px",
                    paddingLeft: "42px", paddingRight: "14px",
                    borderRadius: "8px", border: "1px solid #E5E5E5",
                    fontSize: "16px", color: "#141414", background: "#FFFFFF",
                    boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
                  }}
                />
              </div>

              <button
                className="font-nunito font-bold"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  padding: "10px 14px", borderRadius: "8px",
                  border: "1px solid #D6D6D6", background: "#FFFFFF",
                  fontSize: "14px", color: "#424242", cursor: "pointer",
                  boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", whiteSpace: "nowrap",
                }}
              >
                <SlidersHorizontal size={16} />
                Filter
              </button>
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "185px 1fr 140px",
            padding: "14px 20px", background: "#FAFAFA",
            borderBottom: "1px solid #F2F4F7",
            gap: "12px", alignItems: "center",
          }}>
            {["Date & Time", "Activity", "Activity Made by"].map((h) => (
              <span key={h} className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>
                {h}
              </span>
            ))}
          </div>

          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "100px" }}>
              <Loader2 size={32} className="animate-spin" style={{ color: "#F63D68" }} />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "48px 20px", textAlign: "center" }}>
              <p className="font-nunito font-semibold" style={{ fontSize: "16px", color: "#141414" }}>No activity found</p>
            </div>
          ) : filtered.map((row, i) => (
            <div
              key={row.id}
              style={{
                display: "grid",
                gridTemplateColumns: "185px 1fr 140px",
                padding: "16px 20px", background: "#FFFFFF", gap: "12px",
                borderBottom: i < filtered.length - 1 ? "1px solid #EAECF0" : "none",
                alignItems: "center",
              }}
            >
              <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252", lineHeight: "20px" }}>
                {row.displayTime}
              </span>

              <span
                className="font-nunito font-normal"
                onClick={() => setSelected(row)}
                style={{
                  fontSize: "14px", color: "#525252", lineHeight: "20px",
                  cursor: "pointer",
                  overflow: "hidden", display: "-webkit-box",
                  WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#F63D68";
                  (e.currentTarget as HTMLElement).style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#525252";
                  (e.currentTarget as HTMLElement).style.textDecoration = "none";
                }}
              >
                {row.activity}
              </span>

              <div style={{ alignSelf: "center" }}>
                <MadeByBadge value={row.role} />
              </div>
            </div>
          ))}

          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "20px", borderTop: "1px solid #E5E5E5",
          }}>
            <button className="font-nunito font-bold" style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #D6D6D6", background: "#FFFFFF", fontSize: "14px", color: "#424242" }}>
              <ChevronLeft size={16} /> Previous
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              <button className="font-nunito font-semibold" style={{ width: "40px", height: "40px", borderRadius: "8px", border: "none", background: "#FAFAFA", color: "#424242" }}>1</button>
            </div>
            <button className="font-nunito font-bold" style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #D6D6D6", background: "#FFFFFF", fontSize: "14px", color: "#424242" }}>
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
