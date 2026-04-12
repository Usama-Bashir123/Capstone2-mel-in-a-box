"use client";

// Premium Shop Detail — Figma node 214:13344
// Breadcrumb: "Premium Shop" > "{product title}" (Rosé/500)
// Actions (right-aligned): Cancel + Buy now (primary rose)
// Card "Basic Information":
//   - 263px hero image (fill-width, r=12)
//   - "Premium Story" category badge (green pill)
//   - Title + Price (row, space-between)
//   - Description
//   - Meta: Age Group + Estimated Reading Time (row with divider)
//   - "Includes" heading + checklist of 4 items

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, CheckCircle2 } from "lucide-react";

/* ── Product data ──────────────────────────────────────── */
type Category = "Premium Story" | "Premium Game" | "Add-ons" | "Bundle";

interface ProductDetail {
  title: string;
  category: Category;
  price: string;
  description: string;
  ageGroup: string;
  readingTime: string;
  image: string;
  includes: string[];
}

const productData: Record<string, ProductDetail> = {
  "1": {
    title: "Mel and the Snowy Adventure",
    category: "Premium Story",
    price: "$9.99",
    description: "Join Mel on a magical snowy journey filled with interactive pages, voice narration, animations, and rewards.",
    ageGroup: "3-7",
    readingTime: "12 minutes",
    image: "/images/parent/premium-shop/product-snowy-adventure.png",
    includes: [
      "15 Illustrated Story Pages",
      "Animated Scenes",
      "Narrated Audio",
      "Earn 5 Special Badges",
    ],
  },
  "2": {
    title: "Mel and the Snowy Adventure",
    category: "Premium Game",
    price: "$9.99",
    description: "Join Mel on a magical snowy journey filled with interactive pages, voice narration, animations, and rewards.",
    ageGroup: "3-7",
    readingTime: "12 minutes",
    image: "/images/parent/premium-shop/product-game.png",
    includes: [
      "15 Illustrated Story Pages",
      "Animated Scenes",
      "Narrated Audio",
      "Earn 5 Special Badges",
    ],
  },
  "6": {
    title: "Party Games Add-on Pack",
    category: "Add-ons",
    price: "$1.99",
    description: "Printable party games inspired by Mel's stories, perfect for birthday parties and playdates.",
    ageGroup: "3-7",
    readingTime: "N/A",
    image: "/images/parent/premium-shop/product-party-games.png",
    includes: [
      "10 Printable Game Sheets",
      "Party Activity Cards",
      "Score Tracker",
      "Mel Character Stickers",
    ],
  },
  "9": {
    title: "Ultimate Learning Bundle",
    category: "Bundle",
    price: "$9.99",
    description: "Join Mel on a magical snowy journey filled with interactive pages, voice narration, animations, and rewards.",
    ageGroup: "3-7",
    readingTime: "12 minutes",
    image: "/images/parent/premium-shop/product-snowy-adventure.png",
    includes: [
      "15 Illustrated Story Pages",
      "Animated Scenes",
      "Narrated Audio",
      "Earn 5 Special Badges",
    ],
  },
};

/* ── Category badge ────────────────────────────────────── */
const BADGE_STYLES: Record<Category, { color: string; bg: string; border: string }> = {
  "Premium Story": { color: "#067647", bg: "#ECFDF3", border: "#ABEFC6" },
  "Premium Game":  { color: "#6941C6", bg: "#F4F3FF", border: "#D9D6FE" },
  "Add-ons":       { color: "#C4320A", bg: "#FFF4ED", border: "#F9DBAF" },
  "Bundle":        { color: "#026AA2", bg: "#F0F9FF", border: "#B9E6FE" },
};

function CategoryBadge({ category }: { category: Category }) {
  const s = BADGE_STYLES[category];
  return (
    <span
      className="font-nunito font-semibold"
      style={{
        fontSize: "12px", lineHeight: "18px",
        color: s.color, background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: "9999px", padding: "2px 8px",
        whiteSpace: "nowrap", flexShrink: 0,
      }}
    >
      {category}
    </span>
  );
}

/* ── Page ──────────────────────────────────────────────── */
export default function PremiumShopDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const product = productData[params.id] ?? productData["1"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Breadcrumb + Actions ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link
            href="/parent/premium-shop"
            className="font-nunito font-bold"
            style={{ fontSize: "14px", lineHeight: "20px", color: "#424242", textDecoration: "none" }}
          >
            Premium Shop
          </Link>
          <ChevronRight size={16} style={{ color: "#737373" }} />
          <span
            className="font-nunito font-bold"
            style={{ fontSize: "14px", lineHeight: "20px", color: "#F63D68" }}
          >
            {product.title}
          </span>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => router.back()}
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
            Cancel
          </button>
          <Link
            href="/parent/premium-shop/checkout"
            className="font-nunito font-bold text-white"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #F63D68",
              background: "#F63D68",
              fontSize: "14px",
              lineHeight: "20px",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            Buy now
          </Link>
        </div>
      </div>

      {/* ── Basic Information Card ── */}
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
        {/* Hero image */}
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
            src={product.image}
            alt={product.title}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        {/* Product info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Category badge */}
          <div>
            <CategoryBadge category={product.category} />
          </div>

          {/* Title + Price row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
            <span
              className="font-nunito font-semibold"
              style={{ fontSize: "20px", lineHeight: "30px", color: "#141414" }}
            >
              {product.title}
            </span>
            <span
              className="font-nunito font-semibold"
              style={{ fontSize: "18px", lineHeight: "28px", color: "#292929", flexShrink: 0 }}
            >
              {product.price}
            </span>
          </div>

          {/* Description */}
          <span
            className="font-nunito font-normal"
            style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}
          >
            {product.description}
          </span>

          {/* Meta info: Age Group + Estimated Reading Time */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                className="font-nunito font-semibold"
                style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}
              >
                Age Group
              </span>
              <span
                className="font-nunito font-semibold"
                style={{ fontSize: "12px", lineHeight: "18px", color: "#141414" }}
              >
                {product.ageGroup}
              </span>
            </div>
            <div style={{ width: "1px", height: "16px", background: "#E5E5E5", flexShrink: 0 }} />
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                className="font-nunito font-semibold"
                style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}
              >
                Estimated Reading Time:
              </span>
              <span
                className="font-nunito font-semibold"
                style={{ fontSize: "12px", lineHeight: "18px", color: "#141414" }}
              >
                {product.readingTime}
              </span>
            </div>
          </div>

          {/* Includes section */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <span
              className="font-nunito font-semibold"
              style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}
            >
              Includes
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {product.includes.map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle2 size={16} style={{ color: "#17B26A", flexShrink: 0 }} />
                  <span
                    className="font-nunito font-normal"
                    style={{ fontSize: "14px", lineHeight: "20px", color: "#141414" }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
