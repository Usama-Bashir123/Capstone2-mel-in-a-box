"use client";

// Parent Dashboard — Figma node 214:10672
// Layout fixes:
//   - Promo banner: bg image + gradient, MEGA sale left, 30% OFF centre, image card right, Add Story CTA
//   - Metric cards (2×2) + Weekly Activity chart: ROW (side by side)
//   - Child Profiles: 526.5px fixed width | Recent Activity: fill remaining width, both 408px height

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

/* ── Metric Card ─────────────────────────────────────────── */
function MetricCard({
  label,
  value,
  illustration,
}: {
  label: string;
  value: string;
  illustration: React.ReactNode;
}) {
  return (
    <div
      style={{
        flex: 1,
        background: "#FFFFFF",
        border: "1px solid #E5E5E5",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        position: "relative",
        overflow: "hidden",
        minHeight: "130px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", zIndex: 1 }}>
        <span className="font-nunito font-medium" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
          {label}
        </span>
        <span className="font-nunito font-semibold" style={{ fontSize: "20px", lineHeight: "30px", color: "#141414" }}>
          {value}
        </span>
      </div>
      <div style={{ position: "absolute", right: "0px", bottom: "0px" }}>
        {illustration}
      </div>
    </div>
  );
}

/* ── Bar Chart ───────────────────────────────────────────── */
const chartData = [
  { day: "Mon", mia: 60, david: 40, noah: 20 },
  { day: "Tue", mia: 45, david: 60, noah: 30 },
  { day: "Wed", mia: 80, david: 50, noah: 40 },
  { day: "Thu", mia: 35, david: 70, noah: 55 },
  { day: "Fri", mia: 65, david: 45, noah: 25 },
  { day: "Sat", mia: 50, david: 30, noah: 60 },
  { day: "Sun", mia: 70, david: 55, noah: 35 },
];
const MAX_VAL = 80;
const yLabels = [80, 60, 40, 20, 10, "00"];

