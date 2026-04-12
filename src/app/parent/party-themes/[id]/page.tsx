"use client";

// Party Theme Detail — Figma node 214:17159
// Breadcrumb: "Party Theme" > "{theme title}" (Rosé/500)
// Card 1 "Basic Information":
//   - 263px hero image (fill-width, r=12, objectFit cover)
//   - Age Group + Title + Description
//   - "Included Files" list: each item has filename + PDF/PNG badge
//   - Actions: "Download Individuals" (secondary gray) + "Download All" (primary rose)
// Card 2 "Add More Fun to Your Party":
//   - 2 add-on cards side by side (gap 24px), each: 98×98px image + title + desc + price + Buy Now btn

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

/* ── Data ──────────────────────────────────────────────── */
interface IncludedFile {
  name: string;
  type: "PDF" | "PNG";
}

interface AddOn {
  title: string;
  description: string;
  price: string;
}

interface ThemeDetail {
  title: string;
  ageGroup: string;
  description: string;
  image: string;
  files: IncludedFile[];
  addOns: AddOn[];
}

const themeData: Record<string, ThemeDetail> = {
  "1": {
    title: "Jungle Adventure Party",
    ageGroup: "3-7",
    description: "Transform your home into a magical jungle with animal masks, vine decorations, and themed games.",
    image: "/images/parent/party-themes/party-jungle-adventure.png",
    files: [
      { name: "Rocket craft template", type: "PDF" },
      { name: "Decorations kit",       type: "PDF" },
      { name: "Space helmets",         type: "PDF" },
      { name: "Cake toppers",          type: "PNG" },
      { name: "Coloring sheets",       type: "PDF" },
    ],
    addOns: [
      { title: "Live Remote Storytelling Session", description: "30-minute virtual session hosted by Mel.", price: "$9.99" },
      { title: "Extra Printable Games Pack",       description: "Includes 5 bonus jungle games.",           price: "$2.99" },
    ],
  },
  "2": {
    title: "Space Explorer Party",
    ageGroup: "3-7",
    description: "Launch into space with rocket crafts, space helmets, and planet-themed cupcake toppers.",
    image: "/images/parent/party-themes/party-space-explorer.png",
    files: [
      { name: "Rocket craft template", type: "PDF" },
      { name: "Decorations kit",       type: "PDF" },
      { name: "Space helmets",         type: "PDF" },
      { name: "Cake toppers",          type: "PNG" },
      { name: "Coloring sheets",       type: "PDF" },
    ],
    addOns: [
      { title: "Live Remote Storytelling Session", description: "30-minute virtual session hosted by Mel.", price: "$9.99" },
      { title: "Extra Printable Games Pack",       description: "Includes 5 bonus space games.",            price: "$2.99" },
    ],
  },
  "3": {
    title: "Pirate Island Party",
    ageGroup: "3-7",
    description: "A high-energy pirate-themed party with treasure hunts, pirate hats, and map-based activities.",
    image: "/images/parent/party-themes/party-pirate-island.png",
    files: [
      { name: "Treasure map activity", type: "PDF" },
      { name: "Pirate hats template",  type: "PDF" },
      { name: "Bandana craft sheet",   type: "PDF" },
      { name: "Cake toppers",          type: "PNG" },
      { name: "Party games sheet",     type: "PDF" },
    ],
    addOns: [
      { title: "Live Remote Storytelling Session", description: "30-minute virtual session hosted by Mel.", price: "$9.99" },
      { title: "Extra Printable Games Pack",       description: "Includes 5 bonus pirate games.",           price: "$2.99" },
    ],
  },
  "4": {
    title: "Pirate Island Party",
    ageGroup: "3-7",
    description: "A high-energy pirate-themed party with treasure hunts, pirate hats, and map-based activities.",
    image: "/images/parent/party-themes/party-pirate-island.png",
    files: [
      { name: "Treasure map activity", type: "PDF" },
      { name: "Pirate hats template",  type: "PDF" },
      { name: "Bandana craft sheet",   type: "PDF" },
      { name: "Cake toppers",          type: "PNG" },
      { name: "Party games sheet",     type: "PDF" },
    ],
    addOns: [
      { title: "Live Remote Storytelling Session", description: "30-minute virtual session hosted by Mel.", price: "$9.99" },
      { title: "Extra Printable Games Pack",       description: "Includes 5 bonus pirate games.",           price: "$2.99" },
    ],
  },
};

