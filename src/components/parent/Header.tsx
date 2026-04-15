"use client";

// Parent Header — Figma node 263:26939
// bg white border #E5E5E5 r=12 p=12 gap=32 h=hug w=1069
// Search: 320px input r=8 border #E5E5E5 shadow-xs icon-leading
// Actions: 40×40 circle buttons border #E5E5E5 shadow-xs

import Link from "next/link";
import { Search, Bell, Settings } from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";

export function ParentHeader() {
  const { user } = useAuth();
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

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
        marginBottom: "0",
      }}
    >
      {/* Search — 320px, icon-leading, r=8, border #E5E5E5 */}
      <div style={{ position: "relative", width: "320px" }}>
        <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#A3A3A3" }} />
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

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Notification */}
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
          <span style={{ position: "absolute", top: "8px", right: "8px", width: "6px", height: "6px", borderRadius: "50%", background: "#D92D20" }} />
        </button>

        {/* Settings */}
        <Link
          href="/parent/settings"
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
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          <Settings size={18} style={{ color: "#424242" }} />
        </Link>

        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#F2F4F7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden",
              border: "1px solid #E5E5E5",
            }}
          >
            {user?.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.photoURL}
                alt="Avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span className="font-inter font-semibold" style={{ fontSize: "16px", color: "#525252" }}>{initials}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
