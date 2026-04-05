// Game Detail Page — node 213:13104
// Title: "Jungle Counting Game" Nunito 600 24px rgb(20,20,20)
// Image gallery: 4 screenshots 300×240 each
// Info section: stars, difficulty badge, play time
// "Play Game" button: #F53D68 h=36 Nunito 700 14px

import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";

const gameData: Record<string, {
  title: string;
  emoji: string;
  gradient: string;
  screenshots: { emoji: string; gradient: string }[];
  stars: number;
  difficulty: "Easy" | "Medium" | "Hard";
  playTime: string;
  description: string;
}> = {
  default: {
    title: "Jungle Counting Game",
    emoji: "🦁",
    gradient: "linear-gradient(135deg, #BBF7D0 0%, #059669 100%)",
    screenshots: [
      { emoji: "🦁", gradient: "linear-gradient(135deg, #BBF7D0 0%, #059669 100%)" },
      { emoji: "🌿", gradient: "linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)" },
      { emoji: "🐘", gradient: "linear-gradient(135deg, #C4B5FD 0%, #7C3AED 100%)" },
      { emoji: "🦋", gradient: "linear-gradient(135deg, #BAE6FD 0%, #0284C7 100%)" },
    ],
    stars: 3,
    difficulty: "Easy",
    playTime: "10 mint",
    description: "Count jungle animals and earn stars as you play through this fun adventure!",
  },
};

export default function GameDetailPage({ params }: { params: { id: string } }) {
  const game = gameData[params.id] ?? gameData.default;

  const difficultyStyle =
    game.difficulty === "Easy"
      ? { color: "#05764B", background: "#ECFDF2" }
      : game.difficulty === "Medium"
      ? { color: "#92400E", background: "#FEF3C7" }
      : { color: "#991B1B", background: "#FEE2E2" };

  return (
    <div className="flex flex-col gap-5">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1">
        <Link
          href="/child/games"
          className="font-nunito font-bold hover:opacity-75 transition-opacity"
          style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}
        >
          Games
        </Link>
        <ChevronRight size={14} className="text-gray-400" />
        <span
          className="font-nunito font-bold"
          style={{ fontSize: "14px", lineHeight: "20px", color: "#F53D68" }}
        >
          {game.title}
        </span>
      </div>

      {/* Main card */}
      <div className="bg-white flex flex-col gap-6" style={{ borderRadius: "12px", padding: "20px" }}>

        {/* Title */}
        <h1
          className="font-nunito font-semibold text-ink"
          style={{ fontSize: "24px", lineHeight: "32px" }}
        >
          {game.title}
        </h1>

        {/* Screenshot gallery */}
        <div className="flex gap-5 overflow-x-auto">
          {game.screenshots.map((shot, i) => (
            <div
              key={i}
              className="flex items-center justify-center shrink-0"
              style={{
                width: "300px",
                height: "240px",
                borderRadius: "12px",
                background: shot.gradient,
              }}
            >
              <span style={{ fontSize: "80px", opacity: 0.5 }}>{shot.emoji}</span>
            </div>
          ))}
        </div>

        {/* Info section */}
        <div className="flex flex-col gap-4">
          <p
            className="font-nunito font-semibold text-ink"
            style={{ fontSize: "16px", lineHeight: "24px" }}
          >
            Info:
          </p>

          <div className="flex items-center gap-6 flex-wrap">
            {/* Stars */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: game.stars }).map((_, i) => (
                  <Star key={i} size={16} fill="#F59E0B" stroke="none" />
                ))}
              </div>
              <span
                className="font-nunito"
                style={{ fontSize: "12px", lineHeight: "18px", color: "#424242" }}
              >
                Stars you can earn: {game.stars}
              </span>
            </div>

            {/* Difficulty */}
            <div className="flex items-center gap-2">
              <span
                className="font-nunito font-semibold"
                style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}
              >
                Difficulty
              </span>
              <span
                className="font-nunito font-semibold"
                style={{
                  fontSize: "12px",
                  lineHeight: "18px",
                  borderRadius: "9999px",
                  padding: "2px 10px",
                  ...difficultyStyle,
                }}
              >
                {game.difficulty}
              </span>
            </div>

            {/* Play time */}
            <span
              className="font-nunito"
              style={{ fontSize: "12px", lineHeight: "18px", color: "#424242" }}
            >
              Play time {game.playTime}
            </span>
          </div>

          {/* Description */}
          <p
            className="font-nunito font-normal"
            style={{ fontSize: "14px", lineHeight: "20px", color: "#525252" }}
          >
            {game.description}
          </p>
        </div>

        {/* Play Game button */}
        <div>
          <Link
            href={`/child/games/${params.id}/play`}
            className="inline-flex items-center justify-center font-nunito font-bold text-white hover:opacity-90 transition-opacity"
            style={{
              height: "36px",
              paddingLeft: "24px",
              paddingRight: "24px",
              borderRadius: "8px",
              background: "#F53D68",
              fontSize: "14px",
              lineHeight: "20px",
            }}
          >
            Play Game
          </Link>
        </div>
      </div>
    </div>
  );
}
