"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  ChevronRight, UploadCloud, Plus, Trash2, ChevronDown, ChevronUp, Loader2,
} from "lucide-react";
import Image from "next/image";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { logActivity } from "@/lib/activity";

// ── Step indicator ────────────────────────────────────────────────

function StepIndicator({ current }: { current: 1 | 2 }) {
  const steps = [{ n: 1, label: "Theme Info" }, { n: 2, label: "Add Products" }];
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {steps.map((step, i) => {
        const done = current > step.n;
        const active = current === step.n;
        return (
          <div key={step.n} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: done ? "#F63D68" : active ? "#FFF1F3" : "#F5F5F5", border: `2px solid ${done || active ? "#F63D68" : "#E5E5E5"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : (
                  <span className="font-nunito font-semibold" style={{ fontSize: "12px", color: active ? "#F63D68" : "#A3A3A3" }}>{step.n}</span>
                )}
              </div>
              <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: active ? "#141414" : done ? "#F63D68" : "#A3A3A3" }}>{step.label}</span>
            </div>
            {i < steps.length - 1 && <div style={{ width: "40px", height: "2px", background: done ? "#F63D68" : "#E5E5E5", margin: "0 12px" }} />}
          </div>
        );
      })}
    </div>
  );
}

// ── Types ────────────────────────────────────────────────────────

interface ProductDraft {
  id: string;
  name: string;
  price: string;
  description: string;
  imageFile: File | null;
  imagePreview: string | null;
  collapsed: boolean;
}

function makeProduct(): ProductDraft {
  return { id: crypto.randomUUID(), name: "", price: "", description: "", imageFile: null, imagePreview: null, collapsed: false };
}

// ── Shared primitives ─────────────────────────────────────────────

function FormLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="font-nunito font-semibold" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242", display: "block" }}>
      {children}{required && <span style={{ color: "#F63D68" }}> *</span>}
    </label>
  );
}

function SmallInput({ label, placeholder, value, onChange, type = "text", required }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
      <FormLabel required={required}>{label}</FormLabel>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
        style={{ height: "44px", padding: "10px 14px", borderRadius: "8px", border: "1px solid #E5E5E5", fontSize: "16px", color: "#141414", background: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", width: "100%", boxSizing: "border-box" }}
      />
    </div>
  );
}

// ── Product Card ──────────────────────────────────────────────────

function ProductCard({
  product, index, onUpdate, onRemove, canRemove,
}: {
  product: ProductDraft;
  index: number;
  onUpdate: (updated: Partial<ProductDraft>) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => onUpdate({ imageFile: file, imagePreview: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", overflow: "hidden", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)" }}>

      {/* Product header */}
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: product.collapsed ? "#FAFAFA" : "#FFFFFF", borderBottom: product.collapsed ? "none" : "1px solid #F2F4F7", cursor: "pointer" }}
        onClick={() => onUpdate({ collapsed: !product.collapsed })}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Product thumbnail preview */}
          <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#FFF5F6", border: "1px solid #FECDDA", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative", flexShrink: 0 }}>
            {product.imagePreview ? (
              <Image src={product.imagePreview} alt="" fill style={{ objectFit: "cover" }} unoptimized />
            ) : (
              <span style={{ fontSize: "16px" }}>🎁</span>
            )}
          </div>
          <div>
            <p className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#141414", margin: 0 }}>
              {product.name || `Product ${index + 1}`}
            </p>
            {product.price && (
              <p className="font-nunito font-normal" style={{ fontSize: "12px", color: "#525252", margin: 0 }}>
                {product.price.startsWith("$") ? product.price : `$${product.price}`}
              </p>
            )}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }} onClick={(e) => e.stopPropagation()}>
          {canRemove && (
            <button
              type="button" onClick={onRemove} title="Remove product"
              style={{ background: "none", border: "none", padding: "6px", cursor: "pointer", display: "flex", alignItems: "center", color: "#A3A3A3", borderRadius: "6px" }}
            >
              <Trash2 size={15} />
            </button>
          )}
          <button
            type="button" onClick={() => onUpdate({ collapsed: !product.collapsed })}
            style={{ background: "none", border: "none", padding: "6px", cursor: "pointer", display: "flex", alignItems: "center", color: "#525252" }}
          >
            {product.collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>
      </div>

      {/* Product fields */}
      {!product.collapsed && (
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Product Name */}
          <SmallInput
            label="Product Name" placeholder="Enter product name"
            value={product.name} onChange={(v) => onUpdate({ name: v })} required
          />

          {/* Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <FormLabel>Description</FormLabel>
            <textarea
              placeholder="Enter product description..."
              value={product.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
              style={{ width: "100%", minHeight: "90px", padding: "10px 14px", borderRadius: "8px", border: "1px solid #E5E5E5", fontSize: "16px", color: "#141414", background: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", resize: "vertical", boxSizing: "border-box", display: "block", fontFamily: "inherit" }}
            />
          </div>

          {/* Product image upload */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <FormLabel>Product Image</FormLabel>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              onClick={() => fileInputRef.current?.click()}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "16px 24px", borderRadius: "8px", border: `1px solid ${dragging ? "#F63D68" : "#E5E5E5"}`, background: dragging ? "#FFF5F6" : "#FFFFFF", cursor: "pointer", textAlign: "center", transition: "border-color 0.15s, background 0.15s" }}
            >
              {product.imagePreview ? (
                <div style={{ width: "100%", height: "140px", position: "relative", borderRadius: "8px", overflow: "hidden" }}>
                  <Image src={product.imagePreview} alt="Product" fill style={{ objectFit: "cover" }} unoptimized />
                </div>
              ) : (
                <>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid #EAECF0", background: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <UploadCloud size={18} style={{ color: "#525252" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span className="font-nunito font-bold" style={{ fontSize: "13px", color: "#F63D68" }}>Click to upload</span>
                    <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#525252" }}>or drag and drop</span>
                  </div>
                  <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#A3A3A3" }}>PNG, JPG (max. 800×400px)</span>
                </>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            </div>
          </div>

          {/* Price — below image */}
          <SmallInput
            label="Price" placeholder="e.g. 25.99"
            value={product.price} onChange={(v) => onUpdate({ price: v })} required
          />

        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────

interface Step1Data {
  name: string;
  description: string;
  coverPreview: string;
  coverFileName: string;
}

export default function AddThemeProductsPage() {
  const router = useRouter();
  const [step1, setStep1] = useState<Step1Data | null>(null);
  const [products, setProducts] = useState<ProductDraft[]>([makeProduct()]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("partyThemeStep1");
    if (!raw) { router.replace("/admin/party-themes/add"); return; }
    setStep1(JSON.parse(raw) as Step1Data);
  }, [router]);

  const updateProduct = (id: string, patch: Partial<ProductDraft>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addProduct = () => {
    const newProduct = makeProduct();
    setProducts((prev) => [...prev, newProduct]);
    // Scroll to bottom after render
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 100);
  };

  const onSave = async (status: "Published" | "Draft") => {
    if (!step1 || isSaving) return;
    setIsSaving(true);

    try {
      // 1. Upload cover image
      let coverUrl = "";
      const coverFile = (window as unknown as Record<string, unknown>).__partyThemeCoverFile as File | undefined;
      if (coverFile) {
        const sRef = storageRef(storage, `partyThemes/covers/${Date.now()}_${coverFile.name}`);
        const snap = await uploadBytes(sRef, coverFile);
        coverUrl = await getDownloadURL(snap.ref);
      }

      // 2. Upload product images & build product array
      const productData = await Promise.all(
        products.map(async (p) => {
          let imageUrl = "";
          if (p.imageFile) {
            const sRef = storageRef(storage, `partyThemes/products/${Date.now()}_${p.imageFile.name}`);
            const snap = await uploadBytes(sRef, p.imageFile);
            imageUrl = await getDownloadURL(snap.ref);
          }
          return { name: p.name, price: p.price, description: p.description, image: imageUrl };
        })
      );

      // 3. Save to Firestore
      await addDoc(collection(db, "partyThemes"), {
        title: step1.name,
        description: step1.description,
        cover: coverUrl,
        products: productData,
        status,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
      });

      // 4. Log activity
      await logActivity({
        type: "PartyTheme",
        activity: `"${step1.name}" party theme ${status === "Draft" ? "saved as draft" : "published"} with ${productData.length} product(s)`,
        targetName: step1.name,
        changes: [`Status: ${status}`, `Products: ${productData.length} item(s)`],
      });

      // 5. Clean up
      sessionStorage.removeItem("partyThemeStep1");
      delete (window as unknown as Record<string, unknown>).__partyThemeCoverFile;

      router.push("/admin/party-themes");
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error saving party theme:", error);
      alert(`Failed to save: ${error?.message || "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!step1) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px", gap: "12px" }}>
        <Loader2 size={22} style={{ color: "#F63D68" }} className="animate-spin" />
        <p className="font-nunito" style={{ color: "#525252", fontSize: "14px" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Breadcrumb + Step indicator */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin/party-themes" className="font-nunito font-bold" style={{ fontSize: "14px", color: "#424242", textDecoration: "none" }}>
            Party Themes
          </Link>
          <ChevronRight size={16} style={{ color: "#A3A3A3" }} />
          <Link href="/admin/party-themes/add" className="font-nunito font-bold" style={{ fontSize: "14px", color: "#424242", textDecoration: "none" }}>
            Add Theme
          </Link>
          <ChevronRight size={16} style={{ color: "#A3A3A3" }} />
          <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>Products</span>
        </div>
        <StepIndicator current={2} />
      </div>

      {/* Theme summary banner */}
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
        {step1.coverPreview && (
          <div style={{ width: "48px", height: "48px", borderRadius: "8px", overflow: "hidden", position: "relative", flexShrink: 0 }}>
            <Image src={step1.coverPreview} alt="Cover" fill style={{ objectFit: "cover" }} unoptimized />
          </div>
        )}
        <div>
          <p className="font-nunito font-semibold" style={{ fontSize: "16px", color: "#141414", margin: 0 }}>{step1.name}</p>
          {step1.description && (
            <p className="font-nunito font-normal" style={{ fontSize: "13px", color: "#525252", margin: 0, maxWidth: "400px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {step1.description}
            </p>
          )}
        </div>
        <Link href="/admin/party-themes/add" className="font-nunito font-semibold"
          style={{ marginLeft: "auto", fontSize: "13px", color: "#F63D68", textDecoration: "none" }}>
          Edit Info
        </Link>
      </div>

      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 className="font-nunito font-semibold" style={{ fontSize: "20px", color: "#141414", margin: 0 }}>Products</h2>
          <p className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252", margin: "4px 0 0" }}>
            Add the products included in this party theme.
          </p>
        </div>
        <span className="font-nunito font-semibold" style={{ fontSize: "13px", color: "#525252", background: "#F5F5F5", padding: "4px 12px", borderRadius: "20px" }}>
          {products.length} {products.length === 1 ? "product" : "products"}
        </span>
      </div>

      {/* Product cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {products.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            index={i}
            onUpdate={(patch) => updateProduct(product.id, patch)}
            onRemove={() => removeProduct(product.id)}
            canRemove={products.length > 1}
          />
        ))}
      </div>

      {/* Add more product button */}
      <button
        type="button"
        onClick={addProduct}
        className="font-nunito font-semibold"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          width: "100%", padding: "14px", borderRadius: "12px",
          border: "2px dashed #E5E5E5", background: "#FAFAFA",
          fontSize: "14px", color: "#525252", cursor: "pointer",
          transition: "border-color 0.15s, background 0.15s, color 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#F63D68";
          e.currentTarget.style.color = "#F63D68";
          e.currentTarget.style.background = "#FFF5F6";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#E5E5E5";
          e.currentTarget.style.color = "#525252";
          e.currentTarget.style.background = "#FAFAFA";
        }}
      >
        <Plus size={18} />
        + Add more product
      </button>

      {/* Footer actions */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", paddingTop: "4px", paddingBottom: "20px" }}>
        <button
          type="button"
          onClick={() => router.push("/admin/party-themes/add")}
          className="font-nunito font-bold"
          style={{ padding: "10px 20px", borderRadius: "8px", border: "1px solid #D6D6D6", background: "#FFFFFF", fontSize: "14px", color: "#424242", cursor: "pointer", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)" }}
        >
          ← Back
        </button>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="button" disabled={isSaving} onClick={() => onSave("Draft")} className="font-nunito font-bold"
            style={{ padding: "10px 18px", borderRadius: "8px", border: "1px solid #D6D6D6", background: "#FFFFFF", fontSize: "14px", color: "#424242", cursor: "pointer", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", opacity: isSaving ? 0.7 : 1 }}
          >
            Save As Draft
          </button>
          <button
            type="button" disabled={isSaving} onClick={() => onSave("Published")} className="font-nunito font-bold"
            style={{ padding: "10px 24px", borderRadius: "8px", border: "1px solid #F63D68", background: "#F63D68", fontSize: "14px", color: "#FFFFFF", cursor: "pointer", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", opacity: isSaving ? 0.7 : 1 }}
          >
            {isSaving ? (
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Loader2 size={14} className="animate-spin" /> Saving...
              </span>
            ) : "Publish"}
          </button>
        </div>
      </div>

    </div>
  );
}
