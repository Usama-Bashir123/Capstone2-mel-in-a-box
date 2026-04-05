"use client";

// Rewards Detail Page
// Breadcrumb: "Rewards" > "Reward {name}" (earned) or "Reward Details" (locked)
// Action bar: 12 stars pill + 03 badges pill + volume pill
//
// UNLOCKED state (node 213:14975):
//   Card "Reward": section title Nunito 600 18px + badge 126×126 r=16 #FFF1F3 + name below
//   Fields grid: Status (pill), Awarded On, Story Completed, Description
//
// LOCKED state (node 213:15204):
//   Card "Badge Detail": badge 56×56 r=8 #FFF1F3 + two info fields
//   Card "Unlock Requirements": 4 bullet text items Nunito 400 14px #141414

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Volume2, Star } from "lucide-react";

const rewardData: Record<string, {
  name: string;
  badgeImage: string;
  status: "earned" | "locked";
  awardedOn?: string;
  storyCompleted?: string;
  description?: string;
  unlockRequirements?: string[];
}> = {
  "1": {
    name: "Jungle Explorer",
    badgeImage: "/images/rewards/reward-detail-badge-jungle-explorer.png",
    status: "earned",
    awardedOn: "Yesterday",
    storyCompleted: "100%",
    description: 'Awarded for completing all pages of "The Magical Jungle" story.',
  },
  "2": {
    name: "Counting Star",
    badgeImage: "/images/rewards/reward-badge-star-icon.png",
    status: "earned",
    awardedOn: "Today, 9:10 am",
    storyCompleted: "100%",
    description: "Earned by scoring 100% in the Counting Jungle mini-game.",
  },
  "3": {
    name: "Counting Star",
    badgeImage: "/images/rewards/reward-badge-jungle-explorer-locked.png",
    status: "locked",
    unlockRequirements: [
      'Play the "Match the Letters" game',
      "Complete Level 1",
      "Score 10 correct matches in Level 2",
      "Finish the game without hints (optional bonus)",
    ],
  },
  "4": {
    name: "Jungle Explorer",
    badgeImage: "/images/rewards/reward-badge-jungle-explorer-locked.png",
    status: "locked",
    unlockRequirements: [
      'Play the "Match the Letters" game',
      "Complete Level 1",
      "Score 10 correct matches in Level 2",
      "Finish the game without hints (optional bonus)",
    ],
  },
  "5": {
    name: "Counting Star",
    badgeImage: "/images/rewards/reward-badge-counting-star-earned.png",
    status: "earned",
    awardedOn: "Today, 9:10 am",
    storyCompleted: "100%",
    description: "Earned by scoring 100% in the Counting Jungle mini-game.",
  },
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-nunito font-medium" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}>
        {label}
      </span>
      {children}
    </div>
  );
}

