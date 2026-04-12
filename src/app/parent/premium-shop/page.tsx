"use client";

// Premium Shop — Figma node 214:13111
// Page header: "Premium Shop" + subtitle
// Filter card: tabs (All/Premium Stories/Premium Games/Bundle/Add-ons) + search + Filter btn
// 3-column product card grid
// Each card: 200px image + category badge + title + description + feature tags + price + buttons

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";

/* ── Types & Data ──────────────────────────────────────── */
type Category = "Premium Story" | "Premium Game" | "Add-ons" | "Bundle";

interface Product {
  id: string;
  title: string;
  description: string;
  category: Category;
  price: string;
  image: string;
  featureTags: string[];
}

const products: Product[] = [
  {
    id: "1",
    title: "Mel and the Snowy Adventure",
    description: "A magical winter-themed story with narration, animations, and star rewards.",
    category: "Premium Story",
    price: "$9.99",
    image: "/images/parent/premium-shop/product-snowy-adventure.png",
    featureTags: ["Animation", "Earn Star"],
  },
  {
    id: "2",
    title: "Mel and the Snowy Adventure",
    description: "A magical winter-themed story with narration, animations, and star rewards.",
    category: "Premium Game",
    price: "$9.99",
    image: "/images/parent/premium-shop/product-game.png",
    featureTags: ["Animation", "Earn Star"],
  },
  {
    id: "3",
    title: "Mel and the Snowy Adventure",
    description: "A magical winter-themed story with narration, animations, and star rewards.",
    category: "Premium Story",
    price: "$9.99",
    image: "/images/parent/premium-shop/product-snowy-adventure.png",
    featureTags: ["Animation", "Earn Star"],
  },
  {
    id: "4",
    title: "Mel and the Snowy Adventure",
    description: "A magical winter-themed story with narration, animations, and star rewards.",
    category: "Premium Story",
    price: "$9.99",
    image: "/images/parent/premium-shop/product-snowy-adventure.png",
    featureTags: ["Animation", "Earn Star"],
  },
  {
    id: "5",
    title: "Mel and the Snowy Adventure",
    description: "A magical winter-themed story with narration, animations, and star rewards.",
    category: "Premium Game",
    price: "$9.99",
    image: "/images/parent/premium-shop/product-game.png",
    featureTags: ["Animation", "Earn Star"],
  },
  {
    id: "6",
    title: "Party Games Add-on Pack",
    description: "Printable party games inspired by Mel's stories.",
    category: "Add-ons",
    price: "$1.99",
    image: "/images/parent/premium-shop/product-party-games.png",
    featureTags: ["Animation", "Earn Star"],
  },
  {
    id: "7",
    title: "Mel and the Snowy Adventure",
    description: "A magical winter-themed story with narration, animations, and star rewards.",
    category: "Premium Game",
    price: "$9.99",
    image: "/images/parent/premium-shop/product-game.png",
    featureTags: ["Animation", "Earn Star"],
  },
  {
    id: "8",
    title: "Party Games Add-on Pack",
    description: "Printable party games inspired by Mel's stories.",
    category: "Add-ons",
    price: "$9.99",
    image: "/images/parent/premium-shop/product-party-games.png",
    featureTags: ["Animation", "Earn Star"],
  },
  {
    id: "9",
    title: "Ultimate Learning Bundle",
    description: "A magical winter-themed story with narration, animations, and star rewards.",
    category: "Bundle",
    price: "$9.99",
    image: "/images/parent/premium-shop/product-snowy-adventure.png",
    featureTags: [],
  },
];

const FILTER_TABS = ["All", "Premium Stories", "Premium Games", "Bundle", "Add-ons"] as const;
type FilterTab = (typeof FILTER_TABS)[number];

