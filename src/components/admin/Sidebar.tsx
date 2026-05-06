"use client";

// Admin Sidebar — Figma node 243:24295
// Inner card: 311×920 bg white border #E5E5E5 r=16 p=20px 16px
// Nav items: Dashboard, Stories, Games, Users, Purchases, Assets Library, Activity Log
// Active: bg #FFF5F6, text #F63D68 | Default: text #292929
// Footer: Settings nav item + account row (avatar + name/email + logout)

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import {
  LayoutDashboard,
  BookOpen,
  Gamepad2,
  Users,
  CreditCard,
  FolderOpen,
  Activity,
  Settings,
  LogOut,
  Film,
  PartyPopper,
} from "lucide-react";

const navItems = [
  { label: "Dashboard",      href: "/admin",                icon: LayoutDashboard, exact: true },
  { label: "Stories",        href: "/admin/stories",        icon: BookOpen },
  { label: "Video Stories",  href: "/admin/videos",         icon: Film },
  { label: "Games",          href: "/admin/games",          icon: Gamepad2 },
  { label: "Users",          href: "/admin/users",          icon: Users },
  { label: "Purchases",      href: "/admin/purchases",      icon: CreditCard },
  { label: "Assets Library", href: "/admin/assets",         icon: FolderOpen },
  { label: "Party Themes",   href: "/admin/party-themes",   icon: PartyPopper },
  { label: "Activity Log",   href: "/admin/activity",  icon: Activity },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Admin";
  const email = user?.email || "";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "A";

  const handleLogout = async () => {
    await signOut();
    router.push("/admin/login");
  };

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
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Image src="/images/mel-logo-icon.png" alt="" width={72} height={72} style={{ width: "72px", height: "72px", objectFit: "contain", flexShrink: 0 }} />
            <Image src="/images/mel-logo-text.png" alt="Mel in a Box" width={180} height={72} style={{ flex: 1, height: "72px", objectFit: "contain", objectPosition: "left" }} />
          </div>

          {/* Nav */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <p
              className="font-nunito font-semibold"
              style={{ fontSize: "16px", lineHeight: "24px", color: "#141414", padding: "0 12px" }}
            >
              Explore
            </p>
            <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {navItems.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(item.href + "/");
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

        {/* Bottom: Settings + account row */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Settings */}
          {(() => {
            const active = pathname === "/admin/settings" || pathname.startsWith("/admin/settings/");
            return (
              <Link
                href="/admin/settings"
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
                  marginBottom: "8px",
                }}
              >
                <Settings size={24} style={{ flexShrink: 0, color: active ? "#F63D68" : "#292929" }} />
                <span className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px" }}>
                  Settings
                </span>
              </Link>
            );
          })()}

          {/* Account row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "24px 8px 0",
              borderTop: "1px solid #EAECF0",
            }}
          >
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
              <span className="font-inter font-semibold" style={{ fontSize: "16px", color: "#525252" }}>
                {initials}
              </span>
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                className="font-nunito font-semibold"
                style={{
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: "#292929",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "160px",
                }}
              >
                {displayName}
              </p>
              <p
                className="font-nunito font-normal"
                style={{
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "#525252",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "160px",
                }}
              >
                {email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            style={{ background: "none", border: "none", padding: "8px", cursor: "pointer", display: "flex" }}
          >
            <LogOut size={20} style={{ color: "#A3A3A3" }} />
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}
