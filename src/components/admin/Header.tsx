"use client";

// Admin Header — Figma node 263:26026
// bg white border #E5E5E5 r=12 p=12 gap=32 w=1069
// Search: 320px input r=8 border #E5E5E5 shadow-xs icon-leading
// Actions: Bell, Settings, Avatar (40×40)

import { Search, Bell } from "lucide-react";

export function AdminHeader() {
  return (
    <header
      className="bg-white"
      style={{
        borderRadius: "12px",
        border: "1px solid #E5E5E5",
        padding: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
      }}
    >
      {/* Search */}
      <div style={{ position: "relative", width: "320px" }}>
        <Search
          size={16}
          style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#A3A3A3",
          }}
        />
        <input
          type="text"
          placeholder="Search"
          className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
          style={{
            width: "100%",
            height: "44px",
            paddingLeft: "42px",
            paddingRight: "14px",
            borderRadius: "8px",
            border: "1px solid #E5E5E5",
            fontSize: "16px",
            lineHeight: "24px",
            color: "#141414",
            background: "#FFFFFF",
            boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)",
          }}
        />
      </div>

      {/* Actions — notification only */}
      <button
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "20px",
          border: "1px solid #E5E5E5",
          background: "#FFFFFF",
          boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          cursor: "pointer",
        }}
      >
        <Bell size={18} style={{ color: "#424242" }} />
        <span
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#D92D20",
          }}
        />
      </button>
    </header>
  );
}
