"use client";

// Filter: "All" | "Stars" | "Badges" | "Challenges"
// Same toggle pattern — bg #FAFAFA r=10, active=white r=6, inactive=#FAFAFA r=6
// Nunito 500 14px: active rgb(20,20,20), inactive rgb(115,115,115)

import { useState } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "All",        label: "All",        icon: null  },
  { id: "Stars",      label: "Stars",      icon: "⭐"  },
  { id: "Badges",     label: "Badges",     icon: "🏅"  },
  { id: "Challenges", label: "Challenges", icon: "🏆"  },
] as const;

type TabId = typeof tabs[number]["id"];

export function RewardFilterToggle() {
  const [active, setActive] = useState<TabId>("All");

  return (
    <div
      className="flex items-center gap-1 p-1"
      style={{ background: "#FAFAFA", borderRadius: "10px", height: "40px" }}
    >
      {tabs.map(({ id, label, icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={cn(
              "flex items-center justify-center gap-1.5 px-3 transition-all",
              isActive ? "bg-white shadow-sm" : "bg-transparent"
            )}
            style={{
              height: "32px",
              borderRadius: "6px",
              fontFamily: "var(--font-nunito), Nunito, sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "20px",
              color: isActive ? "#141414" : "#737373",
            }}
          >
            {icon && <span style={{ fontSize: "14px" }}>{icon}</span>}
            {label}
          </button>
        );
      })}
    </div>
  );
}
