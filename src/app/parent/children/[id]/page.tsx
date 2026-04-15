"use client";

// View Child Profile — Wired to Firestore
// Loads from users/{uid}/children/{id}
// Delete: deleteDoc → redirect to /parent/children

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Edit2, Trash2, X, Loader2 } from "lucide-react";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/auth/auth-context";

// ── Helpers ────────────────────────────────────────────────
function calcAge(dob: string): string {
  if (!dob) return "—";
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age > 0 ? `${age} Years old` : "—";
}

// ── Static mock data for story/badge sections (to be replaced with real data later) ──
const storyCards = [
  { title: "Underwater Kingdom", status: "In Progress",  statusColor: "#F63D68", statusBg: "#FFF1F3", statusBorder: "#FECDD6", progress: 50  },
  { title: "The Magical Jungle", status: "Not Started",  statusColor: "#344054", statusBg: "#F9FAFB", statusBorder: "#EAECF0", progress: 0   },
  { title: "Space Adventure",    status: "Completed",    statusColor: "#067647", statusBg: "#ECFDF3", statusBorder: "#ABEFC6", progress: 100 },
];

const badges = [
  { name: "Jungle Explorer",  desc: "Awarded for completing \"The Magical Jungle\" story.", image: "/images/rewards/reward-badge-jungle-explorer.png",          earnedOn: "Today, 9:10 am" },
  { name: "Counting Star",    desc: "Earned by scoring 100% in the Counting Jungle mini-game.", image: "/images/rewards/reward-badge-counting-star-earned.png", earnedOn: "Today, 9:10 am" },
  { name: "Jungle Explorer",  desc: "Awarded for completing \"The Magical Jungle\" story.", image: "/images/rewards/reward-badge-jungle-explorer.png",          earnedOn: "Yesterday, 3:45 pm" },
  { name: "Counting Star",    desc: "Earned by scoring 100% in the Counting Jungle mini-game.", image: "/images/rewards/reward-badge-counting-star-earned.png", earnedOn: "Yesterday, 3:45 pm" },
];