const CATEGORY_MAP: Record<FilterTab, Category | null> = {
  "All": null,
  "Premium Stories": "Premium Story",
  "Premium Games": "Premium Game",
  "Bundle": "Bundle",
  "Add-ons": "Add-ons",
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

/* ── Feature tag pill ──────────────────────────────────── */
function FeatureTag({ label }: { label: string }) {
  return (
    <span
      className="font-nunito font-medium"
      style={{
        fontSize: "12px", lineHeight: "18px",
        color: "#424242", background: "#F5F5F5",
        border: "1px solid #E5E5E5",
        borderRadius: "9999px", padding: "2px 8px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

/* ── Product Card ──────────────────────────────────────── */
function ProductCard({ product }: { product: Product }) {
  return (
    <div
      style={{
        flex: 1,
        border: "1px solid #E5E5E5",
        borderRadius: "12px",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        background: "#FFFFFF",
        minWidth: 0,
      }}
    >
      {/* Product image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "200px",
          borderRadius: "8px",
          border: "1px solid #E5E5E5",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <Image src={product.image} alt={product.title} fill style={{ objectFit: "cover" }} />
      </div>

      {/* Card content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
        {/* Text block */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Category badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CategoryBadge category={product.category} />
          </div>

          {/* Title + Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span
              className="font-nunito font-semibold"
              style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}
            >
              {product.title}
            </span>
            <span
              className="font-nunito font-normal"
              style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}
            >
              {product.description}
            </span>
          </div>

          {/* Feature tags */}
          {product.featureTags.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              {product.featureTags.map((tag) => (
                <FeatureTag key={tag} label={tag} />
              ))}
            </div>
          )}
        </div>

        {/* Price + Buttons row */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "auto" }}>
          <span
            className="font-nunito font-semibold"
            style={{
              fontSize: "18px", lineHeight: "28px", color: "#292929",
              minWidth: "48px", textAlign: "center", flexShrink: 0,
            }}
          >
            {product.price}
          </span>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px", flex: 1 }}>
            {/* Secondary: Preview */}
            <button
              className="font-nunito font-bold"
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid #D6D6D6",
                background: "#FFFFFF",
                fontSize: "14px",
                lineHeight: "20px",
                color: "#424242",
                boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Preview
            </button>
            {/* Primary: Buy Now */}
            <Link
              href="/parent/premium-shop/checkout"
              className="font-nunito font-bold text-white"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid #F63D68",
                background: "#F63D68",
                fontSize: "14px",
                lineHeight: "20px",
                boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Buy Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────── */
export default function PremiumShopPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => {
    const catFilter = CATEGORY_MAP[activeTab];
    const matchTab = catFilter === null || p.category === catFilter;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  // Split into rows of 3
  const rows: Product[][] = [];
  for (let i = 0; i < filtered.length; i += 3) {
    rows.push(filtered.slice(i, i + 3));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <h1
          className="font-nunito font-semibold"
          style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}
        >
          Premium Shop
        </h1>
        <p
          className="font-nunito font-normal"
          style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}
        >
          Unlock exclusive stories, games, add-ons, and special bundles.
        </p>
      </div>

      {/* ── Filter Card ── */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #EAECF0",
          borderRadius: "12px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
        }}
      >
        {/* Controls row: tabs + search + filter */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          {/* Tab bar */}
          <div
            style={{
              padding: "4px",
              background: "#FAFAFA",
              borderRadius: "10px",
              display: "flex",
              gap: "4px",
            }}
          >
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="font-nunito font-medium"
                style={{
                  padding: "4px 12px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  lineHeight: "20px",
                  border: "none",
                  cursor: "pointer",
                  color: activeTab === tab ? "#141414" : "#737373",
                  background: activeTab === tab ? "#FFFFFF" : "#FAFAFA",
                  boxShadow: activeTab === tab
                    ? "0px 1px 2px rgba(16,24,40,0.06), 0px 1px 3px rgba(16,24,40,0.10)"
                    : "none",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Search */}
            <div style={{ position: "relative", width: "320px" }}>
              <Search
                size={16}
                style={{
                  position: "absolute", left: "14px", top: "50%",
                  transform: "translateY(-50%)", color: "#A3A3A3",
                }}
              />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
                style={{
                  width: "100%",
                  height: "44px",
                  paddingLeft: "42px",
                  paddingRight: "14px",
                  borderRadius: "8px",
                  border: "1px solid #E5E5E5",
                  fontSize: "16px",
                  color: "#141414",
                  background: "#FFFFFF",
                  boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
                }}
              />
            </div>

            {/* Filter button */}
            <button
              className="font-nunito font-bold"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
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
              <SlidersHorizontal size={20} style={{ color: "#424242" }} />
              Filter
            </button>
          </div>
        </div>

        {/* Product grid — 3 columns */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {rows.map((row, ri) => (
            <div key={ri} style={{ display: "flex", gap: "20px" }}>
              {row.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {/* Fill empty slots in last row */}
              {row.length < 3 &&
                Array.from({ length: 3 - row.length }).map((_, i) => (
                  <div key={`empty-${i}`} style={{ flex: 1, minWidth: 0 }} />
                ))}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
