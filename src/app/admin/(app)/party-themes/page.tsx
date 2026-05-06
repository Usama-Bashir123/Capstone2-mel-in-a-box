"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Search, SlidersHorizontal, Pencil, Trash2,
  ChevronLeft, ChevronRight, PartyPopper,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, Timestamp } from "firebase/firestore";
import Image from "next/image";
import { logActivity } from "@/lib/activity";

interface Product {
  name: string;
  price: string;
  description: string;
  image: string;
}

interface PartyTheme {
  id: string;
  title: string;
  description?: string;
  age: string;
  category?: string;
  cover?: string;
  products?: Product[];
  status: "Published" | "Draft";
  lastUpdated?: Timestamp | string;
  createdAt?: Timestamp | string;
}

type Tab = "All" | "Active" | "Draft";

function StatusBadge({ status }: { status: string }) {
  const isPublished = status === "Published";
  return (
    <span
      className="font-nunito font-semibold"
      style={{
        display: "inline-flex", alignItems: "center", width: "fit-content",
        fontSize: "12px", lineHeight: "18px", padding: "2px 10px",
        borderRadius: "9999px", whiteSpace: "nowrap",
        background: isPublished ? "#ECFDF3" : "#FFFAEB",
        border: `1px solid ${isPublished ? "#ABEFC6" : "#FEDF89"}`,
        color: isPublished ? "#067647" : "#B54708",
      }}
    >
      {status}
    </span>
  );
}

function DeleteModal({
  theme, onConfirm, onCancel, isDeleting,
}: {
  theme: PartyTheme; onConfirm: () => void; onCancel: () => void; isDeleting: boolean;
}) {
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF", borderRadius: "16px", padding: "28px 32px",
          width: "440px", maxWidth: "calc(100vw - 32px)",
          boxShadow: "0px 20px 60px rgba(0,0,0,0.15)",
          display: "flex", flexDirection: "column", gap: "20px",
        }}
      >
        <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#FFF1F3", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Trash2 size={22} style={{ color: "#F63D68" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <h3 className="font-nunito font-semibold" style={{ fontSize: "18px", color: "#141414", margin: 0 }}>Delete Party Theme</h3>
          <p className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252", margin: 0, lineHeight: "20px" }}>
            Are you sure you want to delete{" "}
            <span style={{ fontWeight: 700, color: "#141414" }}>&quot;{theme.title}&quot;</span>?{" "}
            This action cannot be undone.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onCancel} disabled={isDeleting} className="font-nunito font-bold"
            style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid #D6D6D6", background: "#FFFFFF", fontSize: "14px", color: "#424242", cursor: "pointer", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", opacity: isDeleting ? 0.6 : 1 }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm} disabled={isDeleting} className="font-nunito font-bold"
            style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid #F63D68", background: "#F63D68", fontSize: "14px", color: "#FFFFFF", cursor: "pointer", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", opacity: isDeleting ? 0.6 : 1 }}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", gap: "20px" }}>
      <div style={{ width: "148px", height: "148px", borderRadius: "999px", background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <PartyPopper size={64} style={{ color: "#D6D6D6" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", maxWidth: "448px" }}>
        <p className="font-nunito font-semibold" style={{ fontSize: "20px", lineHeight: "30px", color: "#141414", textAlign: "center" }}>
          No party themes yet
        </p>
        <p className="font-nunito font-normal" style={{ fontSize: "14px", lineHeight: "20px", color: "#525252", textAlign: "center" }}>
          Create fun party themes complete with products and activities for children to enjoy.
        </p>
      </div>
      <Link
        href="/admin/party-themes/add"
        className="font-nunito font-bold"
        style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "10px 14px", borderRadius: "8px",
          border: "1px solid #F63D68", background: "#F63D68",
          boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
          textDecoration: "none", fontSize: "14px", color: "#FFFFFF",
        }}
      >
        Add Theme
      </Link>
    </div>
  );
}


