"use client";

// Stories Page — node 213:10423
// bg #FFF5F6, same sidebar+content layout as Home
// Hero banner: identical to home (HeroBanner component)
// Stories list panel (213:10587): white r=12 p=20, col gap=16
//   Tab bar: All Stories | New | Favorites | Completed
//   Search: 320px r=8 border #E5E5E5 shadow-xs
//   2 rows × 3 cards (row gap=16)
//   Pagination
// Featured Story panel (213:10697): white r=12 p=20, col gap=16
//   Header: "Featured Story of the Day" Nunito 600 20px #292929
//   Banner: 300px tall, dark gradient overlay, featured-story.png
//   "Start Reading" button Rosé/500

import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { HeroBanner } from "@/components/child/HeroBanner";
import { StoryCard } from "@/components/child/stories/StoryCard";
import { StoryFilterToggle } from "@/components/child/stories/StoryFilterToggle";
import { StoriesPagination } from "@/components/child/stories/StoriesPagination";
import { StoryPreviewModal } from "@/components/child/stories/StoryPreviewModal";

const stories = [
  { id: "1", title: "Underwater Kingdom", progress: 50, lastRead: "2 hrs ago", image: "/images/stories/story-1.png" },
  { id: "2", title: "The Brave Little Fox", progress: 65, lastRead: "Yesterday", image: "/images/stories/story-2.png" },
  { id: "3", title: "Stars and Planets", progress: 20, lastRead: "3 days ago", image: "/images/stories/story-3.png" },
  { id: "4", title: "Jungle Friends", progress: 80, lastRead: "Today", image: "/images/stories/story-4.png" },
  { id: "5", title: "Pirate Island", progress: 35, lastRead: "1 week ago", image: "/images/stories/story-5.png" },
  { id: "6", title: "Magic Garden", progress: 10, lastRead: "Not started", image: "/images/stories/story-6.png" },
];

export default function StoriesPage() {
  const [previewStory, setPreviewStory] = useState<{ id: string; title: string } | null>(null);

  const handleContinue = (id: string) => {
    const story = stories.find((s) => s.id === id);
    if (story) setPreviewStory({ id: story.id, title: story.title });
  };

  return (
    <>
      <div className="flex flex-col gap-5">

        {/* Page heading */}
        <div>
          <h1
            className="font-nunito font-semibold"
            style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}
          >
            Stories Time! 📚
          </h1>
          <p
            className="font-nunito font-normal mt-0.5"
            style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}
          >
            Stories help you learn and imagine!
          </p>
        </div>

        {/* Hero banner — same as home */}
        <HeroBanner subtitle="Stories help you learn and imagine!" />

        {/* Stories list panel — white r=12 p=20 col gap=16 */}
        <div className="bg-white flex flex-col" style={{ borderRadius: "12px", padding: "20px", gap: "16px" }}>

          {/* Filter bar */}
          <div className="flex items-center justify-between">
            <StoryFilterToggle />
            {/* Search — 320px r=8 border #E5E5E5 shadow-xs */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search stories..."
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

          {/* 2 rows × 3 cards — row gap=16 */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              {stories.slice(0, 3).map((s) => (
                <StoryCard key={s.id} {...s} onContinue={handleContinue} />
              ))}
            </div>
            <div className="flex gap-4">
              {stories.slice(3, 6).map((s) => (
                <StoryCard key={s.id} {...s} onContinue={handleContinue} />
              ))}
            </div>
          </div>

          {/* Pagination */}
          <StoriesPagination total={10} />
        </div>

        {/* Featured Story of the Day — white r=12 p=20 col gap=16 */}
        <div className="bg-white flex flex-col" style={{ borderRadius: "12px", padding: "20px", gap: "16px" }}>

          {/* Header — Nunito 600 20px #292929 */}
          <h3
            className="font-nunito font-semibold"
            style={{ fontSize: "20px", lineHeight: "30px", color: "#292929" }}
          >
            Featured Story of the Day
          </h3>

          {/* Banner card — 300px tall, real image + dark gradient overlay */}
          <div
            className="relative overflow-hidden flex flex-col justify-end"
            style={{ borderRadius: "8px", height: "300px" }}
          >
            {/* Background image */}
            <Image
              src="/images/stories/featured-story.png"
              alt="Featured story"
              fill
              style={{ objectFit: "cover" }}
            />

            {/* Dark gradient overlay — rgba(0,0,0,0) → rgba(0,0,0,1) */}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)" }}
            />

            {/* Text + button */}
            <div className="relative z-10 flex items-end justify-between" style={{ padding: "24px" }}>
              <div className="flex flex-col gap-1">
                {/* "Read a New Story" — Nunito 600 12px white */}
                <p
                  className="font-nunito font-semibold text-white"
                  style={{ fontSize: "12px", lineHeight: "18px" }}
                >
                  Read a New Story
                </p>
                {/* "Discover a magical new story" — Nunito 600 30px white */}
                <h4
                  className="font-nunito font-semibold text-white"
                  style={{ fontSize: "30px", lineHeight: "38px" }}
                >
                  Discover a magical new story
                </h4>
              </div>

              {/* Start Reading button — Rosé/500 p=8px 12px r=8 */}
              <button
                onClick={() => setPreviewStory({ id: "featured", title: "Discover a magical new story" })}
                className="flex items-center justify-center font-nunito font-bold text-white hover:opacity-90 transition-opacity shrink-0"
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  background: "#F63D68",
                  fontSize: "14px",
                  lineHeight: "20px",
                }}
              >
                Start Reading
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stories Preview Modal */}
      {previewStory && (
        <StoryPreviewModal
          title={previewStory.title}
          onClose={() => setPreviewStory(null)}
        />
      )}
    </>
  );
}
