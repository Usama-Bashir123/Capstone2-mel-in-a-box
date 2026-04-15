"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, SlidersHorizontal, Eye, ChevronLeft, ChevronRight } from "lucide-react";

// ── Mock data (matches Figma) ─────────────────────────────────────

const PARENTS = [
  { id: "1", no: "01", name: "Sarah Lee",    email: "alma.lawson@example.com",    children: 2, status: "Active",  createdOn: "Today, 09:45 AM"   },
  { id: "2", no: "02", name: "Mike Brown",   email: "sara.cruz@example.com",      children: 1, status: "Disable", createdOn: "Yesterday, 5:20PM" },
  { id: "3", no: "03", name: "Aisha Khan",   email: "debra.holt@example.com",     children: 2, status: "Active",  createdOn: "Yesterday, 5:20PM" },
  { id: "4", no: "04", name: "David Wilson", email: "michael.mitc@example.com",   children: 1, status: "Disable", createdOn: "Mar 14, 2025"      },
  { id: "5", no: "05", name: "Emma Clark",   email: "kenzi.lawson@example.com",   children: 3, status: "Disable", createdOn: "Mar 10, 2025"      },
  { id: "6", no: "06", name: "Liam Taylor",  email: "georgia.young@example.com",  children: 1, status: "Disable", createdOn: "Mar 03, 2025"      },
  { id: "7", no: "07", name: "David Carl",   email: "nathan.roberts@example.com", children: 1, status: "Active",  createdOn: "Feb 27, 2025"      },
  { id: "8", no: "08", name: "Mary Jane",    email: "bill.sanders@example.com",   children: 2, status: "Active",  createdOn: "Feb 27, 2025"      },
];

const CHILDREN = [
  { id: "1", no: "01", name: "Mia",   parentName: "Sarah Lee",    age: 4, storiesCompleted: 2, badges: 4, parentId: "1" },
  { id: "2", no: "02", name: "Noah",  parentName: "Mike Brown",   age: 6, storiesCompleted: 1, badges: 6, parentId: "2" },
  { id: "3", no: "03", name: "Rayan", parentName: "Aisha Khan",   age: 7, storiesCompleted: 2, badges: 7, parentId: "3" },
  { id: "4", no: "04", name: "Hana",  parentName: "David Wilson", age: 7, storiesCompleted: 1, badges: 7, parentId: "4" },
  { id: "5", no: "05", name: "Jacob", parentName: "Emma Clark",   age: 6, storiesCompleted: 3, badges: 6, parentId: "5" },
  { id: "6", no: "06", name: "Zoe",   parentName: "Liam Taylor",  age: 4, storiesCompleted: 1, badges: 4, parentId: "6" },
  { id: "7", no: "07", name: "Rayan", parentName: "David Carl",   age: 8, storiesCompleted: 1, badges: 8, parentId: "7" },
  { id: "8", no: "08", name: "Noah",  parentName: "Mary Jane",    age: 3, storiesCompleted: 2, badges: 2, parentId: "8" },
];

type MainTab      = "Parents" | "Children";
type StatusFilter = "All" | "Active" | "Disabled";
type AgeFilter    = "All" | "3-4" | "5-6" | "7+";