/* ── File type badge ───────────────────────────────────── */
function FileBadge({ type }: { type: "PDF" | "PNG" }) {
  const bg = type === "PDF" ? "#F04438" : "#737373";
  return (
    <span
      style={{
        fontSize: "9px",
        fontWeight: 700,
        fontFamily: "var(--font-inter), Inter, sans-serif",
        color: "#FFFFFF",
        background: bg,
        borderRadius: "3px",
        padding: "1px 4px",
        flexShrink: 0,
        lineHeight: "14px",
      }}
    >
      {type}
    </span>
  );
}

/* ── Add-on card ───────────────────────────────────────── */
function AddOnCard({ addon, image }: { addon: AddOn; image: string }) {
  return (
    <div
      style={{
        flex: 1,
        border: "1px solid #E5E5E5",
        borderRadius: "12px",
        padding: "12px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}
    >
      {/* Thumbnail — 98×98px */}
      <div
        style={{
          width: "98px",
          height: "98px",
          borderRadius: "8px",
          border: "1px solid #E5E5E5",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <Image src={image} alt={addon.title} fill style={{ objectFit: "cover" }} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>
          {addon.title}
        </span>
        <span className="font-nunito font-normal" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>
          {addon.description}
        </span>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginTop: "4px" }}>
          <span className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#292929" }}>
            {addon.price}
          </span>
          <button
            className="font-nunito font-bold text-white"
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              background: "#F63D68",
              border: "1px solid #F63D68",
              fontSize: "14px",
              lineHeight: "20px",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
              cursor: "pointer",
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────── */
export default function PartyThemeDetailPage({ params }: { params: { id: string } }) {
  const theme = themeData[params.id] ?? themeData["1"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Breadcrumb ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Link
          href="/parent/party-themes"
          className="font-nunito font-bold"
          style={{ fontSize: "14px", lineHeight: "20px", color: "#424242", textDecoration: "none" }}
        >
          Party Theme
        </Link>
        <ChevronRight size={16} style={{ color: "#737373" }} />
        <span className="font-nunito font-bold" style={{ fontSize: "14px", lineHeight: "20px", color: "#F63D68" }}>
          {theme.title}
        </span>
      </div>

      {/* ── Card 1: Basic Information ── */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E5E5E5",
          borderRadius: "12px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Hero image — fill-width, 263px tall */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "263px",
            borderRadius: "12px",
            border: "1px solid #E5E5E5",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <Image
            src={theme.image}
            alt={theme.title}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        {/* Theme info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Age Group + Title + Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#141414" }}>Age Group</span>
              <span className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>{theme.ageGroup}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span className="font-nunito font-semibold" style={{ fontSize: "20px", lineHeight: "30px", color: "#141414" }}>
                {theme.title}
              </span>
              <span className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
                {theme.description}
              </span>
            </div>
          </div>

          {/* Included Files */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>
              Included Files
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {theme.files.map((file) => (
                <div
                  key={file.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid #E5E5E5",
                    background: "#FAFAFA",
                  }}
                >
                  <span className="font-nunito font-normal" style={{ fontSize: "12px", lineHeight: "18px", color: "#141414" }}>
                    {file.name}
                  </span>
                  <FileBadge type={file.type} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons — right-aligned */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "16px" }}>
          <button
            className="font-nunito font-bold"
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #D6D6D6",
              background: "#FFFFFF",
              fontSize: "14px",
              lineHeight: "20px",
              color: "#424242",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
              cursor: "pointer",
            }}
          >
            Download Individuals
          </button>
          <button
            className="font-nunito font-bold text-white"
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #F63D68",
              background: "#F63D68",
              fontSize: "14px",
              lineHeight: "20px",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
              cursor: "pointer",
            }}
          >
            Download All
          </button>
        </div>
      </div>

      {/* ── Card 2: Add More Fun ── */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E5E5E5",
          borderRadius: "12px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <span className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>
          Add More Fun to Your Party
        </span>

        <div style={{ display: "flex", gap: "24px" }}>
          {theme.addOns.map((addon) => (
            <AddOnCard key={addon.title} addon={addon} image={theme.image} />
          ))}
        </div>
      </div>

    </div>
  );
}
