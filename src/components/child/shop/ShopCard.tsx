// Shop card — 330x420 r=12
// Thumbnail: 306x200 gradient r=8
// Badge: Nunito 600 12px lh=18 rgb(5,118,71) bg=rgb(236,252,242) r=9999
// Title: Nunito 600 20px lh=30 rgb(20,20,20)
// Description: Nunito 400 14px lh=20 rgb(82,82,82)
// Tags: Nunito 600 14px lh=20 rgb(40,40,40) with divider
// Price: Nunito 600 18px lh=28 rgb(40,40,40)
// "View Details" btn: white border r=8 h=40 116px
// "Buy Now" btn: #F53D68 r=8 h=40 92px Nunito 700 14px white

import Link from "next/link";

interface ShopCardProps {
  id: string;
  badge: string;
  title: string;
  description: string;
  tags: string[];
  price: string;
  gradient: string;
  emoji: string;
}

export function ShopCard({ id, badge, title, description, tags, price, gradient, emoji }: ShopCardProps) {
  return (
    <div
      className="flex flex-col shrink-0"
      style={{ width: "330px", borderRadius: "12px", background: "#FFFFFF", padding: "12px", gap: "12px" }}
    >
      {/* Thumbnail */}
      <div
        className="relative flex items-center justify-center overflow-hidden shrink-0"
        style={{ width: "306px", height: "200px", borderRadius: "8px", background: gradient }}
      >
        <span style={{ fontSize: "80px", opacity: 0.6 }}>{emoji}</span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3">

        {/* Badge */}
        <span
          className="font-nunito font-semibold self-start"
          style={{
            fontSize: "12px",
            lineHeight: "18px",
            color: "#05764B",
            background: "#ECFDF2",
            borderRadius: "9999px",
            padding: "2px 10px",
          }}
        >
          {badge}
        </span>

        {/* Title + description */}
        <div className="flex flex-col gap-1">
          <p
            className="font-nunito font-semibold text-ink"
            style={{ fontSize: "20px", lineHeight: "30px" }}
          >
            {title}
          </p>
          <p
            className="font-nunito font-normal text-ink-subtle"
            style={{ fontSize: "14px", lineHeight: "20px" }}
          >
            {description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2">
          {tags.map((tag, i) => (
            <div key={tag} className="flex items-center gap-2">
              {i > 0 && <div className="w-px h-4 bg-gray-200" />}
              <span
                className="font-nunito font-semibold text-ink-secondary"
                style={{ fontSize: "14px", lineHeight: "20px" }}
              >
                {tag}
              </span>
            </div>
          ))}
        </div>

        {/* Price + buttons */}
        <div className="flex items-center justify-between">
          <span
            className="font-nunito font-semibold text-ink-secondary"
            style={{ fontSize: "18px", lineHeight: "28px" }}
          >
            {price}
          </span>

          <div className="flex items-center gap-2">
            {/* View Details */}
            <Link
              href={`/child/shop/${id}`}
              className="flex items-center justify-center font-nunito font-semibold hover:opacity-75 transition-opacity"
              style={{
                width: "116px",
                height: "40px",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                background: "#FFFFFF",
                fontSize: "14px",
                lineHeight: "20px",
                color: "#424242",
              }}
            >
              View Details
            </Link>

            {/* Buy Now */}
            <button
              className="flex items-center justify-center font-nunito font-bold text-white hover:opacity-90 transition-opacity"
              style={{
                width: "92px",
                height: "40px",
                borderRadius: "8px",
                background: "#F53D68",
                fontSize: "14px",
                lineHeight: "20px",
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
