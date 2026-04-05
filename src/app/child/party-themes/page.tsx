"use client";

// Party Themes Page — node 213:13177
// 1. Page heading
// 2. Hero banner (HeroBanner component)
// 3. Main card — filter toggle + search + 2 rows × 3 full-image theme cards
// 4. Today's Special Theme — real image banner with dark overlay

import { Search } from "lucide-react";
import Image from "next/image";
import { HeroBanner } from "@/components/child/HeroBanner";
import { PartyThemeCard } from "@/components/child/party-themes/PartyThemeCard";
import { PartyThemeFilterToggle } from "@/components/child/party-themes/PartyThemeFilterToggle";
import { StoriesPagination } from "@/components/child/stories/StoriesPagination";

const themes = [
  {
    id: "1",
    title: "Space Explorer Party",
    subtitle: "Rockets, planets, and stars!",
    image: "/images/party/party-theme-card-space-explorer.png",
    icons: ["🚀", "🪐", "⭐"],
  },
  {
    id: "2",
    title: "Jungle Adventure Party",
    subtitle: "Animals, leaves, and jungle fun!",
    image: "/images/party/party-theme-card-jungle-adventure.png",
    icons: ["🦁", "🌿", "🐒"],
  },
  {
    id: "3",
    title: "Pirate Island Party",
    subtitle: "Treasure, ships, and pirate games",
    image: "/images/party/party-theme-card-pirate-island.png",
    icons: ["☠️", "⚓", "🗺️"],
  },
  {
    id: "4",
    title: "Underwater Kingdom Party",
    subtitle: "Dive deep into ocean magic!",
    image: "/images/party/party-theme-card-underwater-kingdom.png",
    icons: ["🐠", "🐙", "🌊"],
  },
  {
    id: "5",
    title: "Space Explorer Party",
    subtitle: "Rockets, planets, and stars!",
    image: "/images/party/party-theme-card-space-explorer.png",
    icons: ["🚀", "🪐", "⭐"],
  },
  {
    id: "6",
    title: "Jungle Adventure Party",
    subtitle: "Animals, leaves, and jungle fun!",
    image: "/images/party/party-theme-card-jungle-adventure.png",
    icons: ["🦁", "🌿", "🐒"],
  },
];

export default function PartyThemesPage() {
  return (
    <div className="flex flex-col gap-5">

      {/* Page heading */}
      <div>
        <h1
          className="font-nunito font-semibold"
          style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}
        >
          Party Fun Time! 🎉
        </h1>
        <p
          className="font-nunito font-normal mt-0.5"
          style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}
        >
          Pick a theme and imagine your perfect party!
        </p>
      </div>

      {/* Hero banner */}
      <HeroBanner subtitle="Explore party themes and have fun!" />

      {/* Main themes card — white r=12 p=20 gap=16 border #E5E5E5 */}
      <div
        className="bg-white flex flex-col"
        style={{ borderRadius: "12px", padding: "20px", gap: "16px", border: "1px solid #E5E5E5" }}
      >
        {/* Filter + search */}
        <div className="flex items-center justify-between">
          <PartyThemeFilterToggle />
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search themes..."
              className="pl-9 pr-4 font-nunito font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300"
              style={{
                width: "320px",
                height: "40px",
                borderRadius: "8px",
                fontSize: "14px",
                lineHeight: "20px",
                color: "#141414",
                border: "1px solid #E5E5E5",
                boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)",
              }}
            />
          </div>
        </div>

        {/* 2 rows × 3 cards — gap=16 */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            {themes.slice(0, 3).map((t) => <PartyThemeCard key={t.id} {...t} />)}
          </div>
          <div className="flex gap-4">
            {themes.slice(3, 6).map((t) => <PartyThemeCard key={t.id + "-b"} {...t} />)}
          </div>
        </div>

        {/* Pagination */}
        <StoriesPagination total={10} />
      </div>

      {/* Today's Special Theme — white r=12 p=20 gap=16 border #E5E5E5 */}
      <div
        className="bg-white flex flex-col"
        style={{ borderRadius: "12px", padding: "20px", gap: "16px", border: "1px solid #E5E5E5" }}
      >
        {/* Header — Nunito 600 20px #292929 */}
        <h3
          className="font-nunito font-semibold"
          style={{ fontSize: "20px", lineHeight: "30px", color: "#292929" }}
        >
          Today&apos;s Special Theme
        </h3>

        {/* Banner — 300px, real image + dark left-fade overlay */}
        <div
          className="relative overflow-hidden flex flex-col justify-end"
          style={{ borderRadius: "8px", height: "300px", border: "1px solid #E5E5E5" }}
        >
          <Image
            src="/images/party/party-themes-todays-special-theme-bg.png"
            alt="Today's special theme"
            fill
            style={{ objectFit: "cover" }}
          />
          {/* Gradient: dark on left, transparent on right */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(270deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)" }}
          />

          <div className="relative z-10 flex items-end justify-between" style={{ padding: "32px" }}>
            <div className="flex flex-col gap-2">
              <h4
                className="font-nunito font-semibold text-white"
                style={{ fontSize: "30px", lineHeight: "38px" }}
              >
                Jungle Adventure Party
              </h4>
            </div>

            <button
              className="flex items-center justify-center font-nunito font-bold text-white hover:opacity-90 transition-opacity shrink-0"
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                background: "#F63D68",
                fontSize: "14px",
                lineHeight: "20px",
                boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)",
              }}
            >
              Start Exploring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