export default function RewardDetailPage({ params }: { params: { id: string } }) {
  const reward = rewardData[params.id] ?? rewardData["1"];
  const isEarned = reward.status === "earned";

  return (
    <div className="flex flex-col gap-5">

      {/* Breadcrumb + action pills */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/child/rewards" className="font-nunito font-bold hover:opacity-75 transition-opacity" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}>
            Rewards
          </Link>
          <ChevronRight size={14} style={{ color: "#737373" }} />
          <span className="font-nunito font-bold" style={{ fontSize: "14px", lineHeight: "20px", color: "#F63D68" }}>
            {isEarned ? `Reward ${reward.name}` : "Reward Details"}
          </span>
        </div>

        {/* Action pills */}
        <div className="flex items-center gap-2">
          {/* Stars pill */}
          <div
            className="flex items-center gap-1"
            style={{ padding: "10px 12px", height: "40px", borderRadius: "12px", background: "#FFFFFF", border: "1px solid #E5E5E5", boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)" }}
          >
            <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#424242" }}>12</span>
            <Star size={20} style={{ color: "#F63D68", fill: "#F63D68" }} />
          </div>
          {/* Badges pill */}
          <div
            className="flex items-center gap-1"
            style={{ padding: "10px 12px", height: "40px", borderRadius: "12px", background: "#FFFFFF", border: "1px solid #E5E5E5", boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)" }}
          >
            <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#424242" }}>03</span>
            <span style={{ fontSize: "18px" }}>🏅</span>
          </div>
          {/* Volume pill */}
          <div
            className="flex items-center justify-center"
            style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#FFFFFF", border: "1px solid #E5E5E5", boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)" }}
          >
            <Volume2 size={20} style={{ color: "#424242" }} />
          </div>
        </div>
      </div>

      {/* ── UNLOCKED STATE ── */}
      {isEarned && (
        <div
          className="bg-white flex flex-col"
          style={{ borderRadius: "12px", padding: "20px", gap: "24px", border: "1px solid #E5E5E5" }}
        >
          {/* Section title */}
          <h3 className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>
            Reward
          </h3>

          {/* Badge + fields row */}
          <div className="flex gap-6 items-start">
            {/* Left: badge + name */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div
                className="relative overflow-hidden"
                style={{ width: "126px", height: "126px", borderRadius: "16px", background: "#FFF1F3" }}
              >
                <Image src={reward.badgeImage} alt={reward.name} fill style={{ objectFit: "contain", padding: "12px" }} />
              </div>
              <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>
                {reward.name}
              </span>
            </div>

            {/* Right: fields grid */}
            <div className="flex flex-col gap-5 flex-1">
              {/* Row 1: Status + Awarded On + Story Completed */}
              <div className="flex gap-5">
                <Field label="Status">
                  <span
                    className="font-nunito font-semibold self-start"
                    style={{ fontSize: "12px", lineHeight: "18px", color: "#067647", background: "#ECFDF3", border: "1px solid #ABEFC6", borderRadius: "9999px", padding: "2px 8px" }}
                  >
                    Earned
                  </span>
                </Field>
                <Field label="Awarded On">
                  <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>
                    {reward.awardedOn}
                  </span>
                </Field>
                <Field label="Story Completed">
                  <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>
                    {reward.storyCompleted}
                  </span>
                </Field>
              </div>

              {/* Row 2: Description (full width) */}
              <Field label="Description">
                <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>
                  {reward.description}
                </span>
              </Field>
            </div>
          </div>
        </div>
      )}

      {/* ── LOCKED STATE ── */}
      {!isEarned && (
        <>
          {/* Badge Detail card */}
          <div
            className="bg-white flex flex-col"
            style={{ borderRadius: "12px", padding: "20px", gap: "24px", border: "1px solid #E5E5E5" }}
          >
            <h3 className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>
              Badge Detail
            </h3>

            <div className="flex items-center gap-5">
              {/* Smaller badge — 56×56 r=8 */}
              <div
                className="relative shrink-0 overflow-hidden"
                style={{ width: "56px", height: "56px", borderRadius: "8px", background: "#FFF1F3" }}
              >
                <Image src={reward.badgeImage} alt={reward.name} fill style={{ objectFit: "contain", padding: "6px" }} />
              </div>

              <div className="flex gap-5 flex-1">
                <Field label="Badge Name">
                  <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>
                    {reward.name}
                  </span>
                </Field>
                <Field label="Status">
                  <span
                    className="font-nunito font-semibold self-start"
                    style={{ fontSize: "12px", lineHeight: "18px", color: "#344054", background: "#F9FAFB", border: "1px solid #EAECF0", borderRadius: "9999px", padding: "2px 8px" }}
                  >
                    Lock
                  </span>
                </Field>
              </div>
            </div>
          </div>

          {/* Unlock Requirements card */}
          <div
            className="bg-white flex flex-col"
            style={{ borderRadius: "12px", padding: "20px", gap: "24px", border: "1px solid #E5E5E5" }}
          >
            <h3 className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>
              Unlock Requirements
            </h3>
            <div className="flex flex-col gap-3">
              {reward.unlockRequirements?.map((req, i) => (
                <p key={i} className="font-nunito font-normal" style={{ fontSize: "14px", lineHeight: "20px", color: "#141414" }}>
                  {req}
                </p>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
