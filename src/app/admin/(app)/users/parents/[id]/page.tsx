"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronRight, Trash2, BookOpen, Loader2 } from "lucide-react";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, updateDoc, deleteDoc, query, where, Timestamp } from "firebase/firestore";
import { logActivity } from "@/lib/activity";

interface ParentData {
  id: string;
  name?: string;
  displayName?: string;
  email?: string;
  status: string;
  createdAt?: Timestamp | Date | string;
}

interface ChildData {
  id: string;
  name: string;
  gender?: string;
  age?: number;
  photoURL?: string;
}

interface PurchaseData {
  id: string;
  item: string;
  amount: number;
  timestamp?: Timestamp | Date | string;
  displayTime?: string;
}

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

// ── Field Item ──────────────────────────────────────────────────
function FieldItem({ label, value }: { label: string; value: string }) {
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

// ── Page ────────────────────────────────────────────────────────
export default function ParentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [parent, setParent] = useState<ParentData | null>(null);
  const [children, setChildren] = useState<ChildData[]>([]);
  const [purchases, setPurchases] = useState<PurchaseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      try {
        // Fetch parent doc
        const parentDoc = await getDoc(doc(db, "users", id));
        if (parentDoc.exists()) {
          const data = parentDoc.data();
          setParent({ id: parentDoc.id, ...data } as ParentData);

          // Fetch children
          const childrenSnap = await getDocs(collection(db, "users", id, "children"));
          setChildren(childrenSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChildData)));

          // Fetch purchases (query by parentName or parentId if available)
          const purchasesQuery = query(collection(db, "purchases"), where("parentName", "==", data.displayName || data.name || ""));
          const purchasesSnap = await getDocs(purchasesQuery);
          setPurchases(purchasesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PurchaseData)));
        }
      } catch (err) {
        console.error("Error fetching parent details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!parent) return;
    const newStatus = parent.status === "Disabled" ? "Active" : "Disabled";
    const action = newStatus === "Disabled" ? "disable" : "enable";
    if (!window.confirm(`Are you sure you want to ${action} ${parent.displayName || parent.name || "this user"}'s account?`)) return;

    try {
      await updateDoc(doc(db, "users", id), { status: newStatus });
      setParent({ ...parent, status: newStatus });
      await logActivity({
        type: "Parent",
        activity: `${action === "disable" ? "Disabled" : "Enabled"} account for "${parent.displayName || parent.name}"`,
        targetName: parent.displayName || parent.name,
        changes: [`Status changed to ${newStatus}`]
      });
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  const handleDelete = async () => {
    if (!parent) return;
    if (!window.confirm(`CRITICAL: Are you sure you want to PERMANENTLY delete ${parent.displayName || parent.name}'s account? This cannot be undone.`)) return;

    try {
      await deleteDoc(doc(db, "users", id));
      await logActivity({
        type: "Parent",
        activity: `Deleted account for "${parent.displayName || parent.name}"`,
        targetName: parent.displayName || parent.name
      });
      router.push("/admin/users");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatTimestamp = (ts: any) => {
    if (!ts) return "N/A";
    if (ts.toDate) return ts.toDate().toLocaleDateString();
    return new Date(ts).toLocaleDateString();
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "200px" }}>
        <Loader2 className="animate-spin" size={32} style={{ color: "#F63D68" }} />
      </div>
    );
  }

  if (!parent) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2 className="font-nunito">Parent not found</h2>
        <Link href="/admin/users" style={{ color: "#F63D68", textDecoration: "none" }}>Go back to Users</Link>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin/users" className="font-nunito font-bold" style={{ fontSize: "14px", color: "#424242", textDecoration: "none" }}>
            Users
          </Link>
          <ChevronRight size={16} style={{ color: "#A3A3A3", flexShrink: 0 }} />
          <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>
            {parent.displayName || parent.name}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={handleDelete}
            style={{
              width: "40px", height: "40px", borderRadius: "8px",
              border: "1px solid #FECDCA", background: "#FEF3F2",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
            }}
          >
            <Trash2 size={16} style={{ color: "#F04438" }} />
          </button>

          <button
            onClick={handleToggleStatus}
            className="font-nunito font-bold"
            style={{
              padding: "10px 14px", borderRadius: "8px",
              border: "1px solid #D6D6D6", background: "#FFFFFF",
              fontSize: "14px", color: "#424242", cursor: "pointer",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", whiteSpace: "nowrap",
            }}
          >
            {parent.status === "Disabled" ? "Enable Account" : "Disable Account"}
          </button>
        </div>
      </div>

      {/* Info Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* Parent Info Card */}
        <div style={{
          background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px",
          boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
        }}>
          <h3 className="font-nunito font-semibold" style={{ fontSize: "18px", color: "#141414", margin: "0 0 24px 0" }}>
            Personal Information
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
            <FieldItem label="Full Name" value={parent.displayName || parent.name || "N/A"} />
            <FieldItem label="Email Address" value={parent.email || "N/A"} />
            <FieldItem label="Created At" value={formatTimestamp(parent.createdAt)} />
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span className="font-nunito" style={{ fontWeight: 500, fontSize: "14px", color: "#424242" }}>Status</span>
              <StatusBadge status={parent.status} />
            </div>
          </div>
        </div>

        {/* Children Info Card */}
        <div style={{
          background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px",
          boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
        }}>
          <h3 className="font-nunito font-semibold" style={{ fontSize: "18px", color: "#141414", margin: "0 0 24px 0" }}>
            Children Profiles
          </h3>
          {children.length === 0 ? (
            <p className="font-nunito" style={{ fontSize: "14px", color: "#737373" }}>No children profiles for this parent.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {children.map(child => (
                <div key={child.id} style={{ padding: "16px", border: "1px solid #F2F4F7", borderRadius: "8px", background: "#FAFAFA" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#FFF1F3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", position: "relative", overflow: "hidden" }}>
                      {child.photoURL ? (
                        <Image src={child.photoURL} alt={child.name} fill style={{ objectFit: "cover" }} />
                      ) : "🧒"}
                    </div>
                    <div>
                      <h4 className="font-nunito font-bold" style={{ fontSize: "16px", color: "#141414", margin: 0 }}>{child.name}</h4>
                      <p className="font-nunito" style={{ fontSize: "12px", color: "#737373", margin: 0 }}>{child.gender} • {child.age} yrs</p>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <div style={{ padding: "8px", background: "#FFFFFF", borderRadius: "6px", border: "1px solid #EAECF0" }}>
                      <p className="font-nunito" style={{ fontSize: "10px", color: "#737373", margin: 0 }}>STORIES</p>
                      <p className="font-nunito font-bold" style={{ fontSize: "14px", color: "#141414", margin: 0 }}>0</p>
                    </div>
                    <div style={{ padding: "8px", background: "#FFFFFF", borderRadius: "6px", border: "1px solid #EAECF0" }}>
                      <p className="font-nunito" style={{ fontSize: "10px", color: "#737373", margin: 0 }}>GAMES</p>
                      <p className="font-nunito font-bold" style={{ fontSize: "14px", color: "#141414", margin: 0 }}>0</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Purchases Card */}
        <div style={{
          background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px",
          boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
        }}>
          <h3 className="font-nunito font-semibold" style={{ fontSize: "18px", color: "#141414", margin: "0 0 24px 0" }}>
            Recent Purchases
          </h3>
          {purchases.length === 0 ? (
            <p className="font-nunito" style={{ fontSize: "14px", color: "#737373" }}>No purchase history found.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {purchases.map(p => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", background: "#FAFAFA", borderRadius: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: "#EFF8FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <BookOpen size={16} style={{ color: "#1570EF" }} />
                    </div>
                    <div>
                      <p className="font-nunito font-bold" style={{ fontSize: "14px", color: "#141414", margin: 0 }}>{p.item}</p>
                      <p className="font-nunito" style={{ fontSize: "12px", color: "#737373", margin: 0 }}>{p.displayTime || formatTimestamp(p.timestamp)}</p>
                    </div>
                  </div>
                  <p className="font-nunito font-bold" style={{ fontSize: "16px", color: "#067647" }}>${p.amount}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
