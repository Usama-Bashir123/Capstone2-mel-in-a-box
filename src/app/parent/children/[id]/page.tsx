"use client";

// View Child Profile — Figma node 214:15281
// Breadcrumb: "Child Profile" > "Mia John" (Rosé/500)
// Actions: Edit button (white border) + Delete button (rose-50 bg, rose-200 border, error text)
// Hero: 160×160 circle avatar + name (36px) + age/gender pills
// Card "Story Progress": 3 story cards (In Progress / Not Started / Completed)
// Card "Badges Earned": 2×2 badge grid
// Delete modal: portal, 700px card, "Delete Profile" title, bullet list, Cancel + Delete buttons

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Edit2, Trash2, X } from "lucide-react";

const childData: Record<string, {
  name: string; age: string; gender: string; image: string;
}> = {
  "1": { name: "Mia John",  age: "4 Years old", gender: "Female", image: "/images/parent/children/child-profile-1.png" },
  "2": { name: "David John", age: "7 Years old", gender: "Male",   image: "/images/parent/children/child-profile-2.png" },
  "3": { name: "Noah John",  age: "5 Years old", gender: "Male",   image: "/images/parent/children/child-profile-3.png" },
};

const storyCards = [
  { title: "Underwater Kingdom", status: "In Progress",  statusColor: "#F63D68",  statusBg: "#FFF1F3",  statusBorder: "#FECDD6", progress: 50  },
  { title: "Underwater Kingdom", status: "Not Started",  statusColor: "#344054",  statusBg: "#F9FAFB",  statusBorder: "#EAECF0", progress: 0   },
  { title: "Underwater Kingdom", status: "Completed",    statusColor: "#067647",  statusBg: "#ECFDF3",  statusBorder: "#ABEFC6", progress: 100 },
];

const badges = [
  { name: "Jungle Explorer", desc: 'Awarded for completing "The Magical Jungle" story.', image: "/images/rewards/reward-badge-jungle-explorer.png",          earnedOn: "Today, 9:10 am" },
  { name: "Counting Star",   desc: "Earned by scoring 100% in the Counting Jungle mini-game.", image: "/images/rewards/reward-badge-counting-star-earned.png", earnedOn: "Today, 9:10 am" },
  { name: "Jungle Explorer", desc: 'Awarded for completing "The Magical Jungle" story.', image: "/images/rewards/reward-badge-jungle-explorer.png",          earnedOn: "Today, 9:10 am" },
  { name: "Counting Star",   desc: "Earned by scoring 100% in the Counting Jungle mini-game.", image: "/images/rewards/reward-badge-counting-star-earned.png", earnedOn: "Today, 9:10 am" },
];

