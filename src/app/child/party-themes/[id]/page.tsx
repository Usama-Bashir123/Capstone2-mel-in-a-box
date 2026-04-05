"use client";

// Party Themes Detail Page — node 213:15304
// White panel: r=12 p=20 gap=20 border #E5E5E5
//   Title: "Pirate Island Party" Nunito 600 24px #141414
//   Hero image: 298px tall fill-width r=8 cover, title overlaid bottom-left p=32
// Dress Up Ideas: 3 items row gap=6, each row center gap=24, r=12 bg #FCFCFC
//   Label: Nunito 600 18px #424242
// Party Games: 3 cards row gap=24, each col center gap=12 p=12 r=12 bg #FCFCFC border #E5E5E5
//   Image: 161px r=12 cover + rgba(0,0,0,0.2) + circular play button (glassmorphism)
//   Label: Nunito 600 18px #292929 → click opens video modal
// Party Sounds: 2 cards row gap=24
//   Image top: 145px r=12 12 0 0 cover
//   Player bar: row center gap=16 p=12 r=0 0 12 12 bg #FAFAFA width hug
//   Label: Nunito 600 18px #292929 text-center

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Play, Pause } from "lucide-react";
import { PartyVideoModal } from "@/components/child/party-themes/PartyVideoModal";

const themeData: Record<string, {
  title: string;
  heroImage: string;
  dressUp: { label: string; emoji: string }[];
  games: { name: string; image: string }[];
  sounds: { name: string; image: string }[];
}> = {
  default: {
    title: "Pirate Island Party",
    heroImage: "/images/party/party-theme-pirate-island-hero.png",
    dressUp: [
      { label: "Pirate hat",    emoji: "🎩" },
      { label: "Eye patch",     emoji: "🩹" },
      { label: "Striped shirt", emoji: "👕" },
    ],
    games: [
      { name: "Treasure hunt",  image: "/images/party/party-game-1-treasure-hunt.png" },
      { name: "Walk the plank", image: "/images/party/party-game-2-walk-the-plank.png" },
      { name: "Fishing",        image: "/images/party/party-game-3-fishing.png" },
    ],
    sounds: [
      { name: "Ocean waves",  image: "/images/party/party-sound-ocean-waves-pirate-music.png" },
      { name: "Pirate music", image: "/images/party/party-sound-ocean-waves-pirate-music.png" },
    ],
  },
};

