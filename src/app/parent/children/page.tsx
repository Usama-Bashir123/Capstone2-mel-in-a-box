"use client";

// Child Profiles — Live Firestore version
// Reads from users/{uid}/children, real-time via onSnapshot
// Age is calculated from dob field (Date of Birth)

import { useState, useEffect } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { Search, Plus, Users, Loader2, Edit2, Trash2, X } from "lucide-react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/auth/auth-context";

interface ChildData {
  id: string;
  name: string;
  dob: string;
  gender: string;
  language: string;
  contentType: string;
  photoURL?: string;
}

const AGE_TABS = ["All", "3-4", "5-6", "7+"];

// ── Helpers ────────────────────────────────────────────────
function calcAge(dob: string): number {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

function ageGroup(age: number): string {
  if (age <= 4) return "3-4";
  if (age <= 6) return "5-6";
  return "7+";
}

// ── Delete Modal ───────────────────────────────────────────
function DeleteModal({
  name,
  onCancel,
  onConfirm,
  isDeleting,
}: {
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) {
  return createPortal(
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "24px", width: "480px", display: "flex", flexDirection: "column", gap: "20px", boxShadow: "0px 8px 32px rgba(16,24,40,0.12)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <h2 className="font-nunito font-semibold" style={{ fontSize: "20px", lineHeight: "30px", color: "#141414" }}>Delete Profile</h2>
            <p className="font-nunito font-normal" style={{ fontSize: "14px", lineHeight: "20px", color: "#525252" }}>
              Are you sure you want to delete <strong>{name}</strong>&apos;s profile? This cannot be undone.
            </p>
          </div>
          <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", display: "flex" }}>
            <X size={20} style={{ color: "#424242" }} />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span className="font-nunito font-semibold" style={{ fontSize: "13px", color: "#141414" }}>This will remove:</span>
          {["All story progress and reading history", "Earned badges and rewards", "Learning preferences and settings"].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#F63D68", flexShrink: 0 }} />
              <span className="font-nunito font-normal" style={{ fontSize: "13px", color: "#525252" }}>{item}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px" }}>
          <button onClick={onCancel} className="font-nunito font-bold" style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #D6D6D6", background: "#FFFFFF", fontSize: "14px", color: "#424242", cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isDeleting} className="font-nunito font-bold text-white" style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #F63D68", background: "#F63D68", fontSize: "14px", cursor: "pointer", opacity: isDeleting ? 0.6 : 1, display: "flex", alignItems: "center", gap: "6px" }}>
            {isDeleting ? <><Loader2 size={14} className="animate-spin" /> Deleting...</> : "Delete Profile"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Child Card ─────────────────────────────────────────────
function ChildCard({
  child,
  onDelete,
}: {
  child: ChildData;
  onDelete: (child: ChildData) => void;
}) {
  const age = calcAge(child.dob);

  return (
    <div style={{ flex: "1 1 280px", maxWidth: "340px", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "12px", display: "flex", flexDirection: "column", gap: "12px", background: "#FFFFFF" }}>
      {/* Avatar */}
      <div style={{ position: "relative", width: "100%", height: "200px", borderRadius: "8px", overflow: "hidden", border: "1px solid #E5E5E5", flexShrink: 0, background: "#FFF1F3", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {child.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={child.photoURL} alt={child.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: "64px" }}>🧒</span>
        )}
      </div>

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Name + actions */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
          <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>{child.name}</span>
          <div style={{ display: "flex", gap: "6px" }}>
            <Link
              href={`/parent/children/${child.id}/edit`}
              style={{ width: "32px", height: "32px", borderRadius: "6px", border: "1px solid #E5E5E5", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", textDecoration: "none" }}
              title="Edit"
            >
              <Edit2 size={14} style={{ color: "#424242" }} />
            </Link>
            <button
              onClick={() => onDelete(child)}
              style={{ width: "32px", height: "32px", borderRadius: "6px", border: "1px solid #FECDD6", background: "#FFF1F3", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              title="Delete"
            >
              <Trash2 size={14} style={{ color: "#F04438" }} />
            </button>
          </div>
        </div>

        {/* Meta row */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {[
            { label: "Age:", val: age > 0 ? `${age} yrs` : "—" },
            { label: "Gender:", val: child.gender || "—" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {i > 0 && <div style={{ width: "1px", height: "16px", background: "#D6D6D6", marginRight: "2px" }} />}
              <span className="font-nunito font-medium" style={{ fontSize: "12px", color: "#525252" }}>{item.label}</span>
              <span className="font-nunito font-semibold" style={{ fontSize: "12px", color: "#424242" }}>{item.val}</span>
            </div>
          ))}
        </div>

        {/* Preferences pills */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {child.language && (
            <span className="font-nunito font-medium" style={{ fontSize: "12px", color: "#424242", background: "#F9FAFB", border: "1px solid #EAECF0", borderRadius: "9999px", padding: "2px 8px" }}>{child.language}</span>
          )}
          {child.contentType && (
            <span className="font-nunito font-medium" style={{ fontSize: "12px", color: "#424242", background: "#F9FAFB", border: "1px solid #EAECF0", borderRadius: "9999px", padding: "2px 8px" }}>{child.contentType}</span>
          )}
        </div>

        {/* View Profile */}
        <Link
          href={`/parent/children/${child.id}`}
          className="font-nunito font-bold text-white"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "40px", borderRadius: "8px", background: "#F63D68", fontSize: "14px", textDecoration: "none", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)" }}
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}

// ── Filter Toggle ──────────────────────────────────────────
function FilterToggle({ active, onChange }: { active: string; onChange: (t: string) => void }) {
  return (
    <div style={{ padding: "4px", background: "#FAFAFA", borderRadius: "10px", display: "flex", gap: "4px" }}>
      {AGE_TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className="font-nunito font-medium"
          style={{ padding: "4px 12px", borderRadius: "6px", fontSize: "14px", border: "none", cursor: "pointer", color: active === tab ? "#141414" : "#737373", background: active === tab ? "#FFFFFF" : "#FAFAFA", boxShadow: active === tab ? "0px 1px 2px rgba(16,24,40,0.06), 0px 1px 3px rgba(16,24,40,0.1)" : "none", transition: "all 0.15s ease" }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────
export default function ChildProfilesPage() {
  const { user } = useAuth();
  const [children, setChildren] = useState<ChildData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ChildData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Firestore real-time subscription ──────────────────
  useEffect(() => {
    if (!user?.uid) return;
    const ref = collection(db, "users", user.uid, "children");
    const q = query(ref, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setChildren(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChildData)));
      setLoading(false);
    }, (err) => {
      console.error("Firestore error:", err);
      setLoading(false);
    });
    return () => unsub();
  }, [user?.uid]);

  // ── Filter ─────────────────────────────────────────────
  const filtered = children.filter((c) => {
    const age = calcAge(c.dob);
    const group = ageGroup(age);
    const matchTab = activeTab === "All" || group === activeTab;
    const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  // ── Delete ─────────────────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!deleteTarget || !user?.uid) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "users", user.uid, "children", deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <h1 className="font-nunito font-semibold" style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}>Child Profiles</h1>
          <p className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
            Manage your children&apos;s accounts and track their learning progress.
          </p>
        </div>
        <Link
          href="/parent/children/add"
          className="font-nunito font-bold text-white"
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 14px", borderRadius: "8px", background: "#F63D68", border: "1px solid #F63D68", fontSize: "14px", textDecoration: "none", whiteSpace: "nowrap", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)" }}
        >
          <Plus size={16} /> Add Child
        </Link>
      </div>

      {/* Main card */}
      <div style={{ background: "#FFFFFF", border: "1px solid #EAECF0", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "24px", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", minHeight: "500px" }}>

        {/* Card header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <FilterToggle active={activeTab} onChange={setActiveTab} />
          <div style={{ position: "relative", width: "320px" }}>
            <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#A3A3A3" }} />
            <input
              type="text"
              placeholder="Search children..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
              style={{ width: "100%", height: "44px", paddingLeft: "42px", paddingRight: "14px", borderRadius: "8px", border: "1px solid #E5E5E5", fontSize: "14px", color: "#141414", background: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)" }}
            />
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "60px 0" }}>
            <Loader2 className="animate-spin" size={28} style={{ color: "#F63D68" }} />
            <span className="font-nunito font-medium" style={{ fontSize: "16px", color: "#525252" }}>Loading profiles...</span>
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px", padding: "40px 0" }}>
            <div style={{ width: "120px", height: "120px", borderRadius: "999px", background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={48} style={{ color: "#D6D6D6" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", maxWidth: "400px", textAlign: "center" }}>
              <span className="font-nunito font-semibold" style={{ fontSize: "20px", lineHeight: "30px", color: "#141414" }}>
                {children.length === 0 ? "You haven't added any children yet" : "No children match your search"}
              </span>
              <span className="font-nunito font-normal" style={{ fontSize: "14px", lineHeight: "20px", color: "#525252" }}>
                {children.length === 0
                  ? "Create a child profile to access personalized stories, track progress, and unlock learning insights."
                  : "Try adjusting your search or filter."}
              </span>
            </div>
            {children.length === 0 && (
              <Link
                href="/parent/children/add"
                className="font-nunito font-bold text-white"
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 14px", borderRadius: "8px", background: "#F63D68", border: "1px solid #F63D68", fontSize: "14px", textDecoration: "none", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)" }}
              >
                <Plus size={16} /> Add First Child
              </Link>
            )}
          </div>
        ) : (
          /* Grid */
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {filtered.map((child) => (
              <ChildCard key={child.id} child={child} onDelete={setDeleteTarget} />
            ))}
          </div>
        )}
      </div>

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name?.split(" ")[0] || "this child"}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