/* ── Delete Modal ──────────────────────────────────────── */
function DeleteModal({ name, onCancel, onConfirm }: { name: string; onCancel: () => void; onConfirm: () => void }) {
  return createPortal(
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 240px" }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "24px", width: "700px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <h2 className="font-nunito font-semibold" style={{ fontSize: "24px", lineHeight: "32px", color: "#141414" }}>Delete Profile</h2>
            <p className="font-nunito font-normal" style={{ fontSize: "14px", lineHeight: "20px", color: "#525252" }}>
              Are you sure you want to delete {name}&apos;s profile?
            </p>
          </div>
          <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", display: "flex" }}>
            <X size={24} style={{ color: "#424242" }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span className="font-nunito font-semibold" style={{ fontSize: "14px", lineHeight: "20px", color: "#141414" }}>This will remove:</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              "All story progress and reading history",
              "Earned badges and rewards",
              "Learning preferences and settings",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#F63D68", flexShrink: 0 }} />
                <span className="font-nunito font-normal" style={{ fontSize: "14px", lineHeight: "20px", color: "#525252" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "16px" }}>
          <button
            onClick={onCancel}
            className="font-nunito font-bold"
            style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #D6D6D6", background: "#FFFFFF", fontSize: "14px", color: "#424242", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="font-nunito font-bold text-white"
            style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #F63D68", background: "#F63D68", fontSize: "14px", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer" }}
          >
            Delete Profile
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ── Page ──────────────────────────────────────────────── */
export default function ViewChildPage({ params }: { params: { id: string } }) {
  const child = childData[params.id] ?? childData["1"];
  const [showDelete, setShowDelete] = useState(false);

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
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "10px 14px", borderRadius: "8px",
              background: "#FFFFFF", border: "1px solid #D6D6D6",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", textDecoration: "none",
            }}
          >
            <Edit2 size={16} style={{ color: "#424242" }} />
            <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#424242" }}>Edit</span>
          </Link>
          {/* Delete */}
          <button
            onClick={() => setShowDelete(true)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "10px 14px", borderRadius: "8px",
              background: "#FFF1F3", border: "1px solid #FECDD6",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer",
            }}
          >
            <Trash2 size={16} style={{ color: "#F04438" }} />
            <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F04438" }}>Delete</span>
          </button>
        </div>
      </div>

      {/* Profile Hero */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", height: "160px" }}>
        {/* Circle avatar */}
        <div style={{ width: "160px", height: "160px", borderRadius: "9999px", border: "1px solid #E5E5E5", overflow: "hidden", position: "relative", flexShrink: 0 }}>
          <Image src={child.image} alt={child.name} fill style={{ objectFit: "cover" }} />
        </div>
        {/* Name + pills */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", justifyContent: "center" }}>
          <h1 className="font-nunito font-semibold" style={{ fontSize: "36px", lineHeight: "44px", letterSpacing: "-0.72px", color: "#141414" }}>
            {child.name}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span className="font-nunito font-medium" style={{ fontSize: "16px", lineHeight: "24px", color: "#424242" }}>{child.age}</span>
            <div style={{ width: "1px", height: "20px", background: "#E5E5E5" }} />
            <span className="font-nunito font-medium" style={{ fontSize: "16px", lineHeight: "24px", color: "#424242" }}>{child.gender}</span>
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
              <div style={{ position: "relative", width: "100%", height: "200px", borderRadius: "8px", overflow: "hidden", border: "1px solid #E5E5E5" }}>
                <Image src="/images/parent/story-card-thumbnail.png" alt={s.title} fill style={{ objectFit: "cover" }} />
              </div>
              {/* Title */}
              <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>{s.title}</span>
              {/* Status badge */}
              <span className="font-nunito font-semibold self-start" style={{ fontSize: "12px", lineHeight: "18px", color: s.statusColor, background: s.statusBg, border: `1px solid ${s.statusBorder}`, borderRadius: "9999px", padding: "2px 8px" }}>
                {s.status}
              </span>
              {/* Progress bar */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ flex: 1, height: "8px", borderRadius: "9999px", background: "#F5F5F5", overflow: "hidden" }}>
                  <div style={{ width: `${s.progress}%`, height: "100%", background: "#F63D68", borderRadius: "9999px" }} />
                </div>
                <span className="font-inter font-medium" style={{ fontSize: "14px", lineHeight: "20px", color: "#344054", flexShrink: 0 }}>{s.progress}%</span>
              </div>
              {/* Last read */}
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span className="font-nunito font-medium" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>Last Read:</span>
                <span className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#424242" }}>2 hrs ago</span>
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
                  {/* Badge icon */}
                  <div style={{ width: "88px", height: "88px", borderRadius: "16px", background: "#FFF1F3", position: "relative", overflow: "hidden", flexShrink: 0 }}>
                    <Image src={badge.image} alt={badge.name} fill style={{ objectFit: "contain", padding: "8px" }} />
                  </div>
                  {/* Info */}
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
          name={child.name.split(" ")[0]}
          onCancel={() => setShowDelete(false)}
          onConfirm={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}