function WeeklyChart() {
  return (
    <div
      style={{
        flex: 1,
        background: "#FFFFFF",
        border: "1px solid #E5E5E5",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="font-nunito font-semibold" style={{ fontSize: "20px", lineHeight: "30px", color: "#292929" }}>
          Weekly Activity Overview
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {[
            { label: "Mia",   color: "#F63D68" },
            { label: "David", color: "#FEA3B4" },
            { label: "Noah",  color: "#FFCCD8" },
          ].map((s) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.color }} />
              <span className="font-nunito font-normal" style={{ fontSize: "12px", lineHeight: "18px", color: "#475467" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ display: "flex", gap: "8px" }}>
        {/* Y-axis */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "200px", paddingBottom: "24px" }}>
          {yLabels.map((l) => (
            <span key={l} className="font-nunito font-normal" style={{ fontSize: "12px", color: "#737373", textAlign: "right", minWidth: "24px" }}>{l}</span>
          ))}
        </div>

        {/* Bars + X-axis */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ height: "175px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderBottom: "1px solid #E5E5E5", paddingBottom: "8px", gap: "8px" }}>
            {chartData.map((d) => (
              <div key={d.day} style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: "3px", justifyContent: "center" }}>
                {[
                  { val: d.mia,   color: "#F63D68" },
                  { val: d.david, color: "#FEA3B4" },
                  { val: d.noah,  color: "#FFCCD8" },
                ].map((bar, i) => (
                  <div
                    key={i}
                    style={{
                      width: "10px",
                      height: `${(bar.val / MAX_VAL) * 155}px`,
                      background: bar.color,
                      borderRadius: "3px 3px 0 0",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", gap: "8px" }}>
            {chartData.map((d) => (
              <div key={d.day} style={{ flex: 1, textAlign: "center" }}>
                <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#737373" }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Child Profile Item ───────────────────────────────────── */
function ChildProfileItem({
  name, age, stars, stories, initials, color, lastActive,
}: {
  name: string; age: string; stars: string; stories: string;
  initials: string; color: string; lastActive: string;
}) {
  return (
    <div
      style={{
        background: "#FCFCFC",
        border: "1px solid #E5E5E5",
        borderRadius: "12px",
        padding: "12px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "8px",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span className="font-nunito font-bold" style={{ fontSize: "28px", color: "#fff" }}>{initials}</span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>{name}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {[
            { label: "Age:", val: age },
            { label: "Stars:", val: stars },
            { label: "Stories:", val: stories },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {i > 0 && <div style={{ width: "1px", height: "16px", background: "#D6D6D6", marginRight: "4px" }} />}
              <span className="font-nunito font-medium" style={{ fontSize: "13px", color: "#525252" }}>{item.label}</span>
              <span className="font-nunito font-semibold" style={{ fontSize: "13px", color: "#424242" }}>{item.val}</span>
            </div>
          ))}
        </div>
        <span className="font-nunito font-normal" style={{ fontSize: "11px", color: "#737373" }}>Last Active: {lastActive}</span>
      </div>
    </div>
  );
}

/* ── Recommended Card ────────────────────────────────────── */
function RecommendedCard({
  title, age, forChild, thumbnail,
}: {
  title: string; age: string; forChild: string; thumbnail: string;
}) {
  return (
    <div
      style={{
        background: "#FCFCFC",
        border: "1px solid #E5E5E5",
        borderRadius: "12px",
        padding: "12px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "8px",
          border: "1px solid #E5E5E5",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <Image src={thumbnail} alt={title} fill style={{ objectFit: "cover" }} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
        <span className="font-nunito font-semibold" style={{ fontSize: "16px", lineHeight: "24px", color: "#141414" }}>{title}</span>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {[{ label: "Age:", val: age }, { label: "For:", val: forChild }].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {i > 0 && <div style={{ width: "1px", height: "20px", background: "#D6D6D6", marginRight: "4px" }} />}
                <span className="font-nunito font-medium" style={{ fontSize: "14px", lineHeight: "20px", color: "#525252" }}>{item.label}</span>
                <span className="font-nunito font-semibold" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}>{item.val}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
            <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#424242" }}>View Detail</span>
            <ChevronRight size={16} style={{ color: "#424242" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default function ParentDashboard() {
  const activities = [
    { activity: 'Mia completed "Match the Letters"',          time: "Today, 09:45 AM" },
    { activity: 'Noah earned the "Jungle Explorer" badge',    time: "Yesterday, 5:20 PM" },
    { activity: 'New story added: "Pirate Island Adventure"', time: "Mar 14, 2025" },
    { activity: 'New story added: "Pirate Island Adventure"', time: "Mar 14, 2025" },
    { activity: 'New story added: "Pirate Island Adventure"', time: "Mar 14, 2025" },
    { activity: 'New story added: "Pirate Island Adventure"', time: "Mar 14, 2025" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <h1 className="font-nunito font-semibold" style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}>
          Welcome, Sarah
        </h1>
        <p className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
          Track your children&apos;s learning
        </p>
      </div>

      {/* ── Promo Banner ── */}
      {/* height: 231px, bg image + dark-green gradient left, MEGA sale left, 30% OFF centre, image card right, Add Story CTA */}
      <div
        style={{
          position: "relative",
          height: "231px",
          borderRadius: "12px",
          border: "1px solid #E5E5E5",
          overflow: "hidden",
        }}
      >
        {/* Background image */}
        <Image
          src="/images/parent/promo-banner-bg.png"
          alt="Promo banner"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        {/* Dark green gradient overlay — dense left, fades right */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(-90deg, rgba(9,29,2,0) 50%, rgba(9,29,2,1) 100%)",
          }}
        />

        {/* LEFT — Frame 407: x:26, y:52, 250×140 */}
        <div style={{ position: "absolute", left: "26px", top: "52px", width: "250px" }}>
          {/* MEGA sale */}
          <div style={{ lineHeight: 1 }}>
            <div
              style={{
                fontFamily: "var(--font-luckiest-guy), cursive",
                fontWeight: 400,
                fontSize: "52px",
                color: "#43FF59",
                lineHeight: 1,
              }}
            >
              MEGA
            </div>
            <div
              style={{
                fontFamily: "var(--font-luckiest-guy), cursive",
                fontWeight: 400,
                fontSize: "64px",
                color: "#FFFFFF",
                lineHeight: 1,
                marginTop: "-4px",
              }}
            >
              sale
            </div>
          </div>
          {/* LIMITED TIME OFFER */}
          <div
            style={{
              fontFamily: "var(--font-poppins), Poppins, sans-serif",
              fontWeight: 900,
              fontSize: "14px",
              color: "#FFFFFF",
              letterSpacing: "0.5px",
              marginTop: "6px",
            }}
          >
            LIMITED TIME OFFER
          </div>
          {/* Body */}
          <div
            style={{
              fontFamily: "var(--font-poppins), Poppins, sans-serif",
              fontWeight: 400,
              fontSize: "12px",
              color: "#FFFFFF",
              marginTop: "4px",
            }}
          >
            Lorem ipsum dolor sit amet, consectetuer
          </div>
        </div>

        {/* CENTRE — dark olive shape + 30% OFF text at x:445, y:10 */}
        <div style={{ position: "absolute", left: "445px", top: "10px", width: "179px", height: "171px" }}>
          {/* Dark olive background shape */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(39,63,0,0.84)",
              borderRadius: "50%",
            }}
          />
          {/* 30% OFF text — centred within shape, positioned at x:493, y:46 relative to banner */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-poppins), Poppins, sans-serif",
                fontWeight: 700,
                fontSize: "42px",
                color: "#FFFFFF",
                lineHeight: 1,
              }}
            >
              30%
            </div>
            <div
              style={{
                fontFamily: "var(--font-poppins), Poppins, sans-serif",
                fontWeight: 700,
                fontSize: "42px",
                color: "#FFFFFF",
                lineHeight: 1,
              }}
            >
              OFF
            </div>
          </div>
        </div>

        {/* RIGHT — Frame 408 image card: x:804, y:25, 242×179 */}
        <div
          style={{
            position: "absolute",
            right: "23px",
            top: "25px",
            width: "242px",
            height: "179px",
            borderRadius: "8px",
            border: "1px solid #F5F5F5",
            overflow: "hidden",
          }}
        >
          <Image
            src="/images/parent/promo-banner-right-card.png"
            alt="Promo offer"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Add Story CTA — x:485, y:180 */}
        <div style={{ position: "absolute", bottom: "20px", left: "485px" }}>
          <button
            className="font-nunito font-bold text-white"
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              background: "#F63D68",
              border: "1px solid #F63D68",
              fontSize: "14px",
              lineHeight: "20px",
              boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Add Story
          </button>
        </div>
      </div>

      {/* ── Metric cards (2×2) + Weekly Activity Chart — equal-width ROW ── */}
      <div style={{ display: "flex", gap: "16px", alignItems: "stretch" }}>

        {/* Left: 2×2 metric grid — flex:1 (equal width with chart) */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Row 1 */}
          <div style={{ display: "flex", gap: "16px", flex: 1 }}>
            <MetricCard
              label="My Stories"
              value="12 Stories"
              illustration={
                <div style={{ width: "110px", height: "110px", position: "relative" }}>
                  <Image src="/images/parent/metric-illustration-stories.png" alt="My Stories" fill style={{ objectFit: "contain" }} />
                </div>
              }
            />
            <MetricCard
              label="Badges Earned by Kids"
              value="8 Badges"
              illustration={
                <div style={{ width: "110px", height: "110px", position: "relative" }}>
                  <Image src="/images/parent/metric-illustration-badges.png" alt="Badges" fill style={{ objectFit: "contain" }} />
                </div>
              }
            />
          </div>
          {/* Row 2 */}
          <div style={{ display: "flex", gap: "16px", flex: 1 }}>
            <MetricCard
              label="Average Learning Time (Kids)"
              value="1 hr per day"
              illustration={
                <div style={{ width: "110px", height: "110px", position: "relative" }}>
                  <Image src="/images/parent/metric-illustration-learning-time.png" alt="Avg Learning Time" fill style={{ objectFit: "contain" }} />
                </div>
              }
            />
            <MetricCard
              label="My Games"
              value="8 Games"
              illustration={
                <div style={{ width: "110px", height: "110px", position: "relative" }}>
                  <Image src="/images/parent/metric-illustration-games.png" alt="My Games" fill style={{ objectFit: "contain" }} />
                </div>
              }
            />
          </div>
        </div>

        {/* Right: Weekly Activity chart — flex:1 (equal width with metric grid) */}
        <WeeklyChart />
      </div>

      {/* ── Child Profiles + Recent Activity — equal-width ROW ── */}
      <div style={{ display: "flex", gap: "16px", alignItems: "stretch" }}>

        {/* Child Profiles — flex:1 (equal width with recent activity) */}
        <div
          style={{
            flex: 1,
            background: "#FFFFFF",
            border: "1px solid #E5E5E5",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <span className="font-nunito font-semibold" style={{ fontSize: "20px", lineHeight: "30px", color: "#292929" }}>
            Child Profiles
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <ChildProfileItem name="Mia John"  age="4"  stars="12" stories="5" initials="M" color="#F63D68" lastActive="Today, 10:15 AM" />
            <ChildProfileItem name="David John" age="7"  stars="8"  stories="3" initials="D" color="#686FA6" lastActive="Yesterday, 5:20 PM" />
            <ChildProfileItem name="Noah John"  age="5"  stars="15" stories="7" initials="N" color="#F7902B" lastActive="Today, 8:45 AM" />
          </div>
        </div>

        {/* Recent Activity — fills remaining width, same height as child profiles */}
        <div
          style={{
            flex: 1,
            background: "#FFFFFF",
            border: "1px solid #E5E5E5",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <span className="font-nunito font-semibold" style={{ fontSize: "20px", lineHeight: "30px", color: "#292929" }}>
            Recent Activity
          </span>
          <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #F2F4F7" }}>
            {/* Table header */}
            <div style={{ display: "flex", background: "#F9FAFB", borderBottom: "1px solid #F2F4F7" }}>
              <div style={{ flex: 1, padding: "14px 20px" }}>
                <span className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>Activity</span>
              </div>
              <div style={{ padding: "14px 20px", whiteSpace: "nowrap" }}>
                <span className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>Date & Time</span>
              </div>
            </div>
            {/* Table rows */}
            {activities.map((row, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  background: "#FFFFFF",
                  borderBottom: i < activities.length - 1 ? "1px solid #F2F4F7" : "none",
                }}
              >
                <div style={{ flex: 1, padding: "16px 20px" }}>
                  <span className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>{row.activity}</span>
                </div>
                <div style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                  <span className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>{row.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recommended Stories + Games — ROW ── */}
      <div style={{ display: "flex", gap: "16px" }}>

        {/* Recommended Stories */}
        <div
          style={{
            flex: 1,
            background: "#FFFFFF",
            border: "1px solid #E5E5E5",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="font-nunito font-semibold" style={{ fontSize: "20px", lineHeight: "30px", color: "#292929" }}>Recommended Stories</span>
            <Link href="/parent/stories" className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>View all</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <RecommendedCard title="Underwater Kingdom"   age="3-4" forChild="David" thumbnail="/images/parent/story-card-thumbnail.png" />
            <RecommendedCard title="The Brave Little Fox" age="4-6" forChild="Noah"  thumbnail="/images/parent/story-card-thumbnail.png" />
          </div>
        </div>

        {/* Recommended Games */}
        <div
          style={{
            flex: 1,
            background: "#FFFFFF",
            border: "1px solid #E5E5E5",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="font-nunito font-semibold" style={{ fontSize: "20px", lineHeight: "30px", color: "#292929" }}>Recommended Games</span>
            <Link href="/parent/games" className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>View all</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <RecommendedCard title="Jungle Adventure" age="4-6" forChild="Noah"  thumbnail="/images/parent/game-card-thumbnail.png" />
            <RecommendedCard title="Counting Jungle"  age="3-5" forChild="David" thumbnail="/images/parent/game-card-thumbnail.png" />
          </div>
        </div>
      </div>

    </div>
  );
}
