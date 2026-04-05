"use client";

// Rewards Page — node 213:14081
// 1. Page heading
// 2. Hero banner (HeroBanner)
// 3. 3 gradient stat cards (stars / badges / challenges) with floating illustrations
// 4. Rewards list panel — filter toggle + 5 reward rows + pagination

import { HeroBanner } from "@/components/child/HeroBanner";
import { RewardStatCard } from "@/components/child/rewards/RewardStatCard";
import { RewardFilterToggle } from "@/components/child/rewards/RewardFilterToggle";
import { RewardRow } from "@/components/child/rewards/RewardRow";
import { StoriesPagination } from "@/components/child/stories/StoriesPagination";

const statCards = [
  {
    label: "Total Stars Earned",
    value: "12 Stars",
    gradient: "linear-gradient(270deg, rgba(255,142,138,1) 0%, rgba(245,34,34,1) 100%)",
    illustration: "/images/rewards/card-stars-illustration.png",
    shadow: "drop-shadow(0px 0px 9.6px rgba(255,0,0,0.5))",
  },
  {
    label: "Badges Earned",
    value: "8 badges",
    gradient: "linear-gradient(-88deg, rgba(150,255,197,1) 0%, rgba(0,136,156,1) 100%)",
    illustration: "/images/rewards/card-badges-illustration.png",
    shadow: "drop-shadow(0px 0px 9.6px rgba(4,64,72,0.77))",
  },
  {
    label: "Challenges Completed",
    value: "12 Challenges",
    gradient: "linear-gradient(270deg, rgba(207,2,226,1) 0%, rgba(185,93,255,1) 100%)",
    illustration: "/images/rewards/card-challenges-illustration.png",
    shadow: "drop-shadow(0px 0px 9.6px rgba(76,1,128,1))",
  },
];

const rewards = [
  {
    id: "1",
    badgeImage: "/images/rewards/reward-badge-jungle-explorer.png",
    title: "Jungle Explorer",
    description: 'Awarded for completing "The Magical Jungle" story.',
    status: "earned" as const,
    earnedOn: "Today, 9:10 am",
  },
  {
    id: "2",
    badgeImage: "/images/rewards/reward-badge-star-icon.png",
    title: "Counting Star",
    description: "Earned by scoring 100% in the Counting Jungle mini-game.",
    status: "earned" as const,
    earnedOn: "Today, 9:10 am",
  },
  {
    id: "3",
    badgeImage: "/images/rewards/reward-badge-jungle-explorer-locked.png",
    title: "Counting Star",
    description: "Play letter games to unlock",
    status: "locked" as const,
  },
  {
    id: "4",
    badgeImage: "/images/rewards/reward-badge-jungle-explorer-locked.png",
    title: "Jungle Explorer",
    description: "Finish the Underwater story",
    status: "locked" as const,
  },
  {
    id: "5",
    badgeImage: "/images/rewards/reward-badge-counting-star-earned.png",
    title: "Counting Star",
    description: "Earned by scoring 100% in the Counting Jungle mini-game.",
    status: "earned" as const,
    earnedOn: "Today, 9:10 am",
  },
];

export default function RewardsPage() {
  return (
    <div className="flex flex-col gap-5">

      {/* Page heading */}
      <div>
        <h1 className="font-nunito font-semibold" style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}>
          My Rewards 🏆
        </h1>
        <p className="font-nunito font-normal mt-0.5" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
          Earn stars, collect badges and complete challenges!
        </p>
      </div>

      {/* Hero banner */}
      <HeroBanner subtitle="Earn stars, collect badges and complete challenges!" />

      {/* Stat cards row — 3 gradient cards */}
      <div
        className="bg-white flex flex-col"
        style={{ borderRadius: "12px", padding: "20px", gap: "16px", border: "1px solid #E5E5E5" }}
      >
        <div className="flex gap-4">
          {statCards.map((card) => (
            <RewardStatCard key={card.label} {...card} />
          ))}
        </div>
      </div>

      {/* Rewards list panel */}
      <div
        className="bg-white flex flex-col"
        style={{ borderRadius: "12px", padding: "20px", gap: "24px", border: "1px solid #E5E5E5" }}
      >
        {/* Filter toggle */}
        <RewardFilterToggle />

        {/* Reward rows */}
        <div className="flex flex-col gap-5">
          {rewards.map((reward) => (
            <RewardRow key={reward.id} {...reward} />
          ))}
        </div>

        {/* Pagination */}
        <StoriesPagination total={10} />
      </div>
    </div>
  );
}
