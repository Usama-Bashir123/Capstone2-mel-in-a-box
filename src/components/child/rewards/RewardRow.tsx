"use client";

// Reward row card — bg #FCFCFC r=12 border #E5E5E5 p=12
// Badge area: 88×88 r=16 bg #FFF1F3 (earned) or #F9FAFB (locked)
// Title: Nunito 600 16px #141414
// Subtitle: Nunito 400 12px #525252
// Status pill: "Earned" bg #ECFDF3 border #ABEFC6 text #067647 / "Lock" bg #F9FAFB border #EAECF0 text #344054
// Earned on: Nunito 500 14px #525252 + date Nunito 600 14px #424242
// "View Detail" + chevron: Nunito 600 16px #F63D68

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface RewardRowProps {
  id: string;
  badgeImage: string;
  title: string;
  description: string;
  status: "earned" | "locked";
  earnedOn?: string;
}

export function RewardRow({ id, badgeImage, title, description, status, earnedOn }: RewardRowProps) {
  const isEarned = status === "earned";

  return (
    <div
      className="flex items-center gap-5"
      style={{
        background: "#FCFCFC",
        borderRadius: "12px",
        border: "1px solid #E5E5E5",
        padding: "12px",
        minHeight: "112px",
      }}
    >
      {/* Badge image — 88×88 */}
      <div
        className="relative shrink-0 flex items-center justify-center overflow-hidden"
        style={{
          width: "88px",
          height: "88px",
          borderRadius: "16px",
          background: isEarned ? "#FFF1F3" : "#F9FAFB",
          border: isEarned ? "1px solid #FECDD3" : "1px solid #EAECF0",
        }}
      >
        <Image src={badgeImage} alt={title} fill style={{ objectFit: "contain", padding: "8px" }} />
      </div>

      {/* Content */}
      <div className="flex items-center justify-between flex-1 min-w-0">

        {/* Left: title + description + meta */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-0.5">
            <p className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>
              {title}
            </p>
            <p className="font-nunito font-normal" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>
              {description}
            </p>
          </div>

          {/* Status + earned date */}
          <div className="flex items-center gap-3">
            {isEarned ? (
              <span
                className="font-nunito font-semibold"
                style={{ fontSize: "12px", lineHeight: "18px", color: "#067647", background: "#ECFDF3", border: "1px solid #ABEFC6", borderRadius: "9999px", padding: "2px 8px" }}
              >
                Earned
              </span>
            ) : (
              <span
                className="font-nunito font-semibold"
                style={{ fontSize: "12px", lineHeight: "18px", color: "#344054", background: "#F9FAFB", border: "1px solid #EAECF0", borderRadius: "9999px", padding: "2px 8px" }}
              >
                Lock
              </span>
            )}

            {isEarned && earnedOn && (
              <>
                <div className="w-px h-4 bg-gray-200" />
                <div className="flex items-center gap-1">
                  <span className="font-nunito font-medium" style={{ fontSize: "14px", lineHeight: "20px", color: "#525252" }}>
                    Earned on:
                  </span>
                  <span className="font-nunito font-semibold" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}>
                    {earnedOn}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* View Detail */}
        <Link
          href={`/child/rewards/${id}`}
          className="flex items-center gap-1 shrink-0 hover:opacity-75 transition-opacity"
        >
          <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#F63D68" }}>
            View Detail
          </span>
          <ChevronRight size={17} style={{ color: "#F63D68" }} />
        </Link>
      </div>
    </div>
  );
}
