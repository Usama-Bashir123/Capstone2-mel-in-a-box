"use client";

// Checkout — Figma node 214:16576
// Success modal — Figma node 214:16285
// Failed payment modal — not in Figma, designed to match system

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft, X, CheckCircle2, XCircle } from "lucide-react";

/* ── Types ─────────────────────────────────────────────── */
type PaymentMethod = "card" | "paypal";

/* ── Input Field ───────────────────────────────────────── */
function InputField({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
      <label
        className="font-nunito font-medium"
        style={{ fontSize: "14px", lineHeight: "20px", color: "#344054" }}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
        style={{
          width: "100%",
          height: "44px",
          padding: "10px 14px",
          borderRadius: "8px",
          border: "1px solid #E5E5E5",
          fontSize: "16px",
          color: "#141414",
          background: "#FFFFFF",
          boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

/* ── Success Modal ─────────────────────────────────────── */
function SuccessModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const orderDetails = [
    { label: "Order No",                  value: "#8736357G5" },
    { label: "Order Date",                value: "29 Mar, 2024, 06:30 PM" },
    { label: "Estimated Delivery",        value: "16 Apr, 2024 at 4:00 PM" },
    { label: "Customer Services Contact", value: "(406) 555-0120" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        borderRadius: "24px",
      }}
    >
      <div
        style={{
          width: "700px",
          background: "#FFFFFF",
          border: "1px solid #E5E5E5",
          borderRadius: "12px",
          padding: "48px",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={24} style={{ color: "#525252" }} />
        </button>

        {/* Icon + text */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
          {/* Success illustration */}
          <div style={{ width: "90px", height: "90px", position: "relative", flexShrink: 0 }}>
            <Image
              src="/images/parent/premium-shop/order-success.png"
              alt="Order placed successfully"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <span
              className="font-nunito font-bold"
              style={{ fontSize: "30px", lineHeight: "38px", color: "#141414", textAlign: "center" }}
            >
              Order Placed Successfully
            </span>
            <span
              className="font-nunito font-normal"
              style={{ fontSize: "16px", lineHeight: "24px", color: "#525252", textAlign: "center" }}
            >
              Your Order has been confirmed and please find details below.
            </span>
          </div>
        </div>

        {/* Order details table */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {orderDetails.map((row, i) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: "16px",
                borderBottom: i < orderDetails.length - 1 ? "1px solid #E5E5E5" : "none",
              }}
            >
              <span
                className="font-nunito font-semibold"
                style={{ fontSize: "16px", lineHeight: "24px", color: "#292929" }}
              >
                {row.label}
              </span>
              <span
                className="font-nunito font-normal"
                style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
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
            Track Order
          </button>
          <button
            onClick={() => router.push("/parent/premium-shop")}
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
            Go Back to Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Failed Modal ──────────────────────────────────────── */
function FailedModal({ onClose, onRetry }: { onClose: () => void; onRetry: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        borderRadius: "24px",
      }}
    >
      <div
        style={{
          width: "700px",
          background: "#FFFFFF",
          border: "1px solid #E5E5E5",
          borderRadius: "12px",
          padding: "48px",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={24} style={{ color: "#525252" }} />
        </button>

        {/* Icon + text */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: "#FFF1F3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <XCircle size={48} style={{ color: "#F63D68" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <span
              className="font-nunito font-bold"
              style={{ fontSize: "30px", lineHeight: "38px", color: "#141414", textAlign: "center" }}
            >
              Payment Failed
            </span>
            <span
              className="font-nunito font-normal"
              style={{ fontSize: "16px", lineHeight: "24px", color: "#525252", textAlign: "center" }}
            >
              We were unable to process your payment. Please check your card details and try again.
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "16px" }}>
          <button
            onClick={onClose}
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
          <button
            onClick={onRetry}
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
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────── */
export default function CheckoutPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [coupon, setCoupon] = useState("");
  const [modalState, setModalState] = useState<"idle" | "success" | "failed">("idle");

  function handlePlaceOrder() {
    // Demo: alternate between success/failed on each click for testing
    // In production this would call a payment API
    setModalState("success");
  }

  const orderItems = [
    {
      title: "Mel and the Snowy Adventure",
      category: "Premium Story",
      price: "$9.99",
      image: "/images/parent/premium-shop/product-snowy-adventure.png",
    },
    {
      title: "Party Games Add-on Pack",
      category: "Add-ons",
      price: "$1.99",
      image: "/images/parent/premium-shop/product-party-games.png",
    },
  ];

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* ── Breadcrumb ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link
            href="/parent/premium-shop"
            className="font-nunito font-bold"
            style={{ fontSize: "14px", lineHeight: "20px", color: "#424242", textDecoration: "none" }}
          >
            Premium Shop
          </Link>
          <ChevronRight size={16} style={{ color: "#737373" }} />
          <Link
            href="/parent/premium-shop/1"
            className="font-nunito font-bold"
            style={{ fontSize: "14px", lineHeight: "20px", color: "#424242", textDecoration: "none" }}
          >
            Mel and the Snowy Adventure
          </Link>
          <ChevronRight size={16} style={{ color: "#737373" }} />
          <span
            className="font-nunito font-bold"
            style={{ fontSize: "14px", lineHeight: "20px", color: "#F63D68" }}
          >
            Purchasing
          </span>
        </div>

        {/* ── Main card ── */}
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
          {/* Card header: back arrow + Checkout title */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => router.back()}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ArrowLeft size={24} style={{ color: "#141414" }} />
            </button>
            <span
              className="font-nunito font-semibold"
              style={{ fontSize: "24px", lineHeight: "32px", color: "#141414" }}
            >
              Checkout
            </span>
          </div>

          {/* Two-column layout: [Left: forms] [Right: order summary] */}
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>

            {/* ── LEFT COLUMN ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "640px", flexShrink: 0 }}>

              {/* Billing Information */}
              <div
                style={{
                  border: "1px solid #E5E5E5",
                  borderRadius: "12px",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <span
                  className="font-nunito font-semibold"
                  style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}
                >
                  Billing Information
                </span>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {/* Row 1: First Name + Last Name */}
                  <div style={{ display: "flex", gap: "12px" }}>
                    <InputField label="First Name" placeholder="Enter first name" />
                    <InputField label="Last Name" placeholder="Enter last name" />
                  </div>

                  {/* Row 2: Email + Phone */}
                  <div style={{ display: "flex", gap: "12px" }}>
                    <InputField label="Email Address" placeholder="Enter email address" type="email" />
                    <InputField label="Phone Number" placeholder="+1 (555) 000-0000" type="tel" />
                  </div>

                  {/* Row 3: State + City + ZIP */}
                  <div style={{ display: "flex", gap: "12px" }}>
                    <InputField label="State" placeholder="Select state" />
                    <InputField label="City" placeholder="Select city" />
                    <InputField label="ZIP Code" placeholder="Enter ZIP" />
                  </div>

                  {/* Row 4: Street Address (full width) */}
                  <InputField label="Street Address" placeholder="Enter street address" />
                </div>
              </div>

              {/* Payment Option */}
              <div
                style={{
                  border: "1px solid #E5E5E5",
                  borderRadius: "12px",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <span
                  className="font-nunito font-semibold"
                  style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}
                >
                  Payment Option
                </span>

                {/* Payment method selector cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {/* Credit/Debit Card option */}
                  <button
                    onClick={() => setPaymentMethod("card")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "16px",
                      borderRadius: "8px",
                      border: `1px solid ${paymentMethod === "card" ? "#F63D68" : "#E5E5E5"}`,
                      background: "#FAFAFA",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        border: `2px solid ${paymentMethod === "card" ? "#F63D68" : "#D6D6D6"}`,
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {paymentMethod === "card" && (
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#F63D68" }} />
                      )}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span
                        className="font-nunito font-semibold"
                        style={{ fontSize: "14px", lineHeight: "20px", color: "#141414" }}
                      >
                        Credit / Debit Card
                      </span>
                      <span
                        className="font-nunito font-normal"
                        style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}
                      >
                        Pay securely with your card
                      </span>
                    </div>
                  </button>

                  {/* PayPal option */}
                  <button
                    onClick={() => setPaymentMethod("paypal")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "16px",
                      borderRadius: "8px",
                      border: `1px solid ${paymentMethod === "paypal" ? "#F63D68" : "#E5E5E5"}`,
                      background: "#FAFAFA",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        border: `2px solid ${paymentMethod === "paypal" ? "#F63D68" : "#D6D6D6"}`,
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {paymentMethod === "paypal" && (
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#F63D68" }} />
                      )}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span
                        className="font-nunito font-semibold"
                        style={{ fontSize: "14px", lineHeight: "20px", color: "#141414" }}
                      >
                        PayPal
                      </span>
                      <span
                        className="font-nunito font-normal"
                        style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}
                      >
                        Pay with your PayPal account
                      </span>
                    </div>
                  </button>
                </div>

                {/* Card payment fields (visible when card selected) */}
                {paymentMethod === "card" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {/* Card Number */}
                    <InputField label="Card Number" placeholder="1234 5678 9012 3456" />

                    {/* Name + Expiry */}
                    <div style={{ display: "flex", gap: "12px" }}>
                      <InputField label="Name on Card" placeholder="Full name on card" />
                      <InputField label="Expiry Date" placeholder="MM / YY" />
                    </div>

                    {/* CVV + ZIP */}
                    <div style={{ display: "flex", gap: "12px" }}>
                      <InputField label="CVV" placeholder="123" />
                      <InputField label="Billing ZIP Code" placeholder="Enter ZIP" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT COLUMN: Order Summary ── */}
            <div
              style={{
                flex: 1,
                border: "1px solid #E5E5E5",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* Header with bottom divider */}
              <div
                style={{
                  paddingBottom: "20px",
                  borderBottom: "1px solid #E5E5E5",
                }}
              >
                <span
                  className="font-nunito font-semibold"
                  style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}
                >
                  Order Summary
                </span>
              </div>

              {/* Product list with bottom divider */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  paddingBottom: "20px",
                  borderBottom: "1px solid #E5E5E5",
                }}
              >
                {orderItems.map((item) => (
                  <div
                    key={item.title}
                    style={{
                      background: "#FAFAFA",
                      borderRadius: "12px",
                      padding: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    {/* Product thumbnail */}
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "8px",
                        border: "1px solid #E5E5E5",
                        position: "relative",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      <Image src={item.image} alt={item.title} fill style={{ objectFit: "cover" }} />
                    </div>

                    {/* Product info */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span
                        className="font-nunito font-semibold"
                        style={{ fontSize: "14px", lineHeight: "20px", color: "#141414" }}
                      >
                        {item.title}
                      </span>
                      <span
                        className="font-nunito font-normal"
                        style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}
                      >
                        {item.category}
                      </span>
                    </div>

                    {/* Price */}
                    <span
                      className="font-nunito font-semibold"
                      style={{ fontSize: "14px", lineHeight: "20px", color: "#292929", flexShrink: 0 }}
                    >
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon code */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <input
                  type="text"
                  placeholder="Enter Coupon Number"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
                  style={{
                    flex: 1,
                    height: "44px",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #E5E5E5",
                    fontSize: "16px",
                    color: "#141414",
                    background: "#FFFFFF",
                    boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
                  }}
                />
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
                    whiteSpace: "nowrap",
                  }}
                >
                  Apply
                </button>
              </div>

              {/* Order totals with bottom divider */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  paddingBottom: "20px",
                  borderBottom: "1px solid #EAECF0",
                }}
              >
                {[
                  { label: "Sub Total",        value: "$11.98" },
                  { label: "Delivery Charge",  value: "FREE" },
                  { label: "Total",            value: "$11.98" },
                ].map((row) => (
                  <div
                    key={row.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      className="font-nunito font-medium"
                      style={{ fontSize: "14px", lineHeight: "20px", color: "#737373" }}
                    >
                      {row.label}
                    </span>
                    <span
                      className="font-nunito font-bold"
                      style={{ fontSize: "14px", lineHeight: "20px", color: "#292929" }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Place Order button */}
              <button
                onClick={handlePlaceOrder}
                className="font-nunito font-bold text-white"
                style={{
                  width: "100%",
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
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {modalState === "success" && (
        <SuccessModal onClose={() => setModalState("idle")} />
      )}
      {modalState === "failed" && (
        <FailedModal
          onClose={() => setModalState("idle")}
          onRetry={() => setModalState("idle")}
        />
      )}
    </>
  );
}