// ── Delete Modal ───────────────────────────────────────────
function DeleteModal({ name, onCancel, onConfirm, isDeleting }: {
  name: string; onCancel: () => void; onConfirm: () => void; isDeleting: boolean;
}) {
  return createPortal(
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "24px", width: "500px", display: "flex", flexDirection: "column", gap: "20px", boxShadow: "0px 8px 32px rgba(16,24,40,0.12)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <h2 className="font-nunito font-semibold" style={{ fontSize: "20px", lineHeight: "30px", color: "#141414" }}>Delete Profile</h2>
            <p className="font-nunito font-normal" style={{ fontSize: "14px", lineHeight: "20px", color: "#525252" }}>
              Are you sure you want to delete <strong>{name}</strong>&apos;s profile? This cannot be undone.
            </p>
          </div>
          <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", display: "flex" }}>
            <X size={24} style={{ color: "#424242" }} />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#141414" }}>This will remove:</span>
          {["All story progress and reading history", "Earned badges and rewards", "Learning preferences and settings"].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#F63D68", flexShrink: 0 }} />
              <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>{item}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "16px" }}>
          <button onClick={onCancel} className="font-nunito font-bold" style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #D6D6D6", background: "#FFFFFF", fontSize: "14px", color: "#424242", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isDeleting} className="font-nunito font-bold text-white" style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #F63D68", background: "#F63D68", fontSize: "14px", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", opacity: isDeleting ? 0.6 : 1 }}>
            {isDeleting ? <><Loader2 size={14} className="animate-spin" /> Deleting...</> : "Delete Profile"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Page ───────────────────────────────────────────────────
export default function ViewChildPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();

  const [child, setChild] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load child from Firestore
  useEffect(() => {
    if (!user?.uid || !params.id) return;
    const fetchChild = async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid, "children", params.id));
        if (snap.exists()) {
          setChild({ id: snap.id, ...snap.data() });
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Error fetching child:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchChild();
  }, [user?.uid, params.id]);

  const handleDelete = async () => {
    if (!user?.uid) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "users", user.uid, "children", params.id));
      router.push("/parent/children");
    } catch (err) {
      console.error("Delete error:", err);
      setIsDeleting(false);
    }
  };

  // ── Loading ────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px", gap: "12px" }}>
        <Loader2 className="animate-spin" size={28} style={{ color: "#F63D68" }} />
        <span className="font-nunito font-medium" style={{ fontSize: "16px", color: "#525252" }}>Loading profile...</span>
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────
  if (notFound || !child) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "400px", gap: "16px" }}>
        <span style={{ fontSize: "48px" }}>😔</span>
        <h2 className="font-nunito font-semibold" style={{ fontSize: "24px", color: "#141414" }}>Profile not found</h2>
        <Link href="/parent/children" className="font-nunito font-bold" style={{ color: "#F63D68", textDecoration: "none" }}>← Back to Child Profiles</Link>
      </div>
    );
  }

  const age = calcAge(child.dob);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Breadcrumb + Actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/parent/children" className="font-nunito font-bold" style={{ fontSize: "14px", color: "#424242", textDecoration: "none" }}>
            Child Profile
          </Link>
          <ChevronRight size={16} style={{ color: "#737373" }} />
          <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>{child.name}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Edit */}
          <Link
            href={`/parent/children/${params.id}/edit`}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 14px", borderRadius: "8px", background: "#FFFFFF", border: "1px solid #D6D6D6", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", textDecoration: "none" }}
          >
            <Edit2 size={16} style={{ color: "#424242" }} />
            <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#424242" }}>Edit</span>
          </Link>
          {/* Delete */}
          <button
            onClick={() => setShowDelete(true)}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 14px", borderRadius: "8px", background: "#FFF1F3", border: "1px solid #FECDD6", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer" }}
          >
            <Trash2 size={16} style={{ color: "#F04438" }} />
            <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F04438" }}>Delete</span>
          </button>
        </div>
      </div>

      {/* Profile Hero */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Circle avatar */}
        <div style={{ width: "160px", height: "160px", borderRadius: "9999px", border: "1px solid #E5E5E5", overflow: "hidden", flexShrink: 0, background: "#FFF1F3", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {child.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={child.photoURL} alt={child.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: "72px" }}>🧒</span>
          )}
        </div>
        {/* Name + pills */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h1 className="font-nunito font-semibold" style={{ fontSize: "36px", lineHeight: "44px", letterSpacing: "-0.72px", color: "#141414" }}>
            {child.name}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <span className="font-nunito font-medium" style={{ fontSize: "16px", lineHeight: "24px", color: "#424242" }}>{age}</span>
            <div style={{ width: "1px", height: "20px", background: "#E5E5E5" }} />
            <span className="font-nunito font-medium" style={{ fontSize: "16px", lineHeight: "24px", color: "#424242" }}>{child.gender || "—"}</span>
            {child.language && (
              <>
                <div style={{ width: "1px", height: "20px", background: "#E5E5E5" }} />
                <span className="font-nunito font-medium" style={{ fontSize: "16px", lineHeight: "24px", color: "#424242" }}>{child.language}</span>
              </>
            )}
            {child.contentType && (
              <>
                <div style={{ width: "1px", height: "20px", background: "#E5E5E5" }} />
                <span className="font-nunito font-medium" style={{ fontSize: "16px", lineHeight: "24px", color: "#424242" }}>{child.contentType}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Story Progress card */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
        <h3 className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>Story Progress</h3>
        <div style={{ display: "flex", gap: "16px" }}>
          {storyCards.map((s, i) => (
            <div key={i} style={{ flex: 1, border: "1px solid #E5E5E5", borderRadius: "12px", padding: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Thumbnail */}
              <div style={{ width: "100%", height: "160px", borderRadius: "8px", background: "#FFF1F3", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #E5E5E5" }}>
                <span style={{ fontSize: "48px" }}>📖</span>
              </div>
              <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>{s.title}</span>
              <span className="font-nunito font-semibold self-start" style={{ fontSize: "12px", lineHeight: "18px", color: s.statusColor, background: s.statusBg, border: `1px solid ${s.statusBorder}`, borderRadius: "9999px", padding: "2px 8px" }}>
                {s.status}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ flex: 1, height: "8px", borderRadius: "9999px", background: "#F5F5F5", overflow: "hidden" }}>
                  <div style={{ width: `${s.progress}%`, height: "100%", background: "#F63D68", borderRadius: "9999px" }} />
                </div>
                <span className="font-inter font-medium" style={{ fontSize: "14px", lineHeight: "20px", color: "#344054", flexShrink: 0 }}>{s.progress}%</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span className="font-nunito font-medium" style={{ fontSize: "12px", color: "#525252" }}>Last Read:</span>
                <span className="font-nunito font-semibold" style={{ fontSize: "12px", color: "#424242" }}>2 hrs ago</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges Earned card */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
        <h3 className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>Badges Earned</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {[badges.slice(0, 2), badges.slice(2, 4)].map((row, ri) => (
            <div key={ri} style={{ display: "flex", gap: "20px" }}>
              {row.map((badge, bi) => (
                <div key={bi} style={{ flex: 1, background: "#FCFCFC", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "12px", display: "flex", gap: "20px", alignItems: "flex-start" }}>
                  <div style={{ width: "88px", height: "88px", borderRadius: "16px", background: "#FFF1F3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "40px" }}>
                    🏆
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                    <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>{badge.name}</span>
                    <span className="font-nunito font-normal" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>{badge.desc}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span className="font-nunito font-medium" style={{ fontSize: "14px", lineHeight: "20px", color: "#525252" }}>Earned on:</span>
                      <span className="font-nunito font-semibold" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}>{badge.earnedOn}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Delete Modal */}
      {showDelete && (
        <DeleteModal
          name={child.name?.split(" ")[0] || "this child"}
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