// ── Status badge ──────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const active = status === "Active";
  return (
    <span
      className="font-nunito font-semibold"
      style={{
        display: "inline-flex", alignItems: "center",
        fontSize: "12px", lineHeight: "18px",
        padding: "2px 8px", borderRadius: "9999px",
        background: active ? "#ECFDF3" : "#FEF3F2",
        border: `1px solid ${active ? "#ABEFC6" : "#FDA29B"}`,
        color: active ? "#067647" : "#F04438",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

// ── Segmented toggle ──────────────────────────────────────────────
function SegmentedToggle<T extends string>({
  options, value, onChange,
}: { options: T[]; value: T; onChange: (v: T) => void }) {
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
              color: active ? "#141414" : "#737373",
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


// ── Page ──────────────────────────────────────────────────────────
export default function UsersPage() {
  const [activeTab,    setActiveTab]    = useState<MainTab>("Parents");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [ageFilter,    setAgeFilter]    = useState<AgeFilter>("All");
  const [search,       setSearch]       = useState("");

  const mainTabs: MainTab[] = ["Parents", "Children"];

  const filteredParents = PARENTS.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "Active"   && p.status === "Active")  ||
      (statusFilter === "Disabled" && p.status === "Disable");
    return matchSearch && matchStatus;
  });

  const filteredChildren = CHILDREN.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.parentName.toLowerCase().includes(search.toLowerCase());
    const matchAge =
      ageFilter === "All" ||
      (ageFilter === "3-4" && c.age >= 3 && c.age <= 4) ||
      (ageFilter === "5-6" && c.age >= 5 && c.age <= 6) ||
      (ageFilter === "7+"  && c.age >= 7);
    return matchSearch && matchAge;
  });

  const handleTabChange = (tab: MainTab) => {
    setActiveTab(tab);
    setSearch("");
    setStatusFilter("All");
    setAgeFilter("All");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Page header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <h1 className="font-nunito font-semibold" style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}>
          User Management
        </h1>
        <p className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
          Manage parent accounts and child profiles.
        </p>
      </div>

      {/* Parents / Children tab bar — outside the card */}
      <div style={{
        display: "inline-flex", alignSelf: "flex-start",
        background: "#FAFAFA", borderRadius: "10px", padding: "4px", gap: "4px",
      }}>
        {mainTabs.map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className="font-nunito"
              style={{
                padding: "8px 12px", height: "36px", borderRadius: "6px",
                border: "none", cursor: "pointer",
                background: active ? "#FFFFFF" : "transparent",
                color: active ? "#F63D68" : "#292929",
                fontWeight: active ? 600 : 500,
                fontSize: "14px",
                boxShadow: active
                  ? "0px 1px 2px rgba(16,24,40,0.06), 0px 1px 3px rgba(16,24,40,0.1)"
                  : "none",
                transition: "all 0.15s",
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Table card */}
      <div style={{
        background: "#FFFFFF", border: "1px solid #E5E5E5",
        borderRadius: "12px", overflow: "hidden",
      }}>

        {/* Card toolbar: status/age toggle (left) | search + filter (right) */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", borderBottom: "1px solid #F2F4F7",
          gap: "16px", flexWrap: "wrap",
        }}>
          {activeTab === "Parents" ? (
            <SegmentedToggle<StatusFilter>
              options={["All", "Active", "Disabled"]}
              value={statusFilter}
              onChange={setStatusFilter}
            />
          ) : (
            <SegmentedToggle<AgeFilter>
              options={["All", "3-4", "5-6", "7+"]}
              value={ageFilter}
              onChange={setAgeFilter}
            />
          )}

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

        {/* ── PARENTS TABLE ─────────────────────────────────────────── */}
        {activeTab === "Parents" && (
          <>
            {/* Header row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "44px 1fr 1fr 100px 110px 175px 48px",
              padding: "14px 20px", background: "#FAFAFA",
              borderBottom: "1px solid #F2F4F7",
              gap: "12px", alignItems: "center",
            }}>
              {["No#", "Name", "Email", "Children", "Status", "Created On", "Action"].map((h) => (
                <span key={h} className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Data rows */}
            {filteredParents.length === 0 ? (
              <div style={{ padding: "48px 20px", textAlign: "center" }}>
                <p className="font-nunito font-semibold" style={{ fontSize: "16px", color: "#141414" }}>No parents found</p>
              </div>
            ) : filteredParents.map((parent, i) => (
              <div
                key={parent.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px 1fr 1fr 100px 110px 175px 48px",
                  padding: "16px 20px", background: "#FFFFFF", gap: "12px",
                  borderBottom: i < filteredParents.length - 1 ? "1px solid #EAECF0" : "none",
                  alignItems: "center",
                }}
              >
                <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252" }}>{parent.no}</span>

                <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {parent.name}
                </span>

                <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {parent.email}
                </span>

                <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252" }}>
                  {parent.children}
                </span>

                <div><StatusBadge status={parent.status} /></div>

                <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252" }}>
                  {parent.createdOn}
                </span>

                <Link
                  href={`/admin/users/parents/${parent.id}`}
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: "32px", height: "32px", borderRadius: "8px",
                    border: "1px solid #E5E5E5", background: "#FFFFFF", color: "#525252",
                    textDecoration: "none", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
                  }}
                >
                  <Eye size={15} />
                </Link>
              </div>
            ))}

            <Pagination />
          </>
        )}

        {/* ── CHILDREN TABLE ────────────────────────────────────────── */}
        {activeTab === "Children" && (
          <>
            {/* Header row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "44px 1fr 1fr 60px 160px 80px 48px",
              padding: "14px 20px", background: "#FAFAFA",
              borderBottom: "1px solid #F2F4F7",
              gap: "12px", alignItems: "center",
            }}>
              {["No#", "Name", "Parent Name", "Age", "STORIES COMPLETED", "Badges", "Action"].map((h) => (
                <span key={h} className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Data rows */}
            {filteredChildren.length === 0 ? (
              <div style={{ padding: "48px 20px", textAlign: "center" }}>
                <p className="font-nunito font-semibold" style={{ fontSize: "16px", color: "#141414" }}>No children found</p>
              </div>
            ) : filteredChildren.map((child, i) => (
              <div
                key={child.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px 1fr 1fr 60px 160px 80px 48px",
                  padding: "16px 20px", background: "#FFFFFF", gap: "12px",
                  borderBottom: i < filteredChildren.length - 1 ? "1px solid #EAECF0" : "none",
                  alignItems: "center",
                }}
              >
                <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252" }}>{child.no}</span>

                <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {child.name}
                </span>

                <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {child.parentName}
                </span>

                <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252" }}>
                  {child.age}
                </span>

                <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252" }}>
                  {child.storiesCompleted}
                </span>

                <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252" }}>
                  {child.badges}
                </span>

                <Link
                  href={`/admin/users/children/${child.id}`}
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: "32px", height: "32px", borderRadius: "8px",
                    border: "1px solid #E5E5E5", background: "#FFFFFF", color: "#525252",
                    textDecoration: "none", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
                  }}
                >
                  <Eye size={15} />
                </Link>
              </div>
            ))}

            <Pagination />
          </>
        )}
      </div>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────