export default function PartyThemesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [search, setSearch] = useState("");
  const [themes, setThemes] = useState<PartyTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<PartyTheme | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "partyThemes"), orderBy("lastUpdated", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setThemes(snap.docs.map((d) => ({ id: d.id, ...d.data() } as PartyTheme)));
      setLoading(false);
    }, (err) => {
      console.error("Firestore error:", err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = themes.filter((t) => {
    const matchTab = activeTab === "All" ? true : activeTab === "Active" ? t.status === "Published" : t.status === "Draft";
    return matchTab && (t.title || "").toLowerCase().includes(search.toLowerCase());
  });

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "partyThemes", deleteTarget.id));
      await logActivity({ type: "PartyTheme", activity: `Deleted party theme "${deleteTarget.title}"`, targetName: deleteTarget.title });
      setDeleteTarget(null);
    } catch { alert("Failed to delete theme."); }
    finally { setIsDeleting(false); }
  };

  const tabs: Tab[] = ["All", "Active", "Draft"];

  return (
    <>
      {deleteTarget && (
        <DeleteModal
          theme={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => !isDeleting && setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <h1 className="font-nunito font-semibold" style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}>
              Party Themes
            </h1>
            <p className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
              Manage and organize your party themes.
            </p>
          </div>
          <Link
            href="/admin/party-themes/add"
            className="font-nunito font-bold"
            style={{
              display: "inline-flex", alignItems: "center", gap: "4px",
              padding: "10px 14px", borderRadius: "8px",
              border: "1px solid #F63D68", background: "#F63D68",
              color: "#FFFFFF", textDecoration: "none", fontSize: "14px",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", whiteSpace: "nowrap",
            }}
          >
            + Add Theme
          </Link>
        </div>

        {/* Table container */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", overflow: "hidden", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)" }}>

          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #F2F4F7", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ display: "inline-flex", background: "#F5F5F5", borderRadius: "10px", padding: "4px", gap: "2px" }}>
              {tabs.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className="font-nunito font-semibold"
                  style={{
                    padding: "6px 12px", borderRadius: "8px", border: "none",
                    background: activeTab === tab ? "#FFFFFF" : "transparent",
                    color: activeTab === tab ? "#141414" : "#525252",
                    fontSize: "14px", cursor: "pointer",
                    boxShadow: activeTab === tab ? "0px 1px 2px rgba(16,24,40,0.05)" : "none",
                    transition: "all 0.15s",
                  }}
                >{tab}</button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ position: "relative", width: "280px" }}>
                <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#A3A3A3", pointerEvents: "none" }} />
                <input
                  type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}
                  className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
                  style={{ width: "100%", height: "40px", paddingLeft: "38px", paddingRight: "12px", borderRadius: "8px", border: "1px solid #E5E5E5", fontSize: "14px", color: "#141414", background: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)" }}
                />
              </div>
              <button className="font-nunito font-bold"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "9px 14px", borderRadius: "8px", border: "1px solid #D6D6D6", background: "#FFFFFF", fontSize: "14px", color: "#424242", cursor: "pointer", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", whiteSpace: "nowrap" }}
              >
                <SlidersHorizontal size={16} style={{ color: "#424242" }} /> Filter
              </button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div style={{ padding: "60px", textAlign: "center" }}>
              <p className="font-nunito" style={{ color: "#525252", fontSize: "14px" }}>Loading themes...</p>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Headers */}
              <div style={{ display: "grid", gridTemplateColumns: "52px 72px 1fr 2fr 80px 120px 80px", padding: "12px 20px", background: "#F9FAFB", borderBottom: "1px solid #F2F4F7" }}>
                {["No#", "Cover", "Theme Name", "Description", "Products", "Status", "Action"].map((h) => (
                  <span key={h} className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>{h}</span>
                ))}
              </div>

              {/* Rows */}
              {filtered.map((theme, i) => (
                <div key={theme.id}
                  style={{ display: "grid", gridTemplateColumns: "52px 72px 1fr 2fr 80px 120px 80px", padding: "16px 20px", background: "#FFFFFF", borderBottom: i < filtered.length - 1 ? "1px solid #EAECF0" : "none", alignItems: "center" }}
                >
                  <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: "#FFF5F6", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1px solid #FECDDA", position: "relative", flexShrink: 0 }}>
                    {theme.cover ? (
                      <Image src={theme.cover} alt={theme.title} fill style={{ objectFit: "cover" }} />
                    ) : (
                      <PartyPopper size={20} style={{ color: "#F63D68" }} />
                    )}
                  </div>

                  <span className="font-nunito font-medium" style={{ fontSize: "14px", color: "#141414", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: "12px" }}>
                    {theme.title}
                  </span>

                  <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: "12px" }}>
                    {theme.description || "—"}
                  </span>

                  <span className="font-nunito font-medium" style={{ fontSize: "14px", color: "#141414" }}>
                    {theme.products?.length ?? 0}
                  </span>

                  <div><StatusBadge status={theme.status} /></div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Link href={`/admin/party-themes/${theme.id}/edit`} title="Edit"
                      style={{ display: "flex", alignItems: "center", padding: "4px", color: "#525252", textDecoration: "none" }}>
                      <Pencil size={16} />
                    </Link>
                    <button onClick={() => setDeleteTarget(theme)} title="Delete"
                      style={{ background: "none", border: "none", padding: "4px", cursor: "pointer", display: "flex", alignItems: "center", color: "#525252" }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: "1px solid #EAECF0" }}>
                <button className="font-nunito font-semibold" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 12px", borderRadius: "8px", border: "1px solid #E5E5E5", background: "#FFFFFF", fontSize: "14px", color: "#424242" }}>
                  <ChevronLeft size={14} /> Previous
                </button>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button className="font-nunito font-semibold" style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid #F63D68", background: "#FFF1F3", color: "#F63D68", cursor: "pointer" }}>1</button>
                </div>
                <button className="font-nunito font-semibold" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 12px", borderRadius: "8px", border: "1px solid #E5E5E5", background: "#FFFFFF", fontSize: "14px", color: "#424242" }}>
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
