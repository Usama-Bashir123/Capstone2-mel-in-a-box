"use client";

// Parent Sidebar — Figma node 214:10673
// Inner card: 311×920 bg white border #E5E5E5 r=16 p=20px 16px gap=32
// Section header label: "Explore" (Nunito 600 16px #141414)
// Nav items: Dashboard, Child Profile, Story Progress, Rewards & Badges,
//            Party Themes, Premium Shop, Purchases & Billing
// Active: bg #FFF5F6, text #F63D68 | Default: text #292929
// Footer: account row (avatar + name/email + logout icon)

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Award,
  PartyPopper,
  ShoppingBag,
  CreditCard,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard",          href: "/parent",                  icon: LayoutDashboard },
  { label: "Child Profile",      href: "/parent/children",         icon: Users },
  { label: "Story Progress",     href: "/parent/story-progress",   icon: BookOpen },
  { label: "Rewards & Badges",   href: "/parent/rewards",          icon: Award },
  { label: "Party Themes",       href: "/parent/party-themes",     icon: PartyPopper },
  { label: "Premium Shop",       href: "/parent/premium-shop",     icon: ShoppingBag },
  { label: "Purchases & Billing",href: "/parent/purchases",        icon: CreditCard },
];

export function ParentSidebar() {
  const pathname = usePathname();

  return (
    <div style={{ width: "351px", padding: "20px", flexShrink: 0 }}>
      <div
        style={{
          width: "311px",
          background: "#FFFFFF",
          border: "1px solid #E5E5E5",
          borderRadius: "16px",
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "920px",
        }}
      >
        {/* Top: Logo + Nav */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 4px" }}>
            <div style={{ position: "relative", width: "24px", height: "24px", flexShrink: 0 }}>
              <Image src="/images/mel-logo.png" alt="Mel in a Box" fill style={{ objectFit: "contain" }} />
            </div>
            <span
              className="font-nunito font-bold"
              style={{ fontSize: "20px", lineHeight: "27px", color: "#F63D68" }}
            >
              Mel in a Box
            </span>
          </div>

          {/* Nav */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <p className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414", padding: "0 12px" }}>
              Explore
            </p>
            <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {navItems.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/parent" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      width: "279px",
                      textDecoration: "none",
                      background: active ? "#FFF5F6" : "transparent",
                      color: active ? "#F63D68" : "#292929",
                      transition: "background 0.15s",
                    }}
                  >
                    <item.icon
                      size={24}
                      style={{ flexShrink: 0, color: active ? "#F63D68" : "#292929" }}
                    />
                    <span
                      className="font-nunito font-semibold"
                      style={{ fontSize: "18px", lineHeight: "28px" }}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer: account row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 8px 0", borderTop: "1px solid #EAECF0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
              }}
            >
              <span className="font-inter font-semibold" style={{ fontSize: "16px", color: "#525252" }}>S</span>
            </div>
            <div>
              <p className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>Sarah</p>
              <p className="font-nunito font-normal" style={{ fontSize: "14px", lineHeight: "20px", color: "#525252" }}>sarah@untitledui.com</p>
            </div>
          </div>
          <button style={{ background: "none", border: "none", padding: "8px", cursor: "pointer", display: "flex" }}>
            <LogOut size={20} style={{ color: "#A3A3A3" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
