"use client";

// Child Profiles — Empty state: node 214:12955 | List state: node 214:13667
// Empty: centered illustration + heading + body text
// List: filter tabs (All/3-4/5-6/7+) + search + 3 child cards in a row
// Each card: full-width 200px image + name + age/gender + "View Profile" button

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Plus, Users } from "lucide-react";

const children = [
  { id: "1", name: "Mia John",  age: "4 Years", gender: "Female", ageGroup: "3-4", image: "/images/parent/children/child-profile-1.png", stars: 12, stories: 5  },
  { id: "2", name: "David John", age: "7 Years", gender: "Male",   ageGroup: "7+",  image: "/images/parent/children/child-profile-2.png", stars: 8,  stories: 3  },
  { id: "3", name: "Noah John",  age: "5 Years", gender: "Male",   ageGroup: "5-6", image: "/images/parent/children/child-profile-3.png", stars: 15, stories: 7  },
];

const tabs = ["All", "3-4", "5-6", "7+"];

/* ── Filter toggle ─────────────────────────────────────── */
function FilterToggle({ active, onChange }: { active: string; onChange: (t: string) => void }) {
  return (
    <div style={{ padding: "4px", background: "#FAFAFA", borderRadius: "10px", display: "flex", gap: "4px" }}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className="font-nunito font-medium"
          style={{
            padding: "4px 12px",
            borderRadius: "6px",
            fontSize: "14px",
            lineHeight: "20px",
            border: "none",
            cursor: "pointer",
            color: active === tab ? "#141414" : "#737373",
            background: active === tab ? "#FFFFFF" : "#FAFAFA",
            boxShadow: active === tab ? "0px 1px 2px rgba(16,24,40,0.06), 0px 1px 3px rgba(16,24,40,0.1)" : "none",
            transition: "all 0.15s ease",
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

/* ── Child Card ────────────────────────────────────────── */
function ChildCard({ id, name, age, gender, image, stars, stories }: typeof children[0]) {
  return (
    <div style={{ flex: 1, border: "1px solid #E5E5E5", borderRadius: "12px", padding: "12px", display: "flex", flexDirection: "column", gap: "12px", background: "#FFFFFF" }}>
      {/* Profile image */}
      <div style={{ position: "relative", width: "100%", height: "200px", borderRadius: "8px", overflow: "hidden", border: "1px solid #E5E5E5", flexShrink: 0 }}>
        <Image src={image} alt={name} fill style={{ objectFit: "cover" }} />
      </div>

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Name */}
        <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>{name}</span>

        {/* Meta row */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {[{ label: "Age:", val: age }, { label: "Stars:", val: String(stars) }, { label: "Stories:", val: String(stories) }].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {i > 0 && <div style={{ width: "1px", height: "16px", background: "#D6D6D6", marginRight: "2px" }} />}
              <span className="font-nunito font-medium" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>{item.label}</span>
              <span className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#424242" }}>{item.val}</span>
            </div>
          ))}
        </div>

        {/* Gender pill */}
        <span
          className="font-nunito font-medium self-start"
          style={{ fontSize: "12px", lineHeight: "18px", color: "#424242", background: "#F9FAFB", border: "1px solid #EAECF0", borderRadius: "9999px", padding: "2px 8px" }}
        >
          {gender}
        </span>

        {/* View Profile */}
        <Link
          href={`/parent/children/${id}`}
          className="font-nunito font-bold text-white"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            height: "40px", borderRadius: "8px", background: "#F63D68",
            fontSize: "14px", lineHeight: "20px",
            boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
            textDecoration: "none",
          }}
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────── */
export default function ChildProfilesPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  // Toggle between empty/list for demo — defaults to list
  const [hasChildren] = useState(true);

  const filtered = children.filter((c) => {
    const matchTab = activeTab === "All" || c.ageGroup === activeTab;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <h1 className="font-nunito font-semibold" style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}>
            Child Profiles
          </h1>
          <p className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
            Manage your children&apos;s accounts and track their learning progress.
          </p>
        </div>
        <Link
          href="/parent/children/add"
          className="font-nunito font-bold text-white"
          style={{
            display: "flex", alignItems: "center", gap: "4px",
            padding: "10px 14px", borderRadius: "8px",
            background: "#F63D68", border: "1px solid #F63D68",
            fontSize: "14px", lineHeight: "20px",
            boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
            textDecoration: "none", whiteSpace: "nowrap",
          }}
        >
          <Plus size={16} />
          Add Child
        </Link>
      </div>

      {/* Main card */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #EAECF0",
          borderRadius: "12px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
          minHeight: "500px",
        }}
      >
        {/* Card header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <FilterToggle active={activeTab} onChange={setActiveTab} />

          {/* Search */}
          <div style={{ position: "relative", width: "320px" }}>
            <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#A3A3A3" }} />
            <input
              type="text"
              placeholder="Search children..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
              style={{
                width: "100%", height: "44px", paddingLeft: "42px", paddingRight: "14px",
                borderRadius: "8px", border: "1px solid #E5E5E5",
                fontSize: "14px", color: "#141414",
                background: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
              }}
            />
          </div>
        </div>

        {/* Empty state */}
        {!hasChildren || filtered.length === 0 ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px", padding: "40px 0" }}>
            <div style={{ width: "148px", height: "148px", borderRadius: "999px", background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={56} style={{ color: "#D6D6D6" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", maxWidth: "448px", textAlign: "center" }}>
              <span className="font-nunito font-semibold" style={{ fontSize: "20px", lineHeight: "30px", color: "#141414" }}>
                You haven&apos;t added any Children yet
              </span>
              <span className="font-nunito font-normal" style={{ fontSize: "14px", lineHeight: "20px", color: "#525252" }}>
                Create a child profile to access personalized stories, track progress, and unlock learning insights.
              </span>
            </div>
            <Link
              href="/parent/children/add"
              className="font-nunito font-bold text-white"
              style={{
                display: "flex", alignItems: "center", gap: "4px",
                padding: "10px 14px", borderRadius: "8px",
                background: "#F63D68", border: "1px solid #F63D68",
                fontSize: "14px", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
                textDecoration: "none",
              }}
            >
              <Plus size={16} /> Add First Child
            </Link>
          </div>
        ) : (
          /* Children grid */
          <div style={{ display: "flex", gap: "20px" }}>
            {filtered.map((child) => (
              <ChildCard key={child.id} {...child} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
