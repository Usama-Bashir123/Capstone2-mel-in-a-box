"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface StoryReaderProps {
  story: {
    id: string;
    title: string;
    pages: { label: string; image: string; text?: string }[];
  };
  onClose: () => void;
}

export function StoryReader({ story, onClose }: StoryReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [mounted, setMounted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalPages = story.pages.length;

  // Track scroll position to update page number and progress
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollPos = container.scrollTop + container.clientHeight / 2;
      let activePage = 0;

      for (let i = 0; i < pageRefs.current.length; i++) {
        const el = pageRefs.current[i];
        if (el && el.offsetTop <= scrollPos && el.offsetTop + el.clientHeight > scrollPos) {
          activePage = i;
          break;
        }
      }
      setCurrentPage(activePage);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "#FFF5F6",
        display: "flex",
        flexDirection: "column",
        color: "#141414",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* Header (Sticky) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 40px",
          zIndex: 20,
          background: "rgba(255, 245, 246, 0.8)",
          backdropFilter: "blur(8px)",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <div style={{ fontSize: "24px", fontWeight: 800, color: "#141414" }}>
          {currentPage + 1}
        </div>

        <button
          onClick={onClose}
          className="font-nunito font-semibold"
          style={{
            padding: "8px 20px",
            borderRadius: "8px",
            background: "#F5F5F5",
            border: "1px solid #E5E5E5",
            color: "#424242",
            fontSize: "14px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Finish Reading
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div
        ref={scrollContainerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "40px",
          padding: "100px 40px 60px", // Top padding for sticky header
          scrollBehavior: "smooth",
        }}
      >
        {story.pages.map((page, idx) => (
          <div
            key={idx}
            ref={(el) => { pageRefs.current[idx] = el; }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "800px",
              minHeight: "600px",
              height: "auto",
              aspectRatio: "4/3",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0px 10px 30px rgba(0,0,0,0.08)",
              background: "#FFFFFF",
              flexShrink: 0,
            }}
          >
            <Image
              src={page.image}
              alt={page.label}
              fill
              style={{ objectFit: "cover" }}
            />
            {page.text && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "rgba(255,255,255,0.9)",
                  padding: "20px",
                  textAlign: "center",
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#141414",
                }}
              >
                {page.text}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer / Progress Bar (Fixed) */}
      <div
        style={{
          padding: "24px 40px",
          background: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0px -4px 20px rgba(0,0,0,0.02)",
          zIndex: 20,
        }}
      >
        {/* Left: Reading Progress */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span
            className="font-nunito font-semibold"
            style={{ fontSize: "14px", color: "#525252", letterSpacing: "0.02em" }}
          >
            Reading Progress
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {story.pages.map((_, i) => (
              <div
                key={i}
                onClick={() => {
                  pageRefs.current[i]?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  width: i === currentPage ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: i <= currentPage ? "#F63D68" : "#F3F4F6",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </div>

        {/* Right: Next Page Button */}
        <button
          onClick={() => {
            if (currentPage < totalPages - 1) {
              pageRefs.current[currentPage + 1]?.scrollIntoView({ behavior: "smooth" });
            } else {
              onClose();
            }
          }}
          className="font-nunito font-bold"
          style={{
            height: "48px",
            padding: "0 32px",
            borderRadius: "12px",
            background: "#FFFFFF",
            border: "2px solid #F63D68",
            color: "#F63D68",
            fontSize: "16px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#F63D68";
            e.currentTarget.style.color = "#FFFFFF";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#FFFFFF";
            e.currentTarget.style.color = "#F63D68";
          }}
        >
          {currentPage < totalPages - 1 ? "Next Page" : "Finish"}
        </button>
      </div>
    </div>,
    document.body
  );
}