function Pagination() {
  const pageBtnStyle = (active: boolean) => ({
    width: "40px", height: "40px", borderRadius: "8px", border: "none",
    background: active ? "#FAFAFA" : "transparent",
    color: active ? "#424242" : "#525252",
    fontSize: "14px", cursor: "pointer",
  } as React.CSSProperties);

  const edgeBtnStyle: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: "6px",
    padding: "10px 14px", borderRadius: "8px",
    border: "1px solid #D6D6D6", background: "#FFFFFF",
    fontSize: "14px", color: "#424242", cursor: "pointer",
    boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "20px 20px", borderTop: "1px solid #E5E5E5",
    }}>
      {/* Previous — left edge */}
      <button className="font-nunito font-bold" style={edgeBtnStyle}>
        <ChevronLeft size={16} /> Previous
      </button>

      {/* Page numbers — centre */}
      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
        {[1, 2, 3].map((n) => (
          <button key={n} className="font-nunito font-semibold" style={pageBtnStyle(n === 1)}>{n}</button>
        ))}
        <span className="font-nunito" style={{ width: "40px", height: "40px", fontSize: "14px", color: "#525252", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          ...
        </span>
        {[8, 9, 10].map((n) => (
          <button key={n} className="font-nunito font-semibold" style={pageBtnStyle(false)}>{n}</button>
        ))}
      </div>

      {/* Next — right edge */}
      <button className="font-nunito font-bold" style={edgeBtnStyle}>
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
}
