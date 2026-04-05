"use client";

import { Bell, Search, ChevronDown, Volume2 } from "lucide-react";

interface ChildHeaderProps {
  stars?: number;
  awards?: number;
}

export function ChildHeader({ stars = 12, awards = 3 }: ChildHeaderProps) {
  return (
    <header className="bg-white px-5 flex items-center justify-between shrink-0 border-b border-gray-100"
      style={{ height: "68px" }}>

      {/* Search — Nunito 400 16px lh=24px, placeholder rgb(115,115,115) */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          className="pl-9 pr-4 w-[320px] border border-gray-200 rounded-lg font-nunito font-normal text-gray-500 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300"
          style={{ fontSize: "16px", lineHeight: "24px", height: "44px" }}
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">

        {/* Stars — Nunito 600 14px lh=20px rgb(66,66,66) */}
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3" style={{ height: "40px" }}>
          <span
            className="font-nunito font-semibold text-ink-muted"
            style={{ fontSize: "14px", lineHeight: "20px" }}
          >
            {stars}
          </span>
          <span className="text-base">⭐</span>
        </div>

        {/* Awards — Nunito 600 14px lh=20px rgb(66,66,66) */}
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3" style={{ height: "40px" }}>
          <span
            className="font-nunito font-semibold text-ink-muted"
            style={{ fontSize: "14px", lineHeight: "20px" }}
          >
            {String(awards).padStart(2, "0")}
          </span>
          <span className="text-base">🏆</span>
        </div>

        {/* Volume */}
        <button
          className="flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          style={{ width: "40px", height: "40px" }}
        >
          <Volume2 size={19} />
        </button>

        {/* Notification */}
        <button
          className="relative flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          style={{ width: "40px", height: "40px" }}
        >
          <Bell size={19} />
          {/* Red dot — rgb(217,44,32) = error-600 */}
          <span className="absolute top-[7px] right-[7px] w-[6px] h-[6px] bg-error-600 rounded-full" />
        </button>

        {/* Language — Inter 600 14px lh=20px rgb(52,64,84) */}
        <button
          className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 hover:bg-gray-50 transition-colors"
          style={{ height: "40px" }}
        >
          <span className="text-sm">🇺🇸</span>
          <span
            className="font-inter font-semibold text-ink-badge"
            style={{ fontSize: "14px", lineHeight: "20px" }}
          >
            English
          </span>
          <ChevronDown size={16} className="text-gray-500" />
        </button>
      </div>
    </header>
  );
}
