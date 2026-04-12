"use client";

import { HeroBanner } from "@/components/child/HeroBanner";
import { ContinueStoryCard } from "@/components/child/ContinueStoryCard";
import { QuickActionCards } from "@/components/child/QuickActionCards";
import { RewardGoals } from "@/components/child/RewardGoals";
import { RecentActivity } from "@/components/child/RecentActivity";
import { RecommendedSection } from "@/components/child/RecommendedSection";
import { useDashboard } from "@/hooks/use-dashboard";
import { Loader2 } from "lucide-react";

export default function ChildHomePage() {
  const { data: dashboard, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-rose-500" size={40} />
        <p className="font-nunito font-semibold text-ink-subtle">Loading your dashboard...</p>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <p className="font-nunito font-semibold text-rose-600 text-lg">Oops! Something went wrong.</p>
        <p className="font-nunito text-ink-subtle">We couldn&apos;t load your adventure. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Page heading */}
      <div>
        <h1
          className="font-nunito font-semibold text-ink"
          style={{ fontSize: "30px", lineHeight: "38px" }}
        >
          {dashboard.child.greeting}
        </h1>
        <p
          className="font-nunito font-normal text-ink-subtle mt-0.5"
          style={{ fontSize: "16px", lineHeight: "24px" }}
        >
          {dashboard.child.subtitle}
        </p>
      </div>

      <HeroBanner subtitle={dashboard.child.heroSubtitle} />

      <div className="grid grid-cols-2 gap-5">
        <ContinueStoryCard story={dashboard.activeStory} />
        <QuickActionCards />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <RewardGoals goals={dashboard.goals} />
        <RecentActivity activities={dashboard.activities} />
      </div>

      <RecommendedSection stories={dashboard.recommendedStories} />
    </div>
  );
}