export default function PartyThemeDetailPage({ params }: { params: { id: string } }) {
  const theme = themeData[params.id] ?? themeData.default;
  const [videoGame, setVideoGame] = useState<string | null>(null);
  const [playingSound, setPlayingSound] = useState<number | null>(null);

  return (
    <>
      <div className="flex flex-col gap-5">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <Link
            href="/child/party-themes"
            className="font-nunito font-medium hover:opacity-75 transition-opacity"
            style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}
          >
            Party Themes
          </Link>
          <ChevronRight size={14} style={{ color: "#737373" }} />
          <span
            className="font-nunito font-medium"
            style={{ fontSize: "14px", lineHeight: "20px", color: "#F63D68" }}
          >
            {theme.title}
          </span>
        </div>

        {/* Main detail panel — white r=12 p=20 gap=20 border #E5E5E5 */}
        <div
          className="bg-white flex flex-col"
          style={{ borderRadius: "12px", padding: "20px", gap: "20px", border: "1px solid #E5E5E5" }}
        >
          {/* Title — Nunito 600 24px #141414 */}
          <h1
            className="font-nunito font-semibold"
            style={{ fontSize: "24px", lineHeight: "32px", color: "#141414" }}
          >
            {theme.title}
          </h1>

          {/* Hero image — 298px fill-width r=8, title overlaid */}
          <div
            className="relative overflow-hidden flex flex-col justify-end"
            style={{ borderRadius: "8px", height: "298px" }}
          >
            <Image
              src={theme.heroImage}
              alt={theme.title}
              fill
              style={{ objectFit: "cover" }}
            />
            {/* Dark bottom fade for text legibility */}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)" }}
            />
            <div className="relative z-10" style={{ padding: "32px" }}>
              <h2
                className="font-nunito font-semibold text-white"
                style={{ fontSize: "24px", lineHeight: "32px" }}
              >
                {theme.title}
              </h2>
            </div>
          </div>

          {/* ── Dress Up Ideas ── */}
          <div className="flex flex-col gap-5">
            <h3
              className="font-nunito font-semibold"
              style={{ fontSize: "20px", lineHeight: "30px", color: "#292929" }}
            >
              Dress Up Ideas
            </h3>
            <div className="flex gap-1.5">
              {theme.dressUp.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-row items-center justify-center flex-1 gap-6"
                  style={{
                    background: "#FCFCFC",
                    borderRadius: "12px",
                    border: "1px solid #E5E5E5",
                    padding: "20px",
                    minHeight: "161px",
                  }}
                >
                  <span style={{ fontSize: "56px" }}>{item.emoji}</span>
                  <p
                    className="font-nunito font-semibold"
                    style={{ fontSize: "18px", lineHeight: "28px", color: "#424242" }}
                  >
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Party Games ── */}
          <div className="flex flex-col gap-5">
            <h3
              className="font-nunito font-semibold"
              style={{ fontSize: "20px", lineHeight: "30px", color: "#292929" }}
            >
              Party Games
            </h3>
            <div className="flex gap-6">
              {theme.games.map((game, i) => (
                <button
                  key={i}
                  onClick={() => setVideoGame(game.name)}
                  className="flex flex-col items-center flex-1 text-left hover:opacity-90 transition-opacity"
                  style={{
                    background: "#FCFCFC",
                    borderRadius: "12px",
                    border: "1px solid #E5E5E5",
                    padding: "12px",
                    gap: "12px",
                  }}
                >
                  {/* Image with play button overlay */}
                  <div
                    className="relative overflow-hidden w-full"
                    style={{ height: "161px", borderRadius: "12px" }}
                  >
                    <Image
                      src={game.image}
                      alt={game.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    {/* Dark overlay */}
                    <div
                      className="absolute inset-0"
                      style={{ background: "rgba(0,0,0,0.2)" }}
                    />
                    {/* Glassmorphism play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "9999px",
                          background: "rgba(255,255,255,0.9)",
                          backdropFilter: "blur(16px)",
                        }}
                      >
                        <Play size={12} style={{ color: "#141414", fill: "#141414", marginLeft: "2px" }} />
                      </div>
                    </div>
                  </div>

                  {/* Label */}
                  <p
                    className="font-nunito font-semibold w-full text-center"
                    style={{ fontSize: "18px", lineHeight: "28px", color: "#292929" }}
                  >
                    {game.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* ── Party Sounds ── */}
          <div className="flex flex-col gap-5">
            <h3
              className="font-nunito font-semibold"
              style={{ fontSize: "20px", lineHeight: "30px", color: "#292929" }}
            >
              Party Sounds
            </h3>
            <div className="flex gap-6">
              {theme.sounds.map((sound, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  {/* Sound card */}
                  <div style={{ width: "230px" }}>
                    {/* Image top */}
                    <div
                      className="relative overflow-hidden"
                      style={{ height: "145px", borderRadius: "12px 12px 0 0" }}
                    >
                      <Image
                        src={sound.image}
                        alt={sound.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>

                    {/* Player bar */}
                    <div
                      className="flex items-center justify-center gap-4"
                      style={{
                        height: "52px",
                        borderRadius: "0 0 12px 12px",
                        background: "#FAFAFA",
                        padding: "12px",
                        border: "1px solid #E5E5E5",
                        borderTop: "none",
                      }}
                    >
                      <button
                        onClick={() => setPlayingSound(playingSound === i ? null : i)}
                        className="flex items-center justify-center shrink-0"
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "9999px",
                          background: "#F63D68",
                        }}
                      >
                        {playingSound === i
                          ? <Pause size={12} style={{ color: "#FFFFFF", fill: "#FFFFFF" }} />
                          : <Play size={12} style={{ color: "#FFFFFF", fill: "#FFFFFF", marginLeft: "2px" }} />
                        }
                      </button>

                      {/* Waveform bars — decorative */}
                      <div className="flex items-center gap-0.5">
                        {[12, 20, 16, 24, 18, 14, 22, 16, 20, 12, 18, 24, 14, 20, 16].map((h, j) => (
                          <div
                            key={j}
                            style={{
                              width: "3px",
                              height: `${h}px`,
                              borderRadius: "9999px",
                              background: playingSound === i ? "#F63D68" : "#D1D5DB",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Label below card */}
                  <p
                    className="font-nunito font-semibold text-center"
                    style={{ fontSize: "18px", lineHeight: "28px", color: "#292929" }}
                  >
                    {sound.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Preview Modal */}
      {videoGame && (
        <PartyVideoModal
          title={videoGame}
          onClose={() => setVideoGame(null)}
        />
      )}
    </>
  );
}
