"use client";

// Filter toggle — same container style as stories (bg #FAFAFA r=10)
// Tabs: "All" | "Learning" | "Puzzle" | "Creative"
// Active: bg white r=6, Nunito 500 14px rgb(20,20,20)
// Inactive: bg #FAFAFA r=6, Nunito 500 14px rgb(115,115,115)

import { useState } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "All",      label: "All",      icon: null },
  { id: "Learning", label: "Learning", icon: "👦" },
  { id: "Puzzle",   label: "Puzzle",   icon: "🧩" },
  { id: "Creative", label: "Creative", icon: "🎨" },
] as const;

type TabId = typeof tabs[number]["id"];

interface GameFilterToggleProps {
  value?: TabId;
  onChange?: (tab: TabId) => void;
}

export function GameFilterToggle({ value = "All", onChange }: GameFilterToggleProps) {
  const [active, setActive] = useState<TabId>(value);

  const handleChange = (tab: TabId) => {
    setActive(tab);
    onChange?.(tab);
  };

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
            onClick={() => handleChange(id)}
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
            {icon && <span style={{ fontSize: "16px" }}>{icon}</span>}
            {label}
          </button>
        );
      })}
    </div>
  );
}
