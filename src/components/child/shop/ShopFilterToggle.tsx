"use client";

// Filter: "All" | "Premium Stories" | "Premium Games" | "Bundle" | "Add-ons"
// Container: bg #FAFAFA r=10 h=36; active=white r=6; Nunito 500 14px

import { useState } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "All",             label: "All"             },
  { id: "PremiumStories",  label: "Premium Stories" },
  { id: "PremiumGames",    label: "Premium Games"   },
  { id: "Bundle",          label: "Bundle"          },
  { id: "AddOns",          label: "Add-ons"         },
] as const;

type TabId = typeof tabs[number]["id"];

export function ShopFilterToggle() {
  const [active, setActive] = useState<TabId>("All");

  return (
    <div
      className="flex items-center gap-1 p-1"
      style={{ background: "#FAFAFA", borderRadius: "10px", height: "40px" }}
    >
      {tabs.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={cn(
              "flex items-center justify-center px-3 transition-all whitespace-nowrap",
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
            {label}
          </button>
        );
      })}
    </div>
  );
}
