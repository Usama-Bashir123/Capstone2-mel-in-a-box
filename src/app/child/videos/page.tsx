"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Play, Loader2 } from "lucide-react";
import { HeroBanner } from "@/components/child/HeroBanner";
import { VideoCard } from "@/components/child/videos/VideoCard";
import { VideoFilterToggle } from "@/components/child/videos/VideoFilterToggle";
import { WatchVideoModal } from "@/components/child/videos/WatchVideoModal";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";

interface Video {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string; // Placeholder for now
  progress: number; // Placeholder for now
  lastWatched: string; // Placeholder for now
  stars: number; // Placeholder for now
}



export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [watchingVideo, setWatchingVideo] = useState<Video | null>(null);

  useEffect(() => {
    const q = query(collection(db, "videos"), where("status", "==", "Published"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.title || "",
          description: data.description || "",
          videoUrl: data.videoUrl || "",
          thumbnailUrl: data.thumbnailUrl || "/images/stories/story-1.png", // Default placeholder
          duration: "8:24", // Placeholder
          progress: 0,      // Placeholder
          lastWatched: "Not started", // Placeholder
          stars: 3,         // Placeholder
        } as Video;
      });
      setVideos(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filtered = videos.filter((v) =>
    v.title.toLowerCase().includes(search.toLowerCase())
  );

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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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

          {/* 2 rows × 3 cards (Dynamic) */}
          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="flex items-center justify-center py-10 w-full">
                <Loader2 className="animate-spin text-rose-500" size={32} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex items-center justify-center py-10 w-full text-gray-500 font-nunito">
                No videos found.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {filtered.map((v) => (
                  <VideoCard key={v.id} {...v} image={v.thumbnailUrl} onWatch={handleWatch} />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid #F5F5F5" }}>
            <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>
              Showing {filtered.length} of {videos.length} videos
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
            onClick={() => filtered[0] && handleWatch(filtered[0].id)}
          >
            <Image
              src={filtered[0]?.thumbnailUrl || "/images/stories/featured-story.png"}
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
                onClick={(e) => { e.stopPropagation(); if (filtered[0]) handleWatch(filtered[0].id); }}
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
