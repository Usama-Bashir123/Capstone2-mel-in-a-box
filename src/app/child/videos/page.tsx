"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Play } from "lucide-react";
import { HeroBanner } from "@/components/child/HeroBanner";
import { VideoCard } from "@/components/child/videos/VideoCard";
import { VideoFilterToggle } from "@/components/child/videos/VideoFilterToggle";
import { WatchVideoModal } from "@/components/child/videos/WatchVideoModal";

const videos = [
  { id: "1", title: "Underwater Kingdom",    duration: "8:24",  progress: 50, lastWatched: "2 hrs ago",   image: "/images/stories/story-1.png", description: "Dive deep into the ocean and discover amazing sea creatures.", stars: 3 },
  { id: "2", title: "The Brave Little Fox",   duration: "6:15",  progress: 65, lastWatched: "Yesterday",   image: "/images/stories/story-2.png", description: "Follow the brave little fox on an exciting adventure through the forest.", stars: 4 },
  { id: "3", title: "Stars and Planets",      duration: "10:42", progress: 20, lastWatched: "3 days ago",  image: "/images/stories/story-3.png", description: "Explore the solar system and learn about each planet.", stars: 3 },
  { id: "4", title: "Jungle Friends",         duration: "7:58",  progress: 80, lastWatched: "Today",       image: "/images/stories/story-4.png", description: "Meet friendly jungle animals and learn about their habitat.", stars: 5 },
  { id: "5", title: "Pirate Island",          duration: "9:10",  progress: 35, lastWatched: "1 week ago",  image: "/images/stories/story-5.png", description: "Sail the seven seas and find the hidden treasure.", stars: 4 },
  { id: "6", title: "Magic Garden",           duration: "5:33",  progress: 10, lastWatched: "Not started", image: "/images/stories/story-6.png", description: "Discover the secrets of an enchanted garden full of magic.", stars: 3 },
];

export default function VideosPage() {
  const [watchingVideo, setWatchingVideo] = useState<typeof videos[number] | null>(null);

  const handleWatch = (id: string) => {
    const video = videos.find((v) => v.id === id);
    if (video) setWatchingVideo(video);
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
            Video Stories! 🎬
          </h1>
          <p
            className="font-nunito font-normal mt-0.5"
            style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}
          >
            Watch and learn with fun video stories!
          </p>
        </div>

        {/* Hero banner */}
        <HeroBanner subtitle="Watch and learn with fun video stories!" />

        {/* Videos list panel */}
        <div className="bg-white flex flex-col" style={{ borderRadius: "12px", padding: "20px", gap: "16px" }}>

          {/* Filter bar + search */}
          <div className="flex items-center justify-between">
            <VideoFilterToggle />
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search videos..."
                className="pl-9 pr-4 font-nunito font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300"
                style={{
                  width: "320px", height: "40px", borderRadius: "8px",
                  fontSize: "14px", lineHeight: "20px", color: "#141414",
                  border: "1px solid #E5E5E5",
                  boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)",
                }}
              />
            </div>
          </div>

          {/* 2 rows × 3 cards */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              {videos.slice(0, 3).map((v) => (
                <VideoCard key={v.id} {...v} onWatch={handleWatch} />
              ))}
            </div>
            <div className="flex gap-4">
              {videos.slice(3, 6).map((v) => (
                <VideoCard key={v.id} {...v} onWatch={handleWatch} />
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid #F5F5F5" }}>
            <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>
              Showing 1–6 of 12 videos
            </span>
            <div className="flex items-center gap-2">
              {[1, 2].map((page) => (
                <button
                  key={page}
                  className="font-nunito font-semibold"
                  style={{
                    width: "36px", height: "36px", borderRadius: "8px",
                    border: page === 1 ? "1px solid #F63D68" : "1px solid #E5E5E5",
                    background: page === 1 ? "#FFF1F3" : "#FFFFFF",
                    color: page === 1 ? "#F63D68" : "#525252",
                    fontSize: "14px", cursor: "pointer",
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Video of the Day */}
        <div className="bg-white flex flex-col" style={{ borderRadius: "12px", padding: "20px", gap: "16px" }}>
          <h3
            className="font-nunito font-semibold"
            style={{ fontSize: "20px", lineHeight: "30px", color: "#292929" }}
          >
            Featured Video of the Day
          </h3>

          {/* Banner card */}
          <div
            className="relative overflow-hidden flex flex-col justify-end"
            style={{ borderRadius: "8px", height: "300px", cursor: "pointer" }}
            onClick={() => handleWatch("1")}
          >
            <Image
              src="/images/stories/featured-story.png"
              alt="Featured video"
              fill
              style={{ objectFit: "cover" }}
              priority
            />

            {/* Dark gradient */}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)" }}
            />

            {/* Centred play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                style={{
                  width: "64px", height: "64px", borderRadius: "50%",
                  background: "rgba(255,255,255,0.9)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0px 8px 24px rgba(0,0,0,0.3)",
                }}
              >
                <Play size={28} style={{ color: "#F63D68", marginLeft: "3px" }} fill="#F63D68" />
              </div>
            </div>

            {/* Text + button */}
            <div className="relative z-10 flex items-end justify-between" style={{ padding: "24px" }}>
              <div className="flex flex-col gap-1">
                <p className="font-nunito font-semibold text-white" style={{ fontSize: "12px", lineHeight: "18px" }}>
                  Watch a New Story
                </p>
                <h4 className="font-nunito font-semibold text-white" style={{ fontSize: "30px", lineHeight: "38px" }}>
                  Discover a magical new story
                </h4>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleWatch("1"); }}
                className="flex items-center gap-2 font-nunito font-bold text-white hover:opacity-90 transition-opacity shrink-0"
                style={{ padding: "10px 16px", borderRadius: "8px", background: "#F63D68", fontSize: "14px", lineHeight: "20px", border: "none", cursor: "pointer" }}
              >
                <Play size={15} fill="white" /> Watch Story
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Watch Video Modal */}
      {watchingVideo && (
        <WatchVideoModal
          video={watchingVideo}
          onClose={() => setWatchingVideo(null)}
        />
      )}
    </>
  );
}
