"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Eye, ChevronLeft, ChevronRight, Slash } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, collectionGroup, Timestamp } from "firebase/firestore";
import { logActivity } from "@/lib/activity";

interface Parent {
  id: string;
  name?: string;
  displayName?: string;
  email: string;
  status: string;
  createdAt?: Timestamp | Date | string;
}

interface Child {
  id: string;
  parentId?: string;
  name: string;
  age: number;
  status?: string;
}

// ── Types ─────────────────────────────────────────────────────────
type MainTab      = "Parents" | "Children";
type StatusFilter = "All" | "Active" | "Disabled";
type AgeFilter    = "All" | "3-4" | "5-6" | "7+";

// ── Status badge ──────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const active = status !== "Disabled";
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
      {active ? "Active" : "Disabled"}
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
  
  const [parents, setParents] = useState<Parent[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  const mainTabs: MainTab[] = ["Parents", "Children"];

  useEffect(() => {
    setLoading(true);
    // Real-time listener for parents
    const parentsQuery = query(collection(db, "users"), where("role", "==", "parents"));
    const unsubscribeParents = onSnapshot(parentsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Parent));
      setParents(data);
      if (activeTab === "Parents") setLoading(false);
    });

    // Real-time listener for children
    const childrenQuery = query(collectionGroup(db, "children"));
    const unsubscribeChildren = onSnapshot(childrenQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        parentId: doc.ref.parent.parent?.id, 
        ...doc.data() 
      } as Child));
      setChildren(data);
      if (activeTab === "Children") setLoading(false);
    });

    return () => {
      unsubscribeParents();
      unsubscribeChildren();
    };
  }, [activeTab]);

  const filteredParents = parents.filter((p) => {
    const name = (p.displayName || p.name || "").toLowerCase();
    const email = (p.email || "").toLowerCase();
    const matchSearch = name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "Active"   && p.status !== "Disabled")  ||
      (statusFilter === "Disabled" && p.status === "Disabled");
    return matchSearch && matchStatus;
  });

  const filteredChildren = children.filter((c) => {
    const name = (c.name || "").toLowerCase();
    const parentName = parents.find(p => p.id === c.parentId)?.displayName || "Unknown Parent";
    const matchSearch = name.includes(search.toLowerCase()) || parentName.toLowerCase().includes(search.toLowerCase());
    const matchAge =
      ageFilter === "All" ||
      (ageFilter === "3-4" && c.age >= 3 && c.age <= 4) ||
      (ageFilter === "5-6" && c.age >= 5 && c.age <= 6) ||
      (ageFilter === "7+"  && c.age >= 7);
    return matchSearch && matchAge;
  });

  const handleToggleStatus = async (user: Parent, e: React.MouseEvent) => {
    e.preventDefault();
    const newStatus = user.status === "Disabled" ? "Active" : "Disabled";
    const action = newStatus === "Disabled" ? "disable" : "enable";
    if (!window.confirm(`Are you sure you want to ${action} ${user.displayName || user.name || "this user"}'s account?`)) return;
    
    try {
      await updateDoc(doc(db, "users", user.id), { status: newStatus });
      await logActivity({
        type: "Parent",
        activity: `${action === "disable" ? "Disabled" : "Enabled"} account for "${user.displayName || user.name}"`,
        targetName: user.displayName || user.name,
        changes: [`Status changed to ${newStatus}`]
      });
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  // Tab handling

  const handleTabChange = (tab: MainTab) => {
    setActiveTab(tab);
    setSearch("");
    setStatusFilter("All");
    setAgeFilter("All");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatTimestamp = (ts: any) => {
    if (!ts) return "N/A";
    if (ts.toDate) return ts.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    return new Date(ts).toLocaleDateString();
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

      <div style={{
        background: "#FFFFFF", border: "1px solid #E5E5E5",
        borderRadius: "12px", overflow: "hidden",
      }}>

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

        {activeTab === "Parents" && (
          <>
            <div style={{
              display: "grid",
              gridTemplateColumns: "44px 1fr 1fr 100px 110px 175px 80px",
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

            {loading ? (
              <div style={{ padding: "48px 20px", textAlign: "center" }}>
                <p className="font-nunito font-semibold" style={{ fontSize: "16px", color: "#141414" }}>Loading parents...</p>
              </div>
            ) : filteredParents.length === 0 ? (
              <div style={{ padding: "48px 20px", textAlign: "center" }}>
                <p className="font-nunito font-semibold" style={{ fontSize: "16px", color: "#141414" }}>No parents found</p>
              </div>
            ) : filteredParents.map((parent, i) => (
              <div
                key={parent.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px 1fr 1fr 100px 110px 175px 80px",
                  padding: "16px 20px", background: "#FFFFFF", gap: "12px",
                  borderBottom: i < filteredParents.length - 1 ? "1px solid #EAECF0" : "none",
                  alignItems: "center",
                }}
              >
                <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252" }}>{String(i + 1).padStart(2, "0")}</span>
                <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {parent.displayName || parent.name || "N/A"}
                </span>
                <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {parent.email}
                </span>
                <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252" }}>
                  {children.filter(c => c.parentId === parent.id).length}
                </span>
                <div><StatusBadge status={parent.status} /></div>
                <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252" }}>
                  {formatTimestamp(parent.createdAt)}
                </span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={(e) => handleToggleStatus(parent, e)}
                    style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: "32px", height: "32px", borderRadius: "8px",
                      border: "1px solid #E5E5E5", background: "#FFFFFF", color: parent.status === "Disabled" ? "#067647" : "#F04438",
                      cursor: "pointer", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
                    }}
                    title={parent.status === "Disabled" ? "Enable Account" : "Disable Account"}
                  >
                    <Slash size={15} />
                  </button>
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
              </div>
            ))}

            <Pagination />
          </>
        )}

        {activeTab === "Children" && (
          <>
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

            {loading ? (
              <div style={{ padding: "48px 20px", textAlign: "center" }}>
                <p className="font-nunito font-semibold" style={{ fontSize: "16px", color: "#141414" }}>Loading children...</p>
              </div>
            ) : filteredChildren.length === 0 ? (
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
                <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252" }}>{String(i + 1).padStart(2, "0")}</span>
                <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {child.name}
                </span>
                <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {parents.find(p => p.id === child.parentId)?.displayName || "Unknown Parent"}
                </span>
                <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252" }}>
                  {child.age}
                </span>
                <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252" }}>
                  2
                </span>
                <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#525252" }}>
                  4
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
      <button className="font-nunito font-bold" style={edgeBtnStyle}>
        <ChevronLeft size={16} /> Previous
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
        <button className="font-nunito font-semibold" style={{ width: "40px", height: "40px", borderRadius: "8px", border: "none", background: "#FAFAFA", color: "#424242", fontSize: "14px", cursor: "pointer" }}>1</button>
      </div>

      <button className="font-nunito font-bold" style={edgeBtnStyle}>
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
}
