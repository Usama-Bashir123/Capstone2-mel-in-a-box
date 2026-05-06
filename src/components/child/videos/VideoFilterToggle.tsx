"use client";

import { useState } from "react";

const TABS = ["All Videos", "New", "Favorites", "Completed"];

export function VideoFilterToggle() {
  const [active, setActive] = useState("All Videos");

  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: "4px",
        background: "#F5F5F5", borderRadius: "8px", padding: "4px",
      }}
    >
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className="font-nunito font-semibold"
          style={{
            padding: "6px 14px", borderRadius: "6px", fontSize: "14px", lineHeight: "20px",
            border: "none", cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.15s, color 0.15s",
            background: active === tab ? "#FFFFFF" : "transparent",
            color: active === tab ? "#F63D68" : "#525252",
            boxShadow: active === tab ? "0px 1px 3px rgba(16,24,40,0.1)" : "none",
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
