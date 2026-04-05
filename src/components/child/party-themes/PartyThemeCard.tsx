"use client";

// Party Theme Card — node 213:13465
// Full-bleed image card: 332×317, r=12, border 1px #FFFFFF
// Image fills entire card + linear-gradient(180deg, rgba(0,0,0,0)→rgba(0,0,0,1)) overlay
// Layout: col justify-end gap=16 p=12
// Title: Nunito 600 18px white
// Subtitle: Nunito 400 12px white
// Icon strip: 3× 42×42 icon frames row gap=2
// "Explore" button: #F63D68 fill-width r=8 p=10px 14px Nunito 700 14px white

import Image from "next/image";
import Link from "next/link";

interface PartyThemeCardProps {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  icons: string[];
}

export function PartyThemeCard({ id, title, subtitle, image, icons }: PartyThemeCardProps) {
  return (
    <div
      className="relative flex flex-col justify-end flex-1 overflow-hidden"
      style={{ height: "317px", borderRadius: "12px", border: "1px solid #FFFFFF", padding: "12px", gap: "16px" }}
    >
      {/* Background image */}
      <Image src={image} alt={title} fill style={{ objectFit: "cover" }} />

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)" }}
      />

      {/* Text block */}
      <div className="relative z-10 flex flex-col gap-1">
        <p className="font-nunito font-semibold text-white" style={{ fontSize: "18px", lineHeight: "28px" }}>
          {title}
        </p>
        <p className="font-nunito font-normal text-white" style={{ fontSize: "12px", lineHeight: "18px", opacity: 0.9 }}>
          {subtitle}
        </p>
      </div>

      {/* Icon strip */}
      <div className="relative z-10 flex items-center gap-0.5">
        {icons.map((icon, i) => (
          <div
            key={i}
            className="flex items-center justify-center shrink-0"
            style={{ width: "42px", height: "42px", background: "rgba(255,255,255,0.15)", borderRadius: "8px", fontSize: "22px" }}
          >
            {icon}
          </div>
        ))}
      </div>

      {/* Explore button */}
      <Link
        href={`/child/party-themes/${id}`}
        className="relative z-10 flex items-center justify-center font-nunito font-bold text-white hover:opacity-90 transition-opacity"
        style={{
          padding: "10px 14px",
          borderRadius: "8px",
          background: "#F63D68",
          border: "1px solid #F63D68",
          fontSize: "14px",
          lineHeight: "20px",
          boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)",
        }}
      >
        Explore
      </Link>
    </div>
  );
}
