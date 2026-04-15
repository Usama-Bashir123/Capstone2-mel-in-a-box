"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, Trash2, BookOpen } from "lucide-react";

// ── Mock data ─────────────────────────────────────────────────────

const PARENTS = [
  { id: "1", name: "Sarah Lee",    email: "alma.lawson@example.com",    status: "Active",  createdOn: "Today, 9:12 AM"    },
  { id: "2", name: "Mike Brown",   email: "sara.cruz@example.com",      status: "Disable", createdOn: "Yesterday, 5:20PM" },
  { id: "3", name: "Aisha Khan",   email: "debra.holt@example.com",     status: "Active",  createdOn: "Yesterday, 5:20PM" },
  { id: "4", name: "David Wilson", email: "michael.mitc@example.com",   status: "Disable", createdOn: "Mar 14, 2025"      },
  { id: "5", name: "Emma Clark",   email: "kenzi.lawson@example.com",   status: "Disable", createdOn: "Mar 10, 2025"      },
  { id: "6", name: "Liam Taylor",  email: "georgia.young@example.com",  status: "Disable", createdOn: "Mar 03, 2025"      },
  { id: "7", name: "David Carl",   email: "nathan.roberts@example.com", status: "Active",  createdOn: "Feb 27, 2025"      },
  { id: "8", name: "Mary Jane",    email: "bill.sanders@example.com",   status: "Active",  createdOn: "Feb 27, 2025"      },
];

const CHILDREN: Record<string, Array<{
  name: string; age: number; storiesCompleted: number; badges: number;
}>> = {
  "1": [
    { name: "Mia",  age: 4, storiesCompleted: 2, badges: 5 },
    { name: "Noah", age: 6, storiesCompleted: 4, badges: 6 },
  ],
  "2": [{ name: "Noah",  age: 6, storiesCompleted: 1, badges: 6 }],
  "3": [
    { name: "Rayan", age: 7, storiesCompleted: 2, badges: 7 },
    { name: "Hana",  age: 5, storiesCompleted: 3, badges: 5 },
  ],
  "4": [{ name: "Hana",  age: 7, storiesCompleted: 1, badges: 7 }],
  "5": [
    { name: "Jacob", age: 6, storiesCompleted: 3, badges: 6 },
    { name: "Lily",  age: 4, storiesCompleted: 1, badges: 3 },
    { name: "Sam",   age: 8, storiesCompleted: 2, badges: 8 },
  ],
  "6": [{ name: "Zoe",   age: 4, storiesCompleted: 1, badges: 4 }],
  "7": [{ name: "Rayan", age: 8, storiesCompleted: 1, badges: 8 }],
  "8": [
    { name: "Noah", age: 3, storiesCompleted: 2, badges: 2 },
    { name: "Mia",  age: 5, storiesCompleted: 1, badges: 3 },
  ],
};

