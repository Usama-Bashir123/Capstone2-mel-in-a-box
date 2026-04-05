"use client";

// Premium Shop Page — node 214:12988
// Sections:
//   1. Page heading
//   2. Hero banner (same gradient)
//   3. Main card — filter toggle + search + 3×3 shop card grid + pagination

import { Search, SlidersHorizontal } from "lucide-react";
import { ShopCard } from "@/components/child/shop/ShopCard";
import { ShopFilterToggle } from "@/components/child/shop/ShopFilterToggle";
import { StoriesPagination } from "@/components/child/stories/StoriesPagination";

const shopItems = [
  {
    id: "1",
    badge: "Premium Story",
    title: "Mel and the Snowy Adventure",
    description: "A magical winter-themed story with narration, animations, and star rewards.",
    tags: ["Animation", "Earn Star"],
    price: "$9.99",
    gradient: "linear-gradient(135deg, #BAE6FD 0%, #0284C7 100%)",
    emoji: "❄️",
  },
  {
    id: "2",
    badge: "Premium Story",
    title: "Mel and the Snowy Adventure",
    description: "A magical winter-themed story with narration, animations, and star rewards.",
    tags: ["Animation", "Earn Star"],
    price: "$9.99",
    gradient: "linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)",
    emoji: "🌟",
  },
  {
    id: "3",
    badge: "Premium Story",
    title: "Mel and the Snowy Adventure",
    description: "A magical winter-themed story with narration, animations, and star rewards.",
    tags: ["Animation", "Earn Star"],
    price: "$9.99",
    gradient: "linear-gradient(135deg, #FBCFE8 0%, #EC4899 100%)",
    emoji: "🌸",
  },
  {
    id: "4",
    badge: "Premium Game",
    title: "Party Games Add-on Pack",
    description: "Printable party games inspired by Mel's stories.",
    tags: ["Interactive", "Earn Star"],
    price: "$1.99",
    gradient: "linear-gradient(135deg, #BBF7D0 0%, #059669 100%)",
    emoji: "🎮",
  },
  {
    id: "5",
    badge: "Premium Game",
    title: "Mel and the Snowy Adventure",
    description: "A magical winter-themed story with narration, animations, and star rewards.",
    tags: ["Animation", "Earn Star"],
    price: "$9.99",
    gradient: "linear-gradient(135deg, #C4B5FD 0%, #7C3AED 100%)",
    emoji: "🧩",
  },
  {
    id: "6",
    badge: "Premium Game",
    title: "Mel and the Snowy Adventure",
    description: "A magical winter-themed story with narration, animations, and star rewards.",
    tags: ["Animation", "Earn Star"],
    price: "$9.99",
    gradient: "linear-gradient(135deg, #FED7AA 0%, #EA580C 100%)",
    emoji: "🎯",
  },
  {
    id: "7",
    badge: "Bundle",
    title: "Ultimate Learning Bundle",
    description: "A magical winter-themed story with narration, animations, and star rewards.",
    tags: ["Animation", "Earn Star"],
    price: "$9.99",
    gradient: "linear-gradient(135deg, #fef2dd 0%, #ff7293 100%)",
    emoji: "🎁",
  },
  {
    id: "8",
    badge: "Premium Story",
    title: "Mel and the Snowy Adventure",
    description: "A magical winter-themed story with narration, animations, and star rewards.",
    tags: ["Animation", "Earn Star"],
    price: "$9.99",
    gradient: "linear-gradient(135deg, #BAE6FD 0%, #6366F1 100%)",
    emoji: "🌈",
  },
  {
    id: "9",
    badge: "Premium Game",
    title: "Mel and the Snowy Adventure",
    description: "A magical winter-themed story with narration, animations, and star rewards.",
    tags: ["Animation", "Earn Star"],
    price: "$9.99",
    gradient: "linear-gradient(135deg, #ECFDF5 0%, #10B981 100%)",
    emoji: "🏆",
  },
];

