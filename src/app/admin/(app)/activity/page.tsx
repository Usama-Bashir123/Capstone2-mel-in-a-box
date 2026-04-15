"use client";

import { useState } from "react";
import {
  Search, SlidersHorizontal,
  ChevronLeft, ChevronRight, X,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────
type MadeBy   = "Admin" | "Parent" | "Child";
type TabFilter = "All" | MadeBy;

interface ActivityRow {
  id:       string;
  dateTime: string;
  activity: string;
  madeBy:   MadeBy;
  modal: {
    event: {
      field1Label: string; field1Value: string;
      field2Label: string; field2Value: string;
      byLabel:     string; byValue:    string;   // shown as badge
      timestamp:   string;
    };
    changes:  string[];
    info: { ip: string; device: string };
  };
}

// ── Mock data ─────────────────────────────────────────────────────
const ACTIVITIES: ActivityRow[] = [
  {
    id: "1",
    dateTime: "Today, 09:45 AM",
    activity: 'Story "Pirate Island" updated, Changes: Page 3 illustration replaced',
    madeBy:   "Admin",
    modal: {
      event: {
        field1Label: "Type",      field1Value: "Story Update",
        field2Label: "Story",     field2Value: "Pirate Island",
        byLabel:     "Updated By", byValue:   "Admin",
        timestamp:   "Today, 09:45 AM",
      },
      changes: [
        "Replaced illustration on Page 3",
        "Adjusted text formatting",
        "Updated interaction button label",
      ],
      info: { ip: "192.168.1.43", device: "Chrome on MacOS" },
    },
  },
  {
    id: "2",
    dateTime: "Yesterday, 5:20PM",
    activity: "Purchase completed Jungle Bedtime Story Video, Amount: $4.99, Parent: Mike Brown",
    madeBy:   "Parent",
    modal: {
      event: {
        field1Label: "Type",      field1Value: "Purchase",
        field2Label: "Item",      field2Value: "Jungle Bedtime Story Video",
        byLabel:     "Parent",    byValue:     "Mike Brown",
        timestamp:   "Yesterday, 5:20PM",
      },
      changes: [
        "Amount charged: $4.99",
        "Payment method: Credit Card",
        "Transaction status: Completed",
      ],
      info: { ip: "192.168.1.55", device: "Safari on iPhone" },
    },
  },
  {
    id: "3",
    dateTime: "Yesterday, 5:20PM",
    activity: 'Child: Zoe Age 4 years, Completed the Story: "Jungle Bedtime Story Video".',
    madeBy:   "Child",
    modal: {
      event: {
        field1Label: "Type",      field1Value: "Story Completed",
        field2Label: "Child",     field2Value: "Zoe (Age 4)",
        byLabel:     "Story",     byValue:     "Jungle Bedtime Story Video",
        timestamp:   "Yesterday, 5:20PM",
      },
      changes: [
        'Completed: "Jungle Bedtime Story Video"',
        "Badge earned: Star Reader",
        "Progress updated: 100%",
      ],
      info: { ip: "192.168.1.78", device: "Chrome on iPad" },
    },
  },
  {
    id: "4",
    dateTime: "Mar 14, 2025",
    activity: 'New asset uploaded: "mel-jump-animation.gif"',
    madeBy:   "Admin",
    modal: {
      event: {
        field1Label: "Type",      field1Value: "Asset Upload",
        field2Label: "File",      field2Value: "mel-jump-animation.gif",
        byLabel:     "Updated By", byValue:   "Admin",
        timestamp:   "Mar 14, 2025",
      },
      changes: [
        "File uploaded successfully",
        "File size: 2.4 MB",
        "Type: GIF Animation",
      ],
      info: { ip: "192.168.1.43", device: "Chrome on MacOS" },
    },
  },
  {
    id: "5",
    dateTime: "Mar 10, 2025",
    activity: "Admin logged in from a new device — IP: 192.168.2.12",
    madeBy:   "Admin",
    modal: {
      event: {
        field1Label: "Type",      field1Value: "Login",
        field2Label: "Location",  field2Value: "New Device Detected",
        byLabel:     "Updated By", byValue:   "Admin",
        timestamp:   "Mar 10, 2025",
      },
      changes: [
        "Login from unrecognised device",
        "IP address: 192.168.2.12",
        "Browser: Firefox on Windows",
      ],
      info: { ip: "192.168.2.12", device: "Firefox on Windows" },
    },
  },
  {
    id: "6",
    dateTime: "Mar 03, 2025",
    activity: "Parent: Emma Clark updated profile — email and phone number changed",
    madeBy:   "Parent",
    modal: {
      event: {
        field1Label: "Type",   field1Value: "Profile Update",
        field2Label: "Parent", field2Value: "Emma Clark",
        byLabel:     "Parent", byValue:     "Emma Clark",
        timestamp:   "Mar 03, 2025",
      },
      changes: [
        "Email updated to: emma.c@newmail.com",
        "Phone number updated",
        "Changes saved successfully",
      ],
      info: { ip: "192.168.1.90", device: "Chrome on MacOS" },
    },
  },
  {
    id: "7",
    dateTime: "Feb 27, 2025",
    activity: 'Story "Space Explorer Mel" published to the catalog by admin',
    madeBy:   "Admin",
    modal: {
      event: {
        field1Label: "Type",       field1Value: "Story Published",
        field2Label: "Story",      field2Value: "Space Explorer Mel",
        byLabel:     "Updated By", byValue:    "Admin",
        timestamp:   "Feb 27, 2025",
      },
      changes: [
        "Story status set to Published",
        "Catalog updated with new entry",
        "Notification sent to subscribed parents",
      ],
      info: { ip: "192.168.1.43", device: "Chrome on MacOS" },
    },
  },
  {
    id: "8",
    dateTime: "Feb 27, 2025",
    activity: 'Child: Noah earned "Explorer" badge after completing 5 stories',
    madeBy:   "Child",
    modal: {
      event: {
        field1Label: "Type",   field1Value: "Badge Earned",
        field2Label: "Child",  field2Value: "Noah",
        byLabel:     "Badge",  byValue:     "Explorer",
        timestamp:   "Feb 27, 2025",
      },
      changes: [
        "Badge unlocked: Explorer",
        "5 stories completed milestone reached",
        "Badge added to profile",
      ],
      info: { ip: "192.168.1.61", device: "Safari on iPad" },
    },
  },
];

// ── Badge: "Activity Made by" ────────────────────────────────────
const MADE_BY_STYLES: Record<MadeBy, { bg: string; border: string; color: string }> = {
  Admin:  { bg: "#ECFDF3", border: "#ABEFC6", color: "#067647" },
  Parent: { bg: "#FEF5ED", border: "#F8DBAF", color: "#B54708" },
  Child:  { bg: "#F0F9FF", border: "#B9E5FD", color: "#026AA2" },
};

function MadeByBadge({ value }: { value: MadeBy }) {
  const s = MADE_BY_STYLES[value];
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
  const { modal } = row;
  const byIsMadeBy = (["Admin", "Parent", "Child"] as MadeBy[]).includes(modal.event.byValue as MadeBy);

  return (
    /* Overlay */
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000,
      }}
    >
      {/* Modal card — stop click propagation */}
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
        {/* Header: title + close */}
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

        {/* Section 1: Event */}
        <ModalSection title="Event">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <ModalField label={modal.event.field1Label} value={modal.event.field1Value} />
            <ModalField label={modal.event.field2Label} value={modal.event.field2Value} />

            {/* Updated By — shows role badge */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start" }}>
              <span className="font-nunito" style={{ fontWeight: 500, fontSize: "14px", color: "#424242" }}>
                {modal.event.byLabel}
              </span>
              {byIsMadeBy ? (
                <MadeByBadge value={modal.event.byValue as MadeBy} />
              ) : (
                <span className="font-nunito font-semibold" style={{ fontSize: "16px", color: "#141414" }}>
                  {modal.event.byValue}
                </span>
              )}
            </div>

            <ModalField label="Timestamp" value={modal.event.timestamp} />
          </div>
        </ModalSection>

        {/* Section 2: Changes */}
        <ModalSection title="Changes:">
          <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {modal.changes.map((item, i) => (
              <li key={i} className="font-nunito font-normal" style={{ fontSize: "14px", color: "#141414", lineHeight: "20px" }}>
                {item}
              </li>
            ))}
          </ul>
        </ModalSection>

        {/* Section 3: Additional Info */}
        <ModalSection title="Additional Info">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <ModalField label="IP Address" value={modal.info.ip}     />
            <ModalField label="Device"     value={modal.info.device} />
          </div>
        </ModalSection>
      </div>
    </div>
  );
}


