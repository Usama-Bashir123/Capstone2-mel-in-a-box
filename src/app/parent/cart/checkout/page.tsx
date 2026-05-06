"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { ChevronRight, CreditCard, Lock, CheckCircle, X, Plus, Truck, ShieldCheck, Tag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

// ── Valid promo codes ─────────────────────────────────────────────
const PROMO_CODES: Record<string, number> = {
  PARTY30: 0.30,
  MEL10:   0.10,
  SAVE20:  0.20,
};

// ── Add Card Modal ────────────────────────────────────────────────

interface SavedCard {
  id: string;
  last4: string;
  brand: string;
  expiry: string;
  holder: string;
}

function formatCardNumber(val: string) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})/g, "$1 ").trim();
}

function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

function AddCardModal({ onClose, onSave }: { onClose: () => void; onSave: (card: SavedCard) => void }) {
  const [cardNumber, setCardNumber] = useState("");
  const [holder, setHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    const digits = cardNumber.replace(/\s/g, "");
    if (digits.length < 16) e.cardNumber = "Enter a valid 16-digit card number";
    if (!holder.trim()) e.holder = "Cardholder name is required";
    if (expiry.length < 5) e.expiry = "Enter a valid expiry date (MM/YY)";
    if (cvv.length < 3) e.cvv = "Enter a valid CVV";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const digits = cardNumber.replace(/\s/g, "");
    onSave({
      id: Date.now().toString(),
      last4: digits.slice(-4),
      brand: digits.startsWith("4") ? "Visa" : digits.startsWith("5") ? "Mastercard" : "Card",
      expiry,
      holder,
    });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "#FFFFFF", borderRadius: "16px", width: "100%", maxWidth: "480px", boxShadow: "0px 20px 60px rgba(16,24,40,0.2)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #F5F5F5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#FFF1F3", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CreditCard size={18} style={{ color: "#F63D68" }} />
            </div>
            <h2 className="font-nunito font-bold" style={{ fontSize: "18px", color: "#141414", margin: 0 }}>Add New Card</h2>
          </div>
          <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #E5E5E5", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#525252" }}>
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Card Number */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#424242" }}>Card Number <span style={{ color: "#F63D68" }}>*</span></label>
            <div style={{ position: "relative" }}>
              <CreditCard size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#A3A3A3" }} />
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
                style={{ width: "100%", height: "44px", paddingLeft: "40px", paddingRight: "14px", borderRadius: "8px", border: `1px solid ${errors.cardNumber ? "#F04438" : "#E5E5E5"}`, fontSize: "16px", color: "#141414", background: "#FFFFFF", boxSizing: "border-box", letterSpacing: "0.05em" }}
              />
            </div>
            {errors.cardNumber && <span className="font-nunito" style={{ fontSize: "12px", color: "#F04438" }}>{errors.cardNumber}</span>}
          </div>

          {/* Cardholder Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#424242" }}>Cardholder Name <span style={{ color: "#F63D68" }}>*</span></label>
            <input
              type="text"
              value={holder}
              onChange={(e) => setHolder(e.target.value)}
              placeholder="John Smith"
              className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
              style={{ width: "100%", height: "44px", padding: "10px 14px", borderRadius: "8px", border: `1px solid ${errors.holder ? "#F04438" : "#E5E5E5"}`, fontSize: "16px", color: "#141414", background: "#FFFFFF", boxSizing: "border-box" }}
            />
            {errors.holder && <span className="font-nunito" style={{ fontSize: "12px", color: "#F04438" }}>{errors.holder}</span>}
          </div>

          {/* Expiry + CVV */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#424242" }}>Expiry Date <span style={{ color: "#F63D68" }}>*</span></label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
                style={{ width: "100%", height: "44px", padding: "10px 14px", borderRadius: "8px", border: `1px solid ${errors.expiry ? "#F04438" : "#E5E5E5"}`, fontSize: "16px", color: "#141414", background: "#FFFFFF", boxSizing: "border-box" }}
              />
              {errors.expiry && <span className="font-nunito" style={{ fontSize: "12px", color: "#F04438" }}>{errors.expiry}</span>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#424242" }}>CVV <span style={{ color: "#F63D68" }}>*</span></label>
              <input
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="•••"
                className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
                style={{ width: "100%", height: "44px", padding: "10px 14px", borderRadius: "8px", border: `1px solid ${errors.cvv ? "#F04438" : "#E5E5E5"}`, fontSize: "16px", color: "#141414", background: "#FFFFFF", boxSizing: "border-box" }}
              />
              {errors.cvv && <span className="font-nunito" style={{ fontSize: "12px", color: "#F04438" }}>{errors.cvv}</span>}
            </div>
          </div>

          {/* Security note */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#F9FAFB", borderRadius: "8px", padding: "10px 12px" }}>
            <Lock size={14} style={{ color: "#525252", flexShrink: 0 }} />
            <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#525252" }}>Your payment information is encrypted and secure.</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "0 24px 20px", display: "flex", gap: "10px" }}>
          <button onClick={onClose} className="font-nunito font-bold" style={{ flex: 1, height: "44px", borderRadius: "8px", border: "1px solid #E5E5E5", background: "#FFFFFF", fontSize: "14px", color: "#525252", cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={handleSave} className="font-nunito font-bold" style={{ flex: 1, height: "44px", borderRadius: "8px", border: "none", background: "#F63D68", fontSize: "14px", color: "#FFFFFF", cursor: "pointer", boxShadow: "0px 2px 8px rgba(246,61,104,0.3)" }}>
            Save Card
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Order Placed Modal ────────────────────────────────────────────

function OrderPlacedModal({ orderRef, onClose }: { orderRef: string; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "#FFFFFF", borderRadius: "20px", width: "100%", maxWidth: "440px", padding: "40px 32px", textAlign: "center", boxShadow: "0px 20px 60px rgba(16,24,40,0.2)", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
        {/* Success icon */}
        <div style={{ position: "relative" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #F63D68 0%, #FF6B9D 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0px 8px 24px rgba(246,61,104,0.35)" }}>
            <CheckCircle size={40} style={{ color: "#FFFFFF" }} />
          </div>
          <div style={{ position: "absolute", inset: "-10px", borderRadius: "50%", border: "2px solid rgba(246,61,104,0.2)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: "-20px", borderRadius: "50%", border: "1px solid rgba(246,61,104,0.1)", pointerEvents: "none" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <h2 className="font-nunito font-bold" style={{ fontSize: "24px", color: "#141414", margin: 0 }}>Order Placed!</h2>
          <p className="font-nunito font-normal" style={{ fontSize: "15px", color: "#525252", margin: 0, lineHeight: "1.5" }}>
            Your order has been placed successfully. You&apos;ll receive a confirmation email shortly.
          </p>
        </div>

        <div style={{ background: "#FFF5F6", borderRadius: "10px", padding: "12px 20px", border: "1px solid #FECDD6", width: "100%" }}>
          <p className="font-nunito font-normal" style={{ fontSize: "12px", color: "#737373", margin: "0 0 4px" }}>Order Reference</p>
          <p className="font-nunito font-bold" style={{ fontSize: "16px", color: "#F63D68", margin: 0, letterSpacing: "0.05em" }}>{orderRef}</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#F0FDF4", borderRadius: "10px", padding: "12px 16px", width: "100%" }}>
          <Truck size={18} style={{ color: "#12B76A", flexShrink: 0 }} />
          <p className="font-nunito font-normal" style={{ fontSize: "13px", color: "#374151", margin: 0 }}>
            Digital items will be available in your dashboard within minutes.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
          <Link href="/parent/party-themes" onClick={onClose} className="font-nunito font-bold"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", width: "100%", height: "48px", borderRadius: "10px", background: "#F63D68", color: "#FFFFFF", textDecoration: "none", fontSize: "15px", boxShadow: "0px 4px 12px rgba(246,61,104,0.3)" }}>
            Continue Shopping
          </Link>
          <Link href="/parent" onClick={onClose} className="font-nunito font-semibold"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "44px", borderRadius: "10px", border: "1px solid #E5E5E5", background: "#FFFFFF", color: "#525252", textDecoration: "none", fontSize: "14px" }}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Field component ───────────────────────────────────────────────

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#424242" }}>
        {label}{required && <span style={{ color: "#F63D68" }}> *</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", height: "44px", padding: "10px 14px", borderRadius: "8px",
  border: "1px solid #E5E5E5", fontSize: "15px", color: "#141414",
  background: "#FFFFFF", boxSizing: "border-box",
};

// ── Checkout Page ─────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, totalItems, clearCart } = useCart();

  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [orderRef, setOrderRef] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  // Delivery fields
  const [delivery, setDelivery] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", zip: "",
  });
  const setField = (k: keyof typeof delivery) => (v: string) => setDelivery((p) => ({ ...p, [k]: v }));

  // Promo code in order summary
  const [promoCode, setPromoCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [promoError, setPromoError] = useState("");

  const discountRate = appliedCode ? (PROMO_CODES[appliedCode] ?? 0) : 0;
  const discount = subtotal * discountRate;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + tax;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES[code] !== undefined) {
      setAppliedCode(code);
      setPromoError("");
    } else {
      setAppliedCode(null);
      setPromoError("Invalid code. Try PARTY30.");
    }
  };

  const handleSaveCard = useCallback((card: SavedCard) => {
    setSavedCards((prev) => [...prev, card]);
    setSelectedCard(card.id);
    setShowAddCard(false);
  }, []);

  const handlePlaceOrder = () => {
    if (!selectedCard) { alert("Please add and select a payment card."); return; }
    if (!delivery.firstName.trim() || !delivery.email.trim()) { alert("Please fill in your name and email."); return; }
    setPlacing(true);
    setTimeout(() => {
      const ref = "MEL-" + Math.random().toString(36).toUpperCase().slice(2, 8);
      setOrderRef(ref);
      clearCart();
      setPlacing(false);
    }, 1200);
  };

  if (items.length === 0 && !orderRef) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link href="/parent/party-themes" className="font-nunito font-bold" style={{ fontSize: "14px", color: "#424242", textDecoration: "none" }}>Party Themes</Link>
          <ChevronRight size={16} style={{ color: "#A3A3A3" }} />
          <Link href="/parent/cart" className="font-nunito font-bold" style={{ fontSize: "14px", color: "#424242", textDecoration: "none" }}>Cart</Link>
          <ChevronRight size={16} style={{ color: "#A3A3A3" }} />
          <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>Checkout</span>
        </div>
        <div style={{ background: "#FFFFFF", borderRadius: "12px", border: "1px solid #E5E5E5", padding: "60px", textAlign: "center" }}>
          <p className="font-nunito font-bold" style={{ fontSize: "18px", color: "#141414", margin: "0 0 8px" }}>Your cart is empty</p>
          <Link href="/parent/party-themes" className="font-nunito font-semibold" style={{ color: "#F63D68", textDecoration: "none" }}>Browse Party Themes</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link href="/parent/party-themes" className="font-nunito font-bold" style={{ fontSize: "14px", color: "#424242", textDecoration: "none" }}>Party Themes</Link>
          <ChevronRight size={16} style={{ color: "#A3A3A3" }} />
          <Link href="/parent/cart" className="font-nunito font-bold" style={{ fontSize: "14px", color: "#424242", textDecoration: "none" }}>Cart</Link>
          <ChevronRight size={16} style={{ color: "#A3A3A3" }} />
          <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>Checkout</span>
        </div>

        <h1 className="font-nunito font-bold" style={{ fontSize: "24px", color: "#141414", margin: 0 }}>Checkout</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "20px", alignItems: "start" }}>

          {/* ── Left column ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Delivery Info */}
            <div style={{ background: "#FFFFFF", borderRadius: "12px", border: "1px solid #E5E5E5", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#FFF1F3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Truck size={16} style={{ color: "#F63D68" }} />
                </div>
                <h2 className="font-nunito font-bold" style={{ fontSize: "16px", color: "#141414", margin: 0 }}>Delivery Information</h2>
              </div>

              {/* First Name + Last Name */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Field label="First Name" required>
                  <input type="text" value={delivery.firstName} onChange={(e) => setField("firstName")(e.target.value)}
                    placeholder="John" className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none" style={inputStyle} />
                </Field>
                <Field label="Last Name" required>
                  <input type="text" value={delivery.lastName} onChange={(e) => setField("lastName")(e.target.value)}
                    placeholder="Smith" className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none" style={inputStyle} />
                </Field>
              </div>

              {/* Email + Phone */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Field label="Email Address" required>
                  <input type="email" value={delivery.email} onChange={(e) => setField("email")(e.target.value)}
                    placeholder="john@example.com" className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none" style={inputStyle} />
                </Field>
                <Field label="Phone Number">
                  <input type="tel" value={delivery.phone} onChange={(e) => setField("phone")(e.target.value)}
                    placeholder="+1 (555) 000-0000" className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none" style={inputStyle} />
                </Field>
              </div>

              {/* Address */}
              <Field label="Street Address">
                <input type="text" value={delivery.address} onChange={(e) => setField("address")(e.target.value)}
                  placeholder="123 Main Street, Apt 4B" className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none" style={inputStyle} />
              </Field>

              {/* City + State + Zip */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <Field label="City">
                  <input type="text" value={delivery.city} onChange={(e) => setField("city")(e.target.value)}
                    placeholder="New York" className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none" style={inputStyle} />
                </Field>
                <Field label="State">
                  <input type="text" value={delivery.state} onChange={(e) => setField("state")(e.target.value)}
                    placeholder="NY" className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none" style={inputStyle} />
                </Field>
                <Field label="ZIP Code">
                  <input type="text" value={delivery.zip} onChange={(e) => setField("zip")(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="10001" className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none" style={inputStyle} />
                </Field>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", background: "#F0FDF4", borderRadius: "8px", padding: "10px 12px" }}>
                <Truck size={14} style={{ color: "#12B76A", flexShrink: 0, marginTop: "2px" }} />
                <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#374151" }}>
                  Address is optional for digital add-ons — they&apos;ll be available instantly in your dashboard.
                </span>
              </div>
            </div>

            {/* Payment */}
            <div style={{ background: "#FFFFFF", borderRadius: "12px", border: "1px solid #E5E5E5", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#FFF1F3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CreditCard size={16} style={{ color: "#F63D68" }} />
                  </div>
                  <h2 className="font-nunito font-bold" style={{ fontSize: "16px", color: "#141414", margin: 0 }}>Payment Method</h2>
                </div>
                <button onClick={() => setShowAddCard(true)} className="font-nunito font-bold"
                  style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", border: "1px solid #F63D68", background: "#FFF1F3", color: "#F63D68", fontSize: "13px", cursor: "pointer" }}>
                  <Plus size={14} /> Add new card
                </button>
              </div>

              {savedCards.length === 0 ? (
                <div onClick={() => setShowAddCard(true)}
                  style={{ border: "2px dashed #E5E5E5", borderRadius: "10px", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#FFF1F3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CreditCard size={20} style={{ color: "#F63D68" }} />
                  </div>
                  <p className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#525252", margin: 0 }}>No cards saved yet</p>
                  <p className="font-nunito font-normal" style={{ fontSize: "13px", color: "#A3A3A3", margin: 0 }}>Click to add a payment card</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {savedCards.map((card) => (
                    <div key={card.id} onClick={() => setSelectedCard(card.id)}
                      style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "10px", border: `2px solid ${selectedCard === card.id ? "#F63D68" : "#E5E5E5"}`, background: selectedCard === card.id ? "#FFF5F6" : "#FFFFFF", cursor: "pointer", transition: "border-color 0.15s, background 0.15s" }}>
                      <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${selectedCard === card.id ? "#F63D68" : "#D4D4D4"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {selectedCard === card.id && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#F63D68" }} />}
                      </div>
                      <div style={{ width: "48px", height: "32px", borderRadius: "6px", background: "linear-gradient(135deg, #F63D68, #FF9A8B)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <CreditCard size={16} style={{ color: "#FFFFFF" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p className="font-nunito font-bold" style={{ fontSize: "14px", color: "#141414", margin: 0 }}>{card.brand} •••• {card.last4}</p>
                        <p className="font-nunito font-normal" style={{ fontSize: "12px", color: "#737373", margin: "2px 0 0" }}>{card.holder} · Expires {card.expiry}</p>
                      </div>
                      {selectedCard === card.id && <CheckCircle size={18} style={{ color: "#F63D68", flexShrink: 0 }} />}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Lock size={13} style={{ color: "#525252" }} />
                  <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#737373" }}>SSL Encrypted</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <ShieldCheck size={13} style={{ color: "#525252" }} />
                  <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#737373" }}>Secure Payment</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Order Summary sidebar ── */}
          <div style={{ background: "#FFFFFF", borderRadius: "12px", border: "1px solid #E5E5E5", padding: "20px", display: "flex", flexDirection: "column", gap: "16px", position: "sticky", top: "20px" }}>
            <h2 className="font-nunito font-bold" style={{ fontSize: "18px", color: "#141414", margin: 0 }}>Order Summary</h2>

            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "240px", overflowY: "auto" }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "6px", overflow: "hidden", flexShrink: 0, background: "#F5F5F5", position: "relative" }}>
                    <Image src={item.image} alt={item.title} fill style={{ objectFit: "cover" }} unoptimized />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="font-nunito font-semibold" style={{ fontSize: "13px", color: "#141414", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
                    <p className="font-nunito font-normal" style={{ fontSize: "12px", color: "#A3A3A3", margin: "2px 0 0" }}>Qty: {item.quantity}</p>
                  </div>
                  <span className="font-nunito font-bold" style={{ fontSize: "13px", color: "#141414", flexShrink: 0 }}>${(item.numericPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ height: "1px", background: "#E5E5E5" }} />

            {/* Promo code */}
            <div style={{ background: "#F9FAFB", borderRadius: "8px", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <p className="font-nunito font-semibold" style={{ fontSize: "13px", color: "#424242", margin: 0 }}>Promo / Coupon Code</p>
              {appliedCode ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#ECFDF3", border: "1px solid #ABEFC6", borderRadius: "8px", padding: "8px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle size={15} style={{ color: "#12B76A" }} />
                    <span className="font-nunito font-bold" style={{ fontSize: "13px", color: "#067647" }}>{appliedCode} applied!</span>
                  </div>
                  <button onClick={() => { setAppliedCode(null); setPromoCode(""); setPromoError(""); }}
                    className="font-nunito font-semibold" style={{ background: "none", border: "none", cursor: "pointer", color: "#F04438", fontSize: "12px", padding: 0 }}>
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <div style={{ flex: 1, position: "relative" }}>
                      <Tag size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#A3A3A3" }} />
                      <input type="text" value={promoCode} onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                        placeholder="e.g. PARTY30"
                        className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
                        style={{ width: "100%", height: "36px", paddingLeft: "30px", paddingRight: "10px", borderRadius: "8px", border: `1px solid ${promoError ? "#F04438" : "#E5E5E5"}`, fontSize: "13px", color: "#141414", background: "#FFFFFF", boxSizing: "border-box" }} />
                    </div>
                    <button onClick={handleApplyPromo} className="font-nunito font-bold"
                      style={{ padding: "0 12px", height: "36px", borderRadius: "8px", border: "1px solid #F63D68", background: "#FFF1F3", color: "#F63D68", fontSize: "13px", cursor: "pointer", flexShrink: 0 }}>
                      Apply
                    </button>
                  </div>
                  {promoError && <span className="font-nunito" style={{ fontSize: "12px", color: "#F04438" }}>{promoError}</span>}
                </>
              )}
            </div>

            {/* Price breakdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>Subtotal ({totalItems} items)</span>
                <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#141414" }}>${subtotal.toFixed(2)}</span>
              </div>
              {appliedCode && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#12B76A" }}>Discount ({Math.round(discountRate * 100)}% off)</span>
                  <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#12B76A" }}>−${discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>Tax (8%)</span>
                <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#141414" }}>${tax.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>Delivery</span>
                <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#12B76A" }}>Free</span>
              </div>
            </div>

            <div style={{ height: "1px", background: "#E5E5E5" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="font-nunito font-bold" style={{ fontSize: "16px", color: "#141414" }}>Total</span>
              <div style={{ textAlign: "right" }}>
                {appliedCode && (
                  <p className="font-nunito font-normal" style={{ fontSize: "12px", color: "#A3A3A3", margin: "0 0 2px", textDecoration: "line-through" }}>${(subtotal + subtotal * 0.08).toFixed(2)}</p>
                )}
                <span className="font-nunito font-bold" style={{ fontSize: "22px", color: "#F63D68" }}>${total.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={handlePlaceOrder} disabled={placing} className="font-nunito font-bold"
              style={{ width: "100%", padding: "13px", borderRadius: "10px", background: placing ? "#FECDD6" : "#F63D68", border: "none", color: "#FFFFFF", fontSize: "16px", cursor: placing ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: placing ? "none" : "0px 4px 12px rgba(246,61,104,0.3)", transition: "background 0.2s" }}>
              {placing ? (
                <>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#FFFFFF", animation: "spin 0.7s linear infinite" }} />
                  Processing...
                </>
              ) : (
                <><Lock size={16} /> Place Order</>
              )}
            </button>

            <Link href="/parent/cart" className="font-nunito font-semibold" style={{ textAlign: "center", fontSize: "13px", color: "#525252", textDecoration: "none", display: "block" }}>← Back to Cart</Link>
          </div>
        </div>
      </div>

      {showAddCard && <AddCardModal onClose={() => setShowAddCard(false)} onSave={handleSaveCard} />}
      {orderRef && <OrderPlacedModal orderRef={orderRef} onClose={() => router.push("/parent/party-themes")} />}
    </>
  );
}