export default function ShopPage() {
  return (
    <div className="flex flex-col gap-5">

      {/* Page heading */}
      <div>
        <h1
          className="font-nunito font-semibold text-ink"
          style={{ fontSize: "30px", lineHeight: "38px" }}
        >
          Premium Shop 🛍️
        </h1>
        {/* Nunito 400 16px lh=24 #525252 */}
        <p
          className="font-nunito font-normal text-ink-subtle mt-0.5"
          style={{ fontSize: "16px", lineHeight: "24px" }}
        >
          Unlock exclusive stories, games, add-ons, and special bundles.
        </p>
      </div>

      {/* Hero banner — same gradient */}
      <div
        className="relative overflow-hidden flex items-center"
        style={{
          background: "linear-gradient(170deg, #fef2dd 0%, #ff7293 100%)",
          borderRadius: "12px",
          height: "260px",
        }}
      >
        {/* Decorative shapes */}
        <div className="absolute top-8 left-16 w-[26px] h-[3px] rounded-full bg-white/40" />
        <div className="absolute top-14 left-8 w-[12px] h-[24px] rounded-full bg-white/30" />
        <div className="absolute top-20 left-4 w-[22px] h-[16px] rounded-full bg-white/25" />
        <div className="absolute top-28 left-2 w-[26px] h-[3px] rounded-full bg-white/30" />

        <div
          className="relative z-10 ml-10"
          style={{ background: "rgba(255,255,255,0.25)", borderRadius: "12px", padding: "24px 32px", maxWidth: "420px" }}
        >
          {/* Nunito 700 36px lh=44 ls=-0.72px white */}
          <h2
            className="font-nunito font-bold text-white"
            style={{ fontSize: "36px", lineHeight: "44px", letterSpacing: "-0.72px" }}
          >
            Hi! I&apos;m Mel!
          </h2>
          {/* Nunito 500 20px lh=30 white */}
          <p
            className="font-nunito font-medium text-white mt-1"
            style={{ fontSize: "20px", lineHeight: "30px" }}
          >
            Discover amazing new adventures! ✨
          </p>
        </div>

        <div className="absolute right-0 bottom-0 w-[340px] h-[270px] flex items-end justify-center">
          <div
            className="w-56 h-56 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <span style={{ fontSize: "90px" }}>🛍️</span>
          </div>
        </div>
      </div>

      {/* Main shop card */}
      <div className="bg-white flex flex-col gap-5" style={{ borderRadius: "12px", padding: "20px" }}>

        {/* Filter + search + filter button */}
        <div className="flex items-center justify-between">
          <ShopFilterToggle />
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search shop..."
                className="pl-9 pr-4 border border-gray-200 font-nunito font-normal text-ink-subtle placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300"
                style={{ width: "320px", height: "40px", borderRadius: "8px", fontSize: "14px", lineHeight: "20px" }}
              />
            </div>
            {/* Filter button */}
            <button
              className="flex items-center gap-2 font-nunito font-semibold hover:opacity-75 transition-opacity"
              style={{
                height: "40px",
                paddingLeft: "16px",
                paddingRight: "16px",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                background: "#FFFFFF",
                fontSize: "14px",
                lineHeight: "20px",
                color: "#424242",
              }}
            >
              <SlidersHorizontal size={16} />
              Filter
            </button>
          </div>
        </div>

        {/* 3×3 grid */}
        <div className="flex flex-col gap-5">
          <div className="flex gap-5">
            {shopItems.slice(0, 3).map((item) => <ShopCard key={item.id} {...item} />)}
          </div>
          <div className="flex gap-5">
            {shopItems.slice(3, 6).map((item) => <ShopCard key={item.id} {...item} />)}
          </div>
          <div className="flex gap-5">
            {shopItems.slice(6, 9).map((item) => <ShopCard key={item.id} {...item} />)}
          </div>
        </div>

        {/* Pagination */}
        <StoriesPagination total={12} />
      </div>
    </div>
  );
}
