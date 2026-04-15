"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Gamepad2,
  Gift,
  PartyPopper,
  Settings,
  LogOut,
} from "lucide-react";

// Nav items match Figma sidebar exactly — Dashboard, Stories, Games, Party Themes, Rewards & Badges
const navItems = [
  { label: "Dashboard",        href: "/child",               icon: LayoutDashboard },
  { label: "Stories",          href: "/child/stories",       icon: BookOpen },
  { label: "Games",            href: "/child/games",         icon: Gamepad2 },
  { label: "Party Themes",     href: "/child/party-themes",  icon: PartyPopper },
  { label: "Rewards",          href: "/child/rewards",       icon: Gift },
];

export function ChildSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const email = user?.email || "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };


  return (
    <aside className="w-[311px] min-h-screen bg-white flex flex-col py-5 px-4 shrink-0 border-r border-gray-100">

      {/* Logo — layout_KB8ZGD: row gap=8, Figma logo image + "Mel in a Box" text */}
      <div className="flex items-center gap-2 px-3 mb-6">
        {/* Logo image — fill_RTNK0I: /images/mel-logo.png, 24×24 */}
        <div className="relative shrink-0" style={{ width: "24px", height: "24px" }}>
          <Image
            src="/images/mel-logo.png"
            alt="Mel in a Box logo"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        {/* style_S745YF: Nunito 700 20px lh=27px Rosé/500 = #F63D68, stroke Rosé/25 */}
        <span
          className="font-nunito font-bold"
          style={{ fontSize: "20px", lineHeight: "27px", color: "#F63D68" }}
        >
          Mel in a Box
        </span>
      </div>

      {/* Section label — Nunito 600 16px lh=24px rgb(20,20,20) */}
      <p
        className="font-nunito font-semibold text-ink px-3 mb-2"
        style={{ fontSize: "16px", lineHeight: "24px" }}
      >
        Explore
      </p>

      {/* Nav items — layout_1U54IK: row gap=8 px=12 py=8, w=279 */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/child" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                active
                  ? "bg-rose-25 text-rose-500"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              {/* Icon 24×24 — active: Rosé/500, default: Gray true/500 */}
              <item.icon
                size={24}
                className={cn("shrink-0", active ? "text-rose-500" : "text-gray-500")}
              />
              {/* Text lg/Semibold = Nunito 600 18px lh=28px */}
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

      {/* Footer */}
      <div className="flex flex-col gap-0.5 mt-4">
        <Link
          href="/child/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
            pathname.startsWith("/child/settings")
              ? "bg-rose-25 text-rose-500"
              : "text-gray-700 hover:bg-gray-50"
          )}
        >
          <Settings
            size={24}
            className={cn("shrink-0", pathname.startsWith("/child/settings") ? "text-rose-500" : "text-gray-500")}
          />
          <span
            className="font-nunito font-semibold"
            style={{ fontSize: "18px", lineHeight: "28px" }}
          >
            Settings
          </span>
        </Link>

        {/* Account row */}
        <div className="flex items-center justify-between mt-3 px-3 py-3 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-3" style={{ minWidth: 0 }}>
            {/* Avatar — gray-100 bg, Inter 600 16px initials */}
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden border border-gray-200">
              {user?.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photoURL}
                  alt="Avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span
                  className="font-inter font-semibold text-gray-500"
                  style={{ fontSize: "16px", lineHeight: "24px" }}
                >
                  {initials}
                </span>
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              {/* Nunito 600 16px lh=24px rgb(40,40,40) */}
              <p
                className="font-nunito font-semibold text-ink-secondary"
                style={{ fontSize: "16px", lineHeight: "24px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px" }}
              >
                {displayName}
              </p>
              {/* Nunito 400 14px lh=20px rgb(82,82,82) */}
              <p
                className="font-nunito font-normal text-ink-subtle"
                style={{ fontSize: "14px", lineHeight: "20px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px" }}
              >
                {email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
}
