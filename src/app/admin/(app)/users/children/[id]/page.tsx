"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronRight, Mail, Calendar, User, Loader2 } from "lucide-react";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";

interface ChildData {
  id: string;
  name: string;
  age: number;
  gender?: string;
  status?: string;
  photoURL?: string;
  joined?: string;
  createdAt?: Timestamp;
  parentId?: string;
}

interface ParentData {
  id: string;
  name?: string;
  displayName?: string;
  email?: string;
  status: string;
  photoURL?: string;
  createdAt?: Timestamp;
}

// ── Status badge ──────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const active = status === "Active";
  return (
    <span
      className="font-nunito font-semibold"
      style={{
        display: "inline-flex", alignItems: "center", width: "fit-content",
        whiteSpace: "nowrap", fontSize: "12px", lineHeight: "18px",
        padding: "2px 10px", borderRadius: "9999px",
        background: active ? "#ECFDF3" : "#F2F4F7",
        border: `1px solid ${active ? "#ABEFC6" : "#D0D5DD"}`,
        color: active ? "#067647" : "#525252",
      }}
    >
      {status}
    </span>
  );
}

// ── Info Row ──────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{
        width: "36px", height: "36px", borderRadius: "8px",
        background: "#FFF1F3", border: "1px solid #FFE0E7",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon size={16} style={{ color: "#F63D68" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
        <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#A3A3A3" }}>{label}</span>
        <span className="font-nunito font-medium" style={{ fontSize: "14px", color: "#141414" }}>{value}</span>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function ChildDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [child, setChild]   = useState<ChildData | null>(null);
  const [parent, setParent] = useState<ParentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      try {
        // Find child in the collectionGroup sub-collections
        // Actually, since we don't have the parentId from the URL, we might need a search or the collectionGroup query.
        // However, a common pattern is to have parentId in the URL or the child doc.
        // If we don't know the parent, we must use a collectionGroup query to find the child by ID.
        // Note: collectionGroup("children") requires an index for many queries, but by ID usually works on some SDKs.
        // But the simplest is to fetch all children and find the one with this ID, OR if we had /admin/users/parents/[pid]/children/[cid].
        
        // For now, let's assume we can't directly getDoc on a collectionGroup without the path.
        // We'll use a collectionGroup query.
        const { collectionGroup, query, where, getDocs } = await import("firebase/firestore");
        const q = query(collectionGroup(db, "children"), where("__name__", "==", id));
        const snap = await getDocs(q);
        
        if (!snap.empty) {
          const childDoc = snap.docs[0];
          const childData = childDoc.data();
          setChild({ id: childDoc.id, ...childData } as ChildData);

          if (childData.parentId) {
            const pDoc = await getDoc(doc(db, "users", childData.parentId));
            if (pDoc.exists()) {
              setParent({ id: pDoc.id, ...pDoc.data() } as ParentData);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching child details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
        <Loader2 size={32} className="animate-spin" style={{ color: "#F63D68" }} />
      </div>
    );
  }

  if (!child) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "300px", gap: "12px" }}>
        <p className="font-nunito font-semibold" style={{ fontSize: "18px", color: "#141414" }}>Child not found</p>
        <Link href="/admin/users" className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#F63D68", textDecoration: "none" }}>
          Go Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Link href="/admin/users" className="font-nunito font-bold" style={{ fontSize: "14px", color: "#424242", textDecoration: "none" }}>
          Users
        </Link>
        <ChevronRight size={16} style={{ color: "#A3A3A3", flexShrink: 0 }} />
        <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>
          {child.name}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Child profile card */}
        <div style={{
          background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px",
          padding: "24px", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
        }}>
          <h3 className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414", margin: "0 0 20px 0" }}>
            Child Information
          </h3>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "24px", flexWrap: "wrap" }}>
            {/* Avatar */}
            <div style={{ width: 88, height: 88, borderRadius: "50%", background: "#FFF1F3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", overflow: "hidden", position: "relative" }}>
              {child.photoURL ? (
                <Image src={child.photoURL} alt={child.name} fill style={{ objectFit: "cover" }} />
              ) : "🧒"}
            </div>

            {/* Details grid */}
            <div style={{ flex: 1, minWidth: "260px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <span className="font-nunito font-bold" style={{ fontSize: "22px", color: "#141414" }}>
                    {child.name}
                  </span>
                  <StatusBadge status={child.status || "Active"} />
                </div>
              </div>

              <InfoRow icon={User}     label="Age"         value={`${child.age} Years Old`} />
              <InfoRow icon={User}     label="Gender"      value={child.gender || "Not specified"} />
              <InfoRow icon={Calendar} label="Date Joined" value={child.joined || (child.createdAt?.toDate ? child.createdAt.toDate().toLocaleDateString() : "N/A")} />
            </div>
          </div>
        </div>

        {/* Parent information card */}
        {parent && (
          <div style={{
            background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px",
            padding: "24px", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414", margin: 0 }}>
                Parent Information
              </h3>
              <Link
                href={`/admin/users/parents/${parent.id}`}
                className="font-nunito font-semibold"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  padding: "8px 14px", borderRadius: "8px",
                  border: "1px solid #F63D68", background: "transparent",
                  fontSize: "13px", color: "#F63D68", textDecoration: "none",
                  boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
                }}
              >
                View Profile
                <ChevronRight size={14} />
              </Link>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "24px", flexWrap: "wrap" }}>
               <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#F0F4FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", overflow: "hidden", position: "relative" }}>
                {parent.photoURL ? (
                  <Image src={parent.photoURL} alt={parent.displayName || parent.name || ""} fill style={{ objectFit: "cover" }} />
                ) : "👨"}
              </div>

              {/* Parent details grid */}
              <div style={{ flex: 1, minWidth: "260px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <span className="font-nunito font-bold" style={{ fontSize: "18px", color: "#141414" }}>
                      {parent.displayName || parent.name}
                    </span>
                    <StatusBadge status={parent.status || "Active"} />
                  </div>
                </div>

                <InfoRow icon={Mail}     label="Email Address" value={parent.email || "N/A"}  />
                <InfoRow icon={Calendar} label="Date Joined"   value={parent.createdAt?.toDate ? parent.createdAt.toDate().toLocaleDateString() : "N/A"} />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
