"use client";

// Purchases & Billing — Figma node 214:13776
// Page header: "Purchases & Billing" + subtitle + "Add new Payment Method" button
// 3 metric cards: Total Amount Spent / Total Purchases / Active Payment Methods
// Purchase history table with filter tabs + search + filter button
// Table: Date, Product, Type, Payment, Amount, Status, Actions (eye icon)
// Pagination

import { useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

/* ── Types & Data ──────────────────────────────────────── */
type PurchaseStatus = "success" | "warning";
type PurchaseCategory = "Story" | "Game" | "Add-on" | "Bundle" | "Service";

interface Purchase {
  id: string;
  date: string;
  product: string;
  type: PurchaseCategory;
  payment: string;
  amount: string;
  status: PurchaseStatus;
}

const purchases: Purchase[] = [
  { id: "1", date: "Today, 09:45 AM",     product: "Jungle Bedtime Story Video",    type: "Story",   payment: "Credit Card", amount: "$4.99", status: "success" },
  { id: "2", date: "Yesterday, 5:20PM",   product: "Pirate Activity Pack",           type: "Game",    payment: "PayPal",       amount: "$2.99", status: "warning" },
  { id: "3", date: "Yesterday, 5:20PM",   product: "Remote Party Session",           type: "Add-on",  payment: "Credit Card", amount: "$4.99", status: "success" },
  { id: "4", date: "Mar 14, 2025",        product: "Mel and the Snowy Adventure",    type: "Bundle",  payment: "PayPal",       amount: "$4.99", status: "success" },
  { id: "5", date: "Mar 10, 2025",        product: "Mel and the Snowy Adventure",    type: "Service", payment: "Credit Card", amount: "$4.99", status: "success" },
  { id: "6", date: "Mar 03, 2025",        product: "Mel and the Snowy Adventure",    type: "Story",   payment: "Credit Card", amount: "$4.99", status: "success" },
  { id: "7", date: "Feb 27, 2025",        product: "Party Games Add-on Pack",        type: "Story",   payment: "Credit Card", amount: "$4.99", status: "success" },
  { id: "8", date: "Feb 27, 2025",        product: "Mel and the Snowy Adventure",    type: "Story",   payment: "Credit Card", amount: "$4.99", status: "success" },
];

const FILTER_TABS = ["All", "Premium Stories", "Premium Games", "Bundle", "Add-ons"] as const;
type FilterTab = (typeof FILTER_TABS)[number];

/* ── Status Badge ──────────────────────────────────────── */
function StatusBadge({ status }: { status: PurchaseStatus }) {
  const s =
    status === "success"
      ? { bg: "#ECFDF3", border: "#ABEFC6", color: "#067647", label: "Completed" }
      : { bg: "#FFFAEB", border: "#FEC84B", color: "#B54708", label: "Pending" };
  return (
    <span
      className="font-nunito font-semibold"
      style={{
        fontSize: "12px", lineHeight: "18px",
        color: s.color, background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: "9999px", padding: "2px 8px",
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}

/* ── Page ──────────────────────────────────────────────── */
export default function PurchasesPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [search, setSearch] = useState("");

  const filtered = purchases.filter((p) => {
    const matchSearch = p.product.toLowerCase().includes(search.toLowerCase());
    const matchTab =
      activeTab === "All" ||
      (activeTab === "Premium Stories" && p.type === "Story") ||
      (activeTab === "Premium Games"   && p.type === "Game") ||
      (activeTab === "Bundle"          && p.type === "Bundle") ||
      (activeTab === "Add-ons"         && p.type === "Add-on");
    return matchSearch && matchTab;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <h1 className="font-nunito font-semibold" style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}>
            Purchases &amp; Billing
          </h1>
          <p className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
            View your purchase history and manage payment methods.
          </p>
        </div>
        <Link
          href="/parent/purchases/add-payment"
          className="font-nunito font-bold text-white"
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            padding: "10px 14px", borderRadius: "8px",
            border: "1px solid #F63D68", background: "#F63D68",
            fontSize: "14px", lineHeight: "20px",
            boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
            textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
          }}
        >
          Add new Payment Method
        </Link>
      </div>

      {/* ── Metric Cards ── */}
      <div style={{ display: "flex", gap: "16px" }}>
        {[
          { label: "Total Amount Spent",       value: "$37.45" },
          { label: "Total Purchases",          value: "8 purchases" },
          { label: "Active Payment Methods",   value: "2 Card and 1 Paypal" },
        ].map((m) => (
          <div
            key={m.label}
            style={{
              flex: 1, background: "#FFFFFF",
              border: "1px solid #E5E5E5", borderRadius: "12px",
              padding: "20px", display: "flex", flexDirection: "column", gap: "8px",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
            }}
          >
            <span className="font-nunito font-medium" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
              {m.label}
            </span>
            <span className="font-nunito font-semibold" style={{ fontSize: "20px", lineHeight: "30px", color: "#141414" }}>
              {m.value}
            </span>
          </div>
        ))}
      </div>

      {/* ── Purchase History Table ── */}
      <div
        style={{
          background: "#FFFFFF", border: "1px solid #E5E5E5",
          borderRadius: "12px", padding: "20px",
          display: "flex", flexDirection: "column", gap: "20px",
        }}
      >
        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          {/* Filter tabs */}
          <div style={{ padding: "4px", background: "#FAFAFA", borderRadius: "10px", display: "flex", gap: "4px" }}>
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="font-nunito font-medium"
                style={{
                  padding: "4px 12px", borderRadius: "6px",
                  fontSize: "14px", lineHeight: "20px",
                  border: "none", cursor: "pointer",
                  color: activeTab === tab ? "#141414" : "#737373",
                  background: activeTab === tab ? "#FFFFFF" : "#FAFAFA",
                  boxShadow: activeTab === tab
                    ? "0px 1px 2px rgba(16,24,40,0.06), 0px 1px 3px rgba(16,24,40,0.10)"
                    : "none",
                  transition: "all 0.15s", whiteSpace: "nowrap",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Search */}
            <div style={{ position: "relative", width: "320px" }}>
              <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#A3A3A3" }} />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
                style={{
                  width: "100%", height: "44px",
                  paddingLeft: "42px", paddingRight: "14px",
                  borderRadius: "8px", border: "1px solid #E5E5E5",
                  fontSize: "16px", color: "#141414", background: "#FFFFFF",
                  boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
                }}
              />
            </div>
            {/* Filter button */}
            <button
              className="font-nunito font-bold"
              style={{
                display: "flex", alignItems: "center", gap: "4px",
                padding: "10px 14px", borderRadius: "8px",
                border: "1px solid #D6D6D6", background: "#FFFFFF",
                fontSize: "14px", lineHeight: "20px", color: "#424242",
                boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer",
              }}
            >
              <SlidersHorizontal size={20} style={{ color: "#424242" }} />
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #F2F4F7" }}>
          {/* Header */}
          <div style={{ display: "flex", background: "#FAFAFA", borderBottom: "1px solid #F2F4F7" }}>
            {["Date", "Product", "Type", "Payment", "Amount", "Status", "Actions"].map((col, i) => (
              <div
                key={col}
                style={{
                  padding: "14px 20px",
                  flex: i === 1 ? 2 : 1,
                  minWidth: i === 6 ? "100px" : undefined,
                }}
              >
                <span className="font-nunito font-semibold" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>
                  {col}
                </span>
              </div>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((row, i) => (
            <div
              key={row.id}
              style={{
                display: "flex", alignItems: "center",
                background: "#FFFFFF",
                borderBottom: i < filtered.length - 1 ? "1px solid #EAECF0" : "none",
              }}
            >
              {/* Date */}
              <div style={{ flex: 1, padding: "16px 20px" }}>
                <span className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
                  {row.date}
                </span>
              </div>
              {/* Product */}
              <div style={{ flex: 2, padding: "16px 20px" }}>
                <span className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
                  {row.product}
                </span>
              </div>
              {/* Type */}
              <div style={{ flex: 1, padding: "16px 20px" }}>
                <span className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
                  {row.type}
                </span>
              </div>
              {/* Payment */}
              <div style={{ flex: 1, padding: "16px 20px" }}>
                <span className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
                  {row.payment}
                </span>
              </div>
              {/* Amount */}
              <div style={{ flex: 1, padding: "16px 20px" }}>
                <span className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
                  {row.amount}
                </span>
              </div>
              {/* Status */}
              <div style={{ flex: 1, padding: "16px 20px" }}>
                <StatusBadge status={row.status} />
              </div>
              {/* Actions */}
              <div style={{ minWidth: "100px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Link
                  href={`/parent/purchases/${row.id}`}
                  style={{
                    width: "28px", height: "28px", borderRadius: "9999px",
                    background: "#FAFAFA", border: "1px solid #E5E5E5",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", flexShrink: 0, textDecoration: "none",
                  }}
                >
                  <Eye size={14} style={{ color: "#525252" }} />
                </Link>
                <button
                  style={{
                    width: "28px", height: "28px", borderRadius: "9999px",
                    background: "#FAFAFA", border: "1px solid #E5E5E5",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", flexShrink: 0,
                  }}
                >
                  <Trash2 size={14} style={{ color: "#525252" }} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", paddingTop: "20px", borderTop: "1px solid #E5E5E5" }}>
          <button
            className="font-nunito font-bold"
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "10px 14px", borderRadius: "8px",
              border: "1px solid #D6D6D6", background: "#FFFFFF",
              fontSize: "14px", lineHeight: "20px", color: "#424242",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer",
            }}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <div style={{ display: "flex", gap: "2px" }}>
            {["1", "2", "3", "...", "8", "9", "10"].map((p) => (
              <button
                key={p}
                className="font-nunito font-semibold"
                style={{
                  width: "40px", height: "40px", borderRadius: "8px",
                  border: "none", cursor: p === "..." ? "default" : "pointer",
                  fontSize: "14px",
                  background: p === "1" ? "#FAFAFA" : "transparent",
                  color: p === "1" ? "#424242" : "#525252",
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            className="font-nunito font-bold"
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "10px 14px", borderRadius: "8px",
              border: "1px solid #D6D6D6", background: "#FFFFFF",
              fontSize: "14px", lineHeight: "20px", color: "#424242",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer",
            }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

    </div>
  );
}
