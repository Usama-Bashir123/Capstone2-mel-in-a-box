"use client";

// Toggle filter — bg rgb(250,250,250) r=10
// Active tab: bg white r=6, Nunito 500 14px lh=20 rgb(20,20,20)
// Inactive tab: bg rgb(250,250,250) r=6, Nunito 500 14px lh=20 rgb(115,115,115)

import { useState } from "react";
import { cn } from "@/lib/utils";

const tabs = ["All Stories", "New", "Favorites", "Completed"] as const;
type Tab = typeof tabs[number];

interface StoryFilterToggleProps {
  value?: Tab;
  onChange?: (tab: Tab) => void;
}

export function StoryFilterToggle({ value = "All Stories", onChange }: StoryFilterToggleProps) {
  const [active, setActive] = useState<Tab>(value);

  const handleChange = (tab: Tab) => {
    setActive(tab);
    onChange?.(tab);
  };

  return (
    <div
      className="flex items-center gap-1 p-1"
      style={{ background: "#FAFAFA", borderRadius: "10px", height: "36px" }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab;
        return (
          <button
            key={tab}
            onClick={() => handleChange(tab)}
            className={cn(
              "flex items-center justify-center px-3 transition-all",
              isActive ? "bg-white shadow-sm" : "bg-transparent"
            )}
            style={{
              height: "28px",
              borderRadius: "6px",
              // Nunito 500 14px lh=20
              fontFamily: "var(--font-nunito), Nunito, sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "20px",
              color: isActive ? "#141414" : "#737373",
            }}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