type PurchaseItem = { no: string; title: string; price: string; coverTop: string; coverBottom: string };
const PURCHASE_HISTORY: Record<string, PurchaseItem[]> = {
  "1": [
    { no: "01", title: "The Magical Jungle",  price: "$4.99", coverTop: "#4ADE80", coverBottom: "#166534" },
    { no: "02", title: "Space Explorer Mel",  price: "$2.99", coverTop: "#60A5FA", coverBottom: "#1E3A8A" },
  ],
  "2": [
    { no: "01", title: "Ocean Adventure",     price: "$3.99", coverTop: "#38BDF8", coverBottom: "#0C4A6E" },
  ],
  "3": [
    { no: "01", title: "The Magical Jungle",  price: "$4.99", coverTop: "#4ADE80", coverBottom: "#166534" },
    { no: "02", title: "Desert Safari Mel",   price: "$3.49", coverTop: "#FBBF24", coverBottom: "#92400E" },
  ],
  "4": [
    { no: "01", title: "Space Explorer Mel",  price: "$2.99", coverTop: "#60A5FA", coverBottom: "#1E3A8A" },
  ],
  "5": [
    { no: "01", title: "The Magical Jungle",  price: "$4.99", coverTop: "#4ADE80", coverBottom: "#166534" },
    { no: "02", title: "Ocean Adventure",     price: "$3.99", coverTop: "#38BDF8", coverBottom: "#0C4A6E" },
    { no: "03", title: "Space Explorer Mel",  price: "$2.99", coverTop: "#60A5FA", coverBottom: "#1E3A8A" },
  ],
  "6": [
    { no: "01", title: "Desert Safari Mel",   price: "$3.49", coverTop: "#FBBF24", coverBottom: "#92400E" },
  ],
  "7": [
    { no: "01", title: "The Magical Jungle",  price: "$4.99", coverTop: "#4ADE80", coverBottom: "#166534" },
  ],
  "8": [
    { no: "01", title: "Space Explorer Mel",  price: "$2.99", coverTop: "#60A5FA", coverBottom: "#1E3A8A" },
    { no: "02", title: "Ocean Adventure",     price: "$3.99", coverTop: "#38BDF8", coverBottom: "#0C4A6E" },
  ],
};

