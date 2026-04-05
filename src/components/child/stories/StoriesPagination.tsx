"use client";

// Pagination
// Prev/Next: bg white r=8 border, Nunito 700 14px lh=20 rgb(66,66,66)
// Page numbers: Nunito 600 14px lh=20 rgb(82,82,82)
// Active page: bg rgb(250,250,250) r=8

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface StoriesPaginationProps {
  total?: number;
  pageSize?: number;
}

export function StoriesPagination({ total = 10 }: StoriesPaginationProps) {
  const [page, setPage] = useState(1);

  const pages = total <= 5
    ? Array.from({ length: total }, (_, i) => i + 1)
    : [1, 2, 3, "...", total - 1, total];

  return (
    <div className="flex items-center justify-between" style={{ height: "60px" }}>
      {/* Previous */}
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors"
        style={{ height: "40px", borderRadius: "8px", paddingLeft: "14px", paddingRight: "14px" }}
      >
        <ChevronLeft size={18} className="text-ink-muted" />
        {/* Nunito 700 14px lh=20 rgb(66,66,66) */}
        <span
          className="font-nunito font-bold text-ink-muted"
          style={{ fontSize: "14px", lineHeight: "20px" }}
        >
          Previous
        </span>
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((p, idx) =>
          p === "..." ? (
            <span
              key={`dots-${idx}`}
              className="flex items-center justify-center font-inter font-medium text-ink-subtle"
              style={{ width: "40px", height: "40px", fontSize: "14px", lineHeight: "20px" }}
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => setPage(p as number)}
              className="flex items-center justify-center transition-colors"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: page === p ? "#FAFAFA" : "transparent",
                // Nunito 600 14px lh=20 rgb(82,82,82)
                fontFamily: "var(--font-nunito), Nunito, sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: "20px",
                color: "#525252",
              }}
            >
              {p}
            </button>
          )
        )}
      </div>

      {/* Next */}
      <button
        onClick={() => setPage((p) => Math.min(total, p + 1))}
        disabled={page === total}
        className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors"
        style={{ height: "40px", borderRadius: "8px", paddingLeft: "14px", paddingRight: "14px" }}
      >
        {/* Nunito 700 14px lh=20 rgb(66,66,66) */}
        <span
          className="font-nunito font-bold text-ink-muted"
          style={{ fontSize: "14px", lineHeight: "20px" }}
        >
          Next
        </span>
        <ChevronRight size={18} className="text-ink-muted" />
      </button>
    </div>
  );
}
