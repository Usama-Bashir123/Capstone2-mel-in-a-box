"use client";

// Add New Payment Method — Figma node 214:14705
// Breadcrumb: "Purchases & Billing" > "Add new card" (Rosé/500)
// Card "Saved Cards":
//   - Two existing saved card rows (Visa + Mastercard) on #FAFAFA, r=8, p=16
//   - Each: card icon + "Visa ending in 1234" + "Expiry 06/2024" + edit button + billing email
// Add New Card form (inside same card, #FAFAFA bg, r=8, p=16):
//   - Card Type selector: Visa / Mastercard / PayPal icon buttons
//   - Row 1: Account Holder's Name + Account Number (side by side)
//   - Row 2: Expiry Date + CVV Code (side by side)
// Actions (right-aligned): Cancel + Save

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Pencil, Mail } from "lucide-react";

/* ── Input Field ───────────────────────────────────────── */
function InputField({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
      <label className="font-nunito font-semibold" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
        style={{
          width: "100%", height: "44px",
          padding: "10px 14px", borderRadius: "8px",
          border: "1px solid #E5E5E5", fontSize: "16px",
          color: "#141414", background: "#FFFFFF",
          boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

/* ── Saved Card Row ────────────────────────────────────── */
function SavedCardRow({
  brand,
  last4,
  expiry,
  email,
}: {
  brand: "Visa" | "Mastercard";
  last4: string;
  expiry: string;
  email: string;
}) {
  return (
    <div
      style={{
        background: "#FAFAFA", borderRadius: "8px",
        padding: "16px", display: "flex",
        alignItems: "center", gap: "16px",
      }}
    >
      {/* Card brand icon */}
      <div
        style={{
          width: "58px", height: "40px", borderRadius: "6px",
          border: "1px solid #EAECF0",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#FFFFFF", flexShrink: 0,
        }}
      >
        {brand === "Visa" ? (
          <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#172B85", letterSpacing: "1px" }}>VISA</span>
        ) : (
          <div style={{ display: "flex", gap: "-8px" }}>
            <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#EB001B", marginRight: "-6px", zIndex: 1 }} />
            <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#F79E1B" }} />
          </div>
        )}
      </div>

      {/* Card info */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
        <span className="font-nunito font-medium" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}>
          {brand} ending in {last4}
        </span>
        <span className="font-nunito font-normal" style={{ fontSize: "14px", lineHeight: "20px", color: "#525252" }}>
          Expiry {expiry}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
          <Mail size={16} style={{ color: "#525252", flexShrink: 0 }} />
          <span className="font-nunito font-normal" style={{ fontSize: "14px", lineHeight: "20px", color: "#525252" }}>
            {email}
          </span>
        </div>
      </div>

      {/* Edit button */}
      <button
        style={{
          width: "40px", height: "40px", borderRadius: "8px",
          background: "#FFFFFF", border: "1px solid #D6D6D6",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", flexShrink: 0,
          boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
        }}
      >
        <Pencil size={16} style={{ color: "#525252" }} />
      </button>
    </div>
  );
}

/* ── Card Type Button ──────────────────────────────────── */
function CardTypeButton({
  type,
  selected,
  onClick,
}: {
  type: "Visa" | "Mastercard" | "PayPal";
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "60px", height: "40px", borderRadius: "6.48px",
        border: `${selected ? "1.25px" : "1px"} solid ${selected ? "#F63D68" : "#E5E5E5"}`,
        background: "#FFFFFF",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", flexShrink: 0,
      }}
    >
      {type === "Visa" && (
        <span className="font-nunito font-bold" style={{ fontSize: "13px", color: "#172B85", letterSpacing: "0.5px" }}>VISA</span>
      )}
      {type === "Mastercard" && (
        <div style={{ display: "flex" }}>
          <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#EB001B", marginRight: "-5px", zIndex: 1 }} />
          <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#F79E1B" }} />
        </div>
      )}
      {type === "PayPal" && (
        <span className="font-nunito font-bold" style={{ fontSize: "11px", color: "#003087", letterSpacing: "0px" }}>
          Pay<span style={{ color: "#009CDE" }}>Pal</span>
        </span>
      )}
    </button>
  );
}

/* ── Page ──────────────────────────────────────────────── */
export default function AddPaymentPage() {
  const router = useRouter();
  const [cardType, setCardType] = useState<"Visa" | "Mastercard" | "PayPal">("Visa");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Breadcrumb ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Link
          href="/parent/purchases"
          className="font-nunito font-bold"
          style={{ fontSize: "14px", lineHeight: "20px", color: "#424242", textDecoration: "none" }}
        >
          Purchases &amp; Billing
        </Link>
        <ChevronRight size={16} style={{ color: "#737373" }} />
        <span className="font-nunito font-bold" style={{ fontSize: "14px", lineHeight: "20px", color: "#F63D68" }}>
          Add new card
        </span>
      </div>

      {/* ── Saved Cards Card ── */}
      <div
        style={{
          background: "#FFFFFF", border: "1px solid #E5E5E5",
          borderRadius: "12px", padding: "20px",
          display: "flex", flexDirection: "column", gap: "24px",
        }}
      >
        <span className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>
          Saved Cards
        </span>

        {/* Existing saved cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <SavedCardRow brand="Visa"       last4="1234" expiry="06/2024" email="billing@untitledui.com" />
          <SavedCardRow brand="Mastercard" last4="1234" expiry="06/2024" email="billing@untitledui.com" />
        </div>

        {/* Add New Card form */}
        <div
          style={{
            background: "#FAFAFA", borderRadius: "8px",
            padding: "16px", display: "flex",
            flexDirection: "column", gap: "16px",
          }}
        >
          {/* Card Type selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className="font-nunito font-semibold" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}>
              Card Type
            </label>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px" }}>
              {(["Visa", "Mastercard", "PayPal"] as const).map((t) => (
                <CardTypeButton
                  key={t}
                  type={t}
                  selected={cardType === t}
                  onClick={() => setCardType(t)}
                />
              ))}
            </div>
          </div>

          {/* Row 1: Account Holder's Name + Account Number */}
          <div style={{ display: "flex", gap: "12px" }}>
            <InputField label="Account Holder's Name" placeholder="Enter full name" />
            <InputField label="Account Number" placeholder="1234 5678 9012 3456" />
          </div>

          {/* Row 2: Expiry Date + CVV Code */}
          <div style={{ display: "flex", gap: "12px" }}>
            <InputField label="Expiry Date" placeholder="MM / YY" />
            <InputField label="CVV Code" placeholder="123" />
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "16px" }}>
          <button
            onClick={() => router.back()}
            className="font-nunito font-bold"
            style={{
              padding: "10px 14px", borderRadius: "8px",
              border: "1px solid #D6D6D6", background: "#FFFFFF",
              fontSize: "14px", lineHeight: "20px", color: "#424242",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            className="font-nunito font-bold text-white"
            style={{
              padding: "10px 14px", borderRadius: "8px",
              border: "1px solid #F63D68", background: "#F63D68",
              fontSize: "14px", lineHeight: "20px",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      </div>

    </div>
  );
}
