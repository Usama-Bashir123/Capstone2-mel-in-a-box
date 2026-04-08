"use client";

// Badge Details — Earned: Figma node 214:12357 | Locked: Figma node 214:12604
//
// EARNED (214:12357):
//   Breadcrumb: "Rewards & Badges" > "Badge Details"
//   Card "Reward": 126×126px badge image + badge name + 4 info fields
//     (Status=Earned pill, Awarded On, Story Completed, Stars Earned)
//
// LOCKED (214:12604):
//   Breadcrumb: "Rewards & Badges" > "Badge Details"
//   Card "Badge Detail": 56×56px badge image + Title field + Status=Lock pill
//   Card "Unlock Requirements": bullet list of 4 requirements

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

/* ── Badge data ────────────────────────────────────────── */
type BadgeState = "earned" | "locked";

interface BadgeDetail {
  name: string;
  state: BadgeState;
  image: string;
  detailImage: string;
  // earned fields
  awardedOn?: string;
  storyCompleted?: string;
  starsEarned?: string;
  // locked fields
  unlockRequirements?: string[];
}

const badgeData: Record<string, BadgeDetail> = {
  "1": {
    name: "Jungle Explorer",
    state: "earned",
    image: "/images/rewards/reward-badge-jungle-explorer.png",
    detailImage: "/images/parent/rewards/badge-jungle-explorer-detail.png",
    awardedOn: "Yesterday",
    storyCompleted: "100%",
    starsEarned: "3 Stars",
  },
  "2": {
    name: "Counting Star",
    state: "earned",
    image: "/images/rewards/reward-badge-counting-star-earned.png",
    detailImage: "/images/rewards/reward-badge-counting-star-earned.png",
    awardedOn: "Today, 9:10 am",
    storyCompleted: "100%",
    starsEarned: "3 Stars",
  },
  "3": {
    name: "Counting Star",
    state: "locked",
    image: "/images/rewards/reward-badge-counting-star-earned.png",
    detailImage: "/images/rewards/reward-badge-counting-star-earned.png",
    unlockRequirements: [
      'Play the "Counting Jungle" mini-game',
      "Complete Level 1",
      "Score 10 correct matches in Level 2",
      "Finish the game without hints (optional bonus)",
    ],
  },
  "4": {
    name: "Letter Hero",
    state: "locked",
    image: "/images/rewards/reward-badge-jungle-explorer-locked.png",
    detailImage: "/images/parent/rewards/badge-letter-hero-locked.png",
    unlockRequirements: [
      'Play the "Match the Letters" game',
      "Complete Level 1",
      "Score 10 correct matches in Level 2",
      "Finish the game without hints (optional bonus)",
    ],
  },
};

/* ── Earned pill ───────────────────────────────────────── */
function EarnedPill() {
  return (
    <span
      className="font-nunito font-semibold"
      style={{
        fontSize: "12px", lineHeight: "18px",
        color: "#067647", background: "#ECFDF3",
        border: "1px solid #ABEFC6",
        borderRadius: "9999px", padding: "2px 8px",
      }}
    >
      Earned
    </span>
  );
}

function LockedPill() {
  return (
    <span
      className="font-nunito font-semibold"
      style={{
        fontSize: "12px", lineHeight: "18px",
        color: "#344054", background: "#F9FAFB",
        border: "1px solid #EAECF0",
        borderRadius: "9999px", padding: "2px 8px",
      }}
    >
      Lock
    </span>
  );
}

/* ── Field pair ────────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
      <span className="font-nunito font-medium" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}>
        {label}
      </span>
      <div>{children}</div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────── */
export default function BadgeDetailPage({ params }: { params: { id: string } }) {
  const badge = badgeData[params.id] ?? badgeData["1"];
  const isEarned = badge.state === "earned";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Breadcrumb ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Link
          href="/parent/rewards"
          className="font-nunito font-bold"
          style={{ fontSize: "14px", lineHeight: "20px", color: "#424242", textDecoration: "none" }}
        >
          Rewards & Badges
        </Link>
        <ChevronRight size={16} style={{ color: "#737373" }} />
        <span className="font-nunito font-bold" style={{ fontSize: "14px", lineHeight: "20px", color: "#F63D68" }}>
          Badge Details
        </span>
      </div>

      {/* ══════════════════════════════════════════════════ */}
      {isEarned ? (
        /* ── EARNED state: node 214:12357 ── */
        <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <span className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>
            Reward
          </span>

          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
            {/* Badge image — 126×126px */}
            <div
              style={{
                width: "126px",
                height: "126px",
                borderRadius: "16px",
                background: "#FFF1F3",
                position: "relative",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <Image
                src={badge.detailImage}
                alt={badge.name}
                fill
                style={{ objectFit: "contain", padding: "12px" }}
              />
            </div>

            {/* Info fields */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Badge name */}
              <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>
                {badge.name}
              </span>

              {/* Fields row 1: Status + Awarded On */}
              <div style={{ display: "flex", gap: "20px" }}>
                <Field label="Status">
                  <EarnedPill />
                </Field>
                <Field label="Awarded On">
                  <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>
                    {badge.awardedOn}
                  </span>
                </Field>
              </div>

              {/* Fields row 2: Story Completed + Stars Earned */}
              <div style={{ display: "flex", gap: "20px" }}>
                <Field label="Story Completed">
                  <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>
                    {badge.storyCompleted}
                  </span>
                </Field>
                <Field label="Stars Earned">
                  <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>
                    {badge.starsEarned}
                  </span>
                </Field>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── LOCKED state: node 214:12604 ── */
        <>
          {/* Card 1 — Badge Detail */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <span className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>
              Badge Detail
            </span>

            <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
              {/* Badge image — 56×56px */}
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "8px",
                  background: "#FFF1F3",
                  position: "relative",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <Image
                  src={badge.detailImage}
                  alt={badge.name}
                  fill
                  style={{ objectFit: "contain", padding: "6px" }}
                />
              </div>

              {/* Fields */}
              <div style={{ flex: 1, display: "flex", gap: "20px" }}>
                <Field label="Title">
                  <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>
                    {badge.name}
                  </span>
                </Field>
                <Field label="Status">
                  <LockedPill />
                </Field>
              </div>
            </div>
          </div>

          {/* Card 2 — Unlock Requirements */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <span className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>
              Unlock Requirements
            </span>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {badge.unlockRequirements?.map((req, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  {/* Bullet */}
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#F63D68",
                      flexShrink: 0,
                      marginTop: "6px",
                    }}
                  />
                  <span className="font-nunito font-normal" style={{ fontSize: "14px", lineHeight: "20px", color: "#141414" }}>
                    {req}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  );
}