// ── Primitives ────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const active = status === "Active";
  return (
    <span
      className="font-nunito font-semibold"
      style={{
        display: "inline-flex", alignItems: "center",
        fontSize: "12px", lineHeight: "18px",
        padding: "2px 8px", borderRadius: "9999px",
        background: active ? "#ECFDF3" : "#FEF3F2",
        border: `1px solid ${active ? "#ABEFC6" : "#FDA29B"}`,
        color: active ? "#067647" : "#F04438",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────

export default function ParentDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const parent   = PARENTS.find((p) => p.id === id);
  const children = CHILDREN[id] ?? [];
  const purchases = PURCHASE_HISTORY[id] ?? [];

  if (!parent) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "300px", gap: "12px" }}>
        <p className="font-nunito font-semibold" style={{ fontSize: "18px", color: "#141414" }}>Parent not found</p>
        <Link href="/admin/users" className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#F63D68", textDecoration: "none" }}>
          ← Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Breadcrumb + Action buttons row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link
            href="/admin/users"
            className="font-nunito font-bold"
            style={{ fontSize: "14px", color: "#424242", textDecoration: "none" }}
          >
            Users
          </Link>
          <ChevronRight size={16} style={{ color: "#A3A3A3", flexShrink: 0 }} />
          <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>
            {parent.name}
          </span>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Delete (trash icon only) */}
          <button
            style={{
              width: "40px", height: "40px", borderRadius: "8px",
              border: "1px solid #FECDCA", background: "#FEF3F2",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
              flexShrink: 0,
            }}
          >
            <Trash2 size={16} style={{ color: "#F04438" }} />
          </button>

          {/* Disable Account */}
          <button
            className="font-nunito font-bold"
            style={{
              padding: "10px 14px", borderRadius: "8px",
              border: "1px solid #D6D6D6", background: "#FFFFFF",
              fontSize: "14px", color: "#424242", cursor: "pointer",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", whiteSpace: "nowrap",
            }}
          >
            Disable Account
          </button>

          {/* Reset Password */}
          <button
            className="font-nunito font-bold"
            style={{
              padding: "10px 14px", borderRadius: "8px",
              border: "1px solid #F63D68", background: "#F63D68",
              fontSize: "14px", color: "#FFFFFF", cursor: "pointer",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", whiteSpace: "nowrap",
            }}
          >
            Reset Password
          </button>
        </div>
      </div>

      {/* ── Card stack ─────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* 1. Parents Information */}
        <div style={{
          background: "#FFFFFF", border: "1px solid #E5E5E5",
          borderRadius: "12px", padding: "20px",
          boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
        }}>
          <h3 className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414", margin: "0 0 24px 0" }}>
            Parents Information
          </h3>

          {/* 2-column field grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <FieldItem label="Name"            value={parent.name}       />
            <FieldItem label="Email Address"   value={parent.email}      />
            <FieldItem label="Account Created" value={parent.createdOn}  />
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start" }}>
              <span className="font-nunito" style={{ fontWeight: 500, fontSize: "14px", color: "#424242" }}>Status</span>
              <StatusBadge status={parent.status} />
            </div>
          </div>
        </div>

        {/* 2. Child Profiles */}
        <div style={{
          background: "#FFFFFF", border: "1px solid #E5E5E5",
          borderRadius: "12px", padding: "20px",
          boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
        }}>
          <h3 className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414", margin: "0 0 24px 0" }}>
            Child Profiles
          </h3>

          {children.length === 0 ? (
            <p className="font-nunito font-normal" style={{ fontSize: "14px", color: "#A3A3A3" }}>
              No children linked to this parent.
            </p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
              {children.map((child, i) => (
                <div
                  key={i}
                  style={{
                    background: "#FAFAFA", borderRadius: "12px",
                    padding: "16px", minWidth: "200px", flex: "1",
                    display: "flex", flexDirection: "column", gap: "20px",
                  }}
                >
                  <FieldItem label="Name"              value={child.name}                          />
                  <FieldItem label="Age"               value={`${child.age} Years`}               />
                  <FieldItem label="Stories Completed" value={`${child.storiesCompleted} Stories`} />
                  <FieldItem label="Badges"            value={`${child.badges} Badges`}           />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Purchase History */}
        <div style={{
          background: "#FFFFFF", border: "1px solid #E5E5E5",
          borderRadius: "12px", padding: "20px",
          boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
        }}>
          <h3 className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414", margin: "0 0 24px 0" }}>
            Purchase History
          </h3>

          {purchases.length === 0 ? (
            <p className="font-nunito font-normal" style={{ fontSize: "14px", color: "#A3A3A3" }}>
              No purchases yet.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {purchases.map((item) => (
                <div
                  key={item.no}
                  style={{
                    background: "#FAFAFA", borderRadius: "12px", padding: "12px",
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between", gap: "16px",
                  }}
                >
                  {/* Left: index + book cover widget + title */}
                  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <span className="font-nunito font-normal" style={{ fontSize: "16px", color: "#141414", minWidth: "24px" }}>
                      {item.no}
                    </span>

                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      {/* Book cover widget */}
                      <div style={{
                        width: "36px", height: "48px", borderRadius: "6px", flexShrink: 0,
                        background: `linear-gradient(160deg, ${item.coverTop} 0%, ${item.coverBottom} 100%)`,
                        border: "0.5px solid rgba(0,0,0,0.10)",
                        boxShadow: "2px 2px 6px rgba(0,0,0,0.12)",
                        position: "relative", overflow: "hidden",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {/* Spine line */}
                        <div style={{
                          position: "absolute", left: "7px", top: 0, bottom: 0,
                          width: "1px", background: "rgba(255,255,255,0.25)",
                        }} />
                        {/* Book icon */}
                        <BookOpen size={14} style={{ color: "rgba(255,255,255,0.85)", flexShrink: 0 }} />
                      </div>

                      <span className="font-nunito font-semibold" style={{ fontSize: "16px", color: "#141414" }}>
                        {item.title}
                      </span>
                    </div>
                  </div>

                  {/* Right: price */}
                  <span className="font-nunito" style={{ fontWeight: 500, fontSize: "16px", color: "#17B26A", whiteSpace: "nowrap" }}>
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ── Field label + value pair ──────────────────────────────────────
function FieldItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <span className="font-nunito" style={{ fontWeight: 500, fontSize: "14px", color: "#424242" }}>
        {label}
      </span>
      <span className="font-nunito font-semibold" style={{ fontSize: "16px", color: "#141414" }}>
        {value}
      </span>
    </div>
  );
}