// ── Pagination ────────────────────────────────────────────────────
function Pagination() {
  const edgeStyle: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "10px 14px", borderRadius: "8px",
    border: "1px solid #D6D6D6", background: "#FFFFFF",
    fontSize: "14px", color: "#424242", cursor: "pointer",
    boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
  };
  const pageStyle = (active: boolean): React.CSSProperties => ({
    width: "40px", height: "40px", borderRadius: "8px", border: "none",
    background: active ? "#FAFAFA" : "transparent",
    color: active ? "#424242" : "#525252",
    fontSize: "14px", cursor: "pointer",
  });

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "20px", borderTop: "1px solid #E5E5E5",
    }}>
      <button className="font-nunito font-bold" style={edgeStyle}>
        <ChevronLeft size={16} /> Previous
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
        {[1, 2, 3].map((n) => (
          <button key={n} className="font-nunito font-semibold" style={pageStyle(n === 1)}>{n}</button>
        ))}
        <span className="font-nunito" style={{ width: "40px", height: "40px", fontSize: "14px", color: "#525252", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          ...
        </span>
        {[8, 9, 10].map((n) => (
          <button key={n} className="font-nunito font-semibold" style={pageStyle(false)}>{n}</button>
        ))}
      </div>

      <button className="font-nunito font-bold" style={edgeStyle}>
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function ActivityLogPage() {
  const [tab,      setTab]      = useState<TabFilter>("All");
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState<ActivityRow | null>(null);

  const filtered = ACTIVITIES.filter((a) => {
    const matchTab    = tab === "All" || a.madeBy === tab;
    const matchSearch =
      a.activity.toLowerCase().includes(search.toLowerCase()) ||
      a.madeBy.toLowerCase().includes(search.toLowerCase()) ||
      a.dateTime.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <>
      {/* Modal (rendered outside the scroll flow, fixed) */}
      {selected && <EventModal row={selected} onClose={() => setSelected(null)} />}

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Page header */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <h1 className="font-nunito font-semibold" style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}>
            Activity Log
          </h1>
          <p className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
            Track all admin and system events in real-time.
          </p>
        </div>

        {/* Table card */}
        <div style={{
          background: "#FFFFFF", border: "1px solid #E5E5E5",
          borderRadius: "12px", overflow: "hidden",
        }}>

          {/* Toolbar */}
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
              {/* Search */}
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

              {/* Filter button */}
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

          {/* Table header */}
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

          {/* Table rows */}
          {filtered.length === 0 ? (
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
                {row.dateTime}
              </span>

              {/* Activity — clickable */}
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

              {/* Made by badge */}
              <div style={{ alignSelf: "flex-start" }}>
                <MadeByBadge value={row.madeBy} />
              </div>
            </div>
          ))}

          {/* Pagination */}
          <Pagination />
        </div>
      </div>
    </>
  );
}
