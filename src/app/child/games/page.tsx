"use client";

// Games Page — node 213:10714
// bg #FFF5F6, same sidebar+content layout
// 1. Page heading
// 2. Hero banner (same gradient as home, game character image)
// 3. Games list panel — tab filter, search, 3×2 grid, pagination
// 4. Today's Challenge — full-width banner with game image + dark overlay

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Loader2 } from "lucide-react";
import { HeroBanner } from "@/components/child/HeroBanner";
import { GameCard, Difficulty } from "@/components/child/games/GameCard";
import { GameFilterToggle } from "@/components/child/games/GameFilterToggle";
import { StoriesPagination } from "@/components/child/stories/StoriesPagination";
import { GamePreviewModal } from "@/components/child/games/GamePreviewModal";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

interface Game {
  id: string;
  title: string;
  difficulty: Difficulty;
  badges: number;
  starsToEarn: number;
  image: string;
  played: boolean;
}

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [previewGame, setPreviewGame] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    const q = query(collection(db, "games"), where("status", "==", "Published"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.title || "",
          difficulty: (data.difficulty || "Easy") as Difficulty,
          badges: data.badges || 2,
          starsToEarn: data.starsToEarn || 3,
          image: data.icon || "/images/games/game-card-thumbnail.png",
          played: false, // Placeholder
        } as Game;
      });
      setGames(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filtered = games.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase())
  );

  const handlePlay = (id: string) => {
    const game = games.find((g) => g.id === id);
    if (game) setPreviewGame({ id: game.id, title: game.title });
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
            Game Time! 🎮
          </h1>
          <p
            className="font-nunito font-normal mt-0.5"
            style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}
          >
            Play games, earn stars and collect badges!
          </p>
        </div>

        {/* Hero banner */}
        <HeroBanner subtitle="Play games, earn stars and collect badges!" />

        {/* Games list panel — white r=12 p=20 col gap=16 */}
        <div className="bg-white flex flex-col" style={{ borderRadius: "12px", padding: "20px", gap: "16px", border: "1px solid #E5E5E5" }}>

          {/* Filter bar */}
          <div className="flex items-center justify-between">
            <GameFilterToggle />
            {/* Search — 320px r=8 border #E5E5E5 shadow-xs */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search games..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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

          {/* Grid Layout */}
          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="flex items-center justify-center py-20 w-full">
                <Loader2 className="animate-spin text-rose-500" size={40} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex items-center justify-center py-20 w-full text-gray-500 font-nunito">
                No games found.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {filtered.map((g) => (
                  <GameCard key={g.id} {...g} onPlay={handlePlay} />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          <StoriesPagination total={10} />
        </div>

        {/* Today's Challenge — white r=12 p=20 col gap=16 */}
        <div className="bg-white flex flex-col" style={{ borderRadius: "12px", padding: "20px", gap: "16px", border: "1px solid #E5E5E5" }}>

          {/* Header — Nunito 600 20px #292929 */}
          <h3
            className="font-nunito font-semibold"
            style={{ fontSize: "20px", lineHeight: "30px", color: "#292929" }}
          >
            Today&apos;s Challenge!
          </h3>

          {/* Banner — 300px, real image + dark gradient overlay */}
          <div
            className="relative overflow-hidden flex flex-col justify-end"
            style={{ borderRadius: "8px", height: "300px", border: "1px solid #E5E5E5" }}
          >
            {/* Background image */}
            <Image
              src="/images/games/game-today-challenge-profile-7c70a5.png"
              alt="Today's challenge"
              fill
              style={{ objectFit: "cover" }}
            />

            {/* Gradient overlay — left-to-right dark (270deg = right-to-left fade) */}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(270deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)" }}
            />

            {/* Text + button */}
            <div className="relative z-10 flex items-end justify-between" style={{ padding: "32px" }}>
              <div className="flex flex-col gap-2">
                <h4
                  className="font-nunito font-semibold text-white"
                  style={{ fontSize: "30px", lineHeight: "38px" }}
                >
                  Jungle Counting Game
                </h4>
              </div>

              {/* Play Now button */}
              <button
                onClick={() => setPreviewGame({ id: "challenge", title: "Jungle Counting Game" })}
                className="flex items-center justify-center font-nunito font-bold text-white hover:opacity-90 transition-opacity shrink-0"
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  background: "#F63D68",
                  fontSize: "14px",
                  lineHeight: "20px",
                  boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)",
                }}
              >
                Play Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Preview Modal */}
      {previewGame && (
        <GamePreviewModal
          title={previewGame.title}
          onClose={() => setPreviewGame(null)}
        />
      )}
    </>
  );
}

