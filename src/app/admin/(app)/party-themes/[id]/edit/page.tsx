"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  ChevronRight, UploadCloud, Plus, Trash2, ChevronDown, ChevronUp, Loader2,
  Bold, Italic, Underline, Strikethrough, AlignLeft, List, ListOrdered, Link2, Image as ImageIcon, Undo2, Redo2,
} from "lucide-react";
import Image from "next/image";
import { db, storage } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { logActivity } from "@/lib/activity";

// ── Types ────────────────────────────────────────────────────────

interface ProductDraft {
  id: string;
  name: string;
  price: string;
  description: string;
  imageFile: File | null;
  imagePreview: string | null;
  existingImageUrl: string;
  collapsed: boolean;
}

function makeProduct(data?: { name?: string; price?: string; description?: string; image?: string }): ProductDraft {
  return {
    id: crypto.randomUUID(),
    name: data?.name ?? "",
    price: data?.price ?? "",
    description: data?.description ?? "",
    imageFile: null,
    imagePreview: data?.image ?? null,
    existingImageUrl: data?.image ?? "",
    collapsed: false,
  };
}

// ── Shared primitives ─────────────────────────────────────────────

function FormLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="font-nunito font-semibold" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242", display: "block" }}>
      {children}{required && <span style={{ color: "#F63D68" }}> *</span>}
    </label>
  );
}

function FormInput({ label, placeholder, value, onChange, required, disabled }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void; required?: boolean; disabled?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <FormLabel required={required}>{label}</FormLabel>
      <input
        type="text" placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)} disabled={disabled}
        className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
        style={{ height: "44px", padding: "10px 14px", borderRadius: "8px", border: "1px solid #E5E5E5", fontSize: "16px", color: "#141414", background: disabled ? "#F5F5F5" : "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", width: "100%", boxSizing: "border-box" }}
      />
    </div>
  );
}

function FormSelect({ label, options, value, onChange, required, disabled }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void; required?: boolean; disabled?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, minWidth: 0 }}>
      <FormLabel required={required}>{label}</FormLabel>
      <div style={{ position: "relative" }}>
        <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}
          className="font-nunito font-normal focus:outline-none"
          style={{ height: "44px", padding: "10px 14px", paddingRight: "40px", borderRadius: "8px", border: "1px solid #E5E5E5", fontSize: "16px", color: value ? "#141414" : "#737373", background: disabled ? "#F5F5F5" : "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", width: "100%", cursor: "pointer", appearance: "none" }}>
          <option value="" disabled>Choose</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronRight size={16} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%) rotate(90deg)", color: "#A3A3A3", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
      <h3 className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414", margin: 0 }}>{title}</h3>
      {children}
    </div>
  );
}

// ── Rich-text toolbar ─────────────────────────────────────────────

const TOOLBAR_GROUPS = [
  [{ icon: Bold, label: "Bold" }, { icon: Italic, label: "Italic" }, { icon: Underline, label: "Underline" }, { icon: Strikethrough, label: "Strikethrough" }],
  [{ icon: AlignLeft, label: "Align left" }, { icon: List, label: "Bullet list" }, { icon: ListOrdered, label: "Numbered list" }],
  [{ icon: Link2, label: "Insert link" }, { icon: ImageIcon, label: "Insert image" }],
  [{ icon: Undo2, label: "Undo" }, { icon: Redo2, label: "Redo" }],
];

function RichTextToolbar() {
  return (
    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "2px", padding: "10px 14px", background: "#FAFAFA", borderBottom: "1px solid #E5E5E5", borderRadius: "8px 8px 0 0" }}>
      {TOOLBAR_GROUPS.map((group, gi) => (
        <div key={gi} style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {group.map(({ icon: Icon, label }) => (
            <button key={label} type="button" title={label} style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px", border: "none", background: "none", cursor: "pointer", color: "#525252" }}>
              <Icon size={15} />
            </button>
          ))}
          {gi < TOOLBAR_GROUPS.length - 1 && <div style={{ width: "1px", height: "18px", background: "#E5E5E5", margin: "0 6px" }} />}
        </div>
      ))}
    </div>
  );
}

// ── Product Card (edit mode) ───────────────────────────────────────

function ProductCard({ product, index, onUpdate, onRemove, canRemove, disabled }: {
  product: ProductDraft; index: number; onUpdate: (p: Partial<ProductDraft>) => void; onRemove: () => void; canRemove: boolean; disabled: boolean;
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: product.collapsed ? "#FAFAFA" : "#FFFFFF", borderBottom: product.collapsed ? "none" : "1px solid #F2F4F7", cursor: "pointer" }}
        onClick={() => onUpdate({ collapsed: !product.collapsed })}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#FFF5F6", border: "1px solid #FECDDA", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative", flexShrink: 0 }}>
            {product.imagePreview ? (
              <Image src={product.imagePreview} alt="" fill style={{ objectFit: "cover" }} unoptimized />
            ) : (
              <span style={{ fontSize: "16px" }}>🎁</span>
            )}
          </div>
          <div>
            <p className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#141414", margin: 0 }}>{product.name || `Product ${index + 1}`}</p>
            {product.price && <p className="font-nunito font-normal" style={{ fontSize: "12px", color: "#525252", margin: 0 }}>{product.price.startsWith("$") ? product.price : `$${product.price}`}</p>}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }} onClick={(e) => e.stopPropagation()}>
          {canRemove && !disabled && (
            <button type="button" onClick={onRemove} style={{ background: "none", border: "none", padding: "6px", cursor: "pointer", display: "flex", color: "#A3A3A3", borderRadius: "6px" }}>
              <Trash2 size={15} />
            </button>
          )}
          <button type="button" onClick={() => onUpdate({ collapsed: !product.collapsed })} style={{ background: "none", border: "none", padding: "6px", cursor: "pointer", display: "flex", color: "#525252" }}>
            {product.collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>
      </div>

      {!product.collapsed && (
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
              <FormLabel required>Product Name</FormLabel>
              <input type="text" placeholder="Enter product name" value={product.name} onChange={(e) => onUpdate({ name: e.target.value })} disabled={disabled}
                className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
                style={{ height: "44px", padding: "10px 14px", borderRadius: "8px", border: "1px solid #E5E5E5", fontSize: "16px", color: "#141414", background: disabled ? "#F5F5F5" : "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", width: "100%", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
              <FormLabel required>Price</FormLabel>
              <input type="text" placeholder="e.g. 25.99" value={product.price} onChange={(e) => onUpdate({ price: e.target.value })} disabled={disabled}
                className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
                style={{ height: "44px", padding: "10px 14px", borderRadius: "8px", border: "1px solid #E5E5E5", fontSize: "16px", color: "#141414", background: disabled ? "#F5F5F5" : "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", width: "100%", boxSizing: "border-box" }} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <FormLabel>Description</FormLabel>
            <textarea placeholder="Enter product description..." value={product.description} onChange={(e) => onUpdate({ description: e.target.value })} disabled={disabled}
              className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
              style={{ width: "100%", minHeight: "90px", padding: "10px 14px", borderRadius: "8px", border: "1px solid #E5E5E5", fontSize: "16px", color: "#141414", background: disabled ? "#F5F5F5" : "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", resize: "vertical", boxSizing: "border-box", display: "block", fontFamily: "inherit" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <FormLabel>Product Image</FormLabel>
            <div
              onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); if (!disabled) { const f = e.dataTransfer.files[0]; if (f) handleFile(f); } }}
              onClick={() => !disabled && fileInputRef.current?.click()}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "16px 24px", borderRadius: "8px", border: `1px solid ${dragging ? "#F63D68" : "#E5E5E5"}`, background: dragging ? "#FFF5F6" : disabled ? "#FAFAFA" : "#FFFFFF", cursor: disabled ? "default" : "pointer", textAlign: "center", transition: "all 0.15s" }}>
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
        </div>
      )}
    </div>
  );
}

const AGE_OPTIONS      = ["3-4", "5-6", "7-8", "N/A"];
const CATEGORY_OPTIONS = ["Birthday", "Christmas", "Halloween", "Princess", "Superhero", "Under the Sea", "Dinosaur", "Space"];

// ── Page ──────────────────────────────────────────────────────────

export default function EditThemePage() {
  const router = useRouter();
  const params = useParams();
  const themeId = params.id as string;
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ name: "", age: "", category: "", description: "" });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverDragging, setCoverDragging] = useState(false);
  const [products, setProducts] = useState<ProductDraft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!themeId) return;
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "partyThemes", themeId));
        if (!snap.exists()) { setNotFound(true); setIsLoading(false); return; }
        const data = snap.data();
        setForm({ name: data.title || "", age: data.age || "", category: data.category || "", description: data.description || "" });
        setCoverPreview(data.cover || null);
        const existingProducts = (data.products || []).map((p: { name?: string; price?: string; description?: string; image?: string }) => makeProduct(p));
        setProducts(existingProducts.length > 0 ? existingProducts : [makeProduct()]);
      } catch (err) {
        console.error("Error loading theme:", err);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [themeId]);

  const handleCoverFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const updateProduct = (id: string, patch: Partial<ProductDraft>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const addProduct = () => {
    setProducts((prev) => [...prev, makeProduct()]);
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 100);
  };

  const onSave = async (status: "Published" | "Draft") => {
    if (!form.name || isSaving) return;
    setIsSaving(true);
    try {
      // Upload new cover if changed
      let coverUrl = coverPreview && !coverFile ? coverPreview : "";
      if (coverFile) {
        const sRef = storageRef(storage, `partyThemes/covers/${Date.now()}_${coverFile.name}`);
        const snap = await uploadBytes(sRef, coverFile);
        coverUrl = await getDownloadURL(snap.ref);
      }

      // Upload new product images
      const productData = await Promise.all(
        products.map(async (p) => {
          let imageUrl = p.existingImageUrl;
          if (p.imageFile) {
            const sRef = storageRef(storage, `partyThemes/products/${Date.now()}_${p.imageFile.name}`);
            const snap = await uploadBytes(sRef, p.imageFile);
            imageUrl = await getDownloadURL(snap.ref);
          }
          return { name: p.name, price: p.price, description: p.description, image: imageUrl };
        })
      );

      await updateDoc(doc(db, "partyThemes", themeId), {
        title: form.name,
        age: form.age || "N/A",
        category: form.category || "Uncategorized",
        description: form.description,
        cover: coverUrl,
        products: productData,
        status,
        lastUpdated: serverTimestamp(),
      });

      await logActivity({
        type: "PartyTheme",
        activity: `Updated party theme "${form.name}" — ${status === "Draft" ? "saved as draft" : "published"}`,
        targetName: form.name,
        changes: [`Status: ${status}`, `Products: ${productData.length}`],
      });

      router.push("/admin/party-themes");
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error updating theme:", error);
      alert(`Failed to save: ${error?.message || "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "400px", gap: "12px" }}>
        <Loader2 size={24} style={{ color: "#F63D68" }} className="animate-spin" />
        <p className="font-nunito" style={{ color: "#525252", fontSize: "14px" }}>Loading theme...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "400px", gap: "16px" }}>
        <p className="font-nunito font-semibold" style={{ fontSize: "20px", color: "#141414" }}>Theme not found</p>
        <Link href="/admin/party-themes" className="font-nunito font-bold" style={{ color: "#F63D68", fontSize: "14px", textDecoration: "none" }}>Back to Party Themes</Link>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Breadcrumb + Actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin/party-themes" className="font-nunito font-bold" style={{ fontSize: "14px", color: "#424242", textDecoration: "none" }}>Party Themes</Link>
          <ChevronRight size={16} style={{ color: "#A3A3A3" }} />
          <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>Edit Theme</span>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button type="button" disabled={isSaving} onClick={() => onSave("Draft")} className="font-nunito font-bold"
            style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #D6D6D6", background: "#FFFFFF", fontSize: "14px", color: "#424242", cursor: "pointer", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", opacity: isSaving ? 0.7 : 1 }}>
            Save As Draft
          </button>
          <button type="button" disabled={isSaving} onClick={() => onSave("Published")} className="font-nunito font-bold"
            style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #F63D68", background: "#F63D68", fontSize: "14px", color: "#FFFFFF", cursor: "pointer", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", opacity: isSaving ? 0.7 : 1 }}>
            {isSaving ? "Saving..." : "Publish"}
          </button>
        </div>
      </div>

      {/* ── Section 1: Theme Info ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "6px", height: "24px", background: "#F63D68", borderRadius: "3px" }} />
          <h2 className="font-nunito font-semibold" style={{ fontSize: "18px", color: "#141414", margin: 0 }}>Theme Information</h2>
        </div>

        <Card title="Basic Information">
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <FormInput label="Theme Name" placeholder="Enter theme name" value={form.name} onChange={set("name")} required disabled={isSaving} />
            <div style={{ display: "flex", gap: "20px" }}>
              <FormSelect label="Age" options={AGE_OPTIONS} value={form.age} onChange={set("age")} required disabled={isSaving} />
              <FormSelect label="Category" options={CATEGORY_OPTIONS} value={form.category} onChange={set("category")} required disabled={isSaving} />
            </div>
          </div>
        </Card>

        <Card title="Cover Image">
          <div
            onDragOver={(e) => { e.preventDefault(); if (!isSaving) setCoverDragging(true); }}
            onDragLeave={() => setCoverDragging(false)}
            onDrop={(e) => { e.preventDefault(); setCoverDragging(false); if (!isSaving) { const f = e.dataTransfer.files[0]; if (f) handleCoverFile(f); } }}
            onClick={() => !isSaving && coverInputRef.current?.click()}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "16px 24px", borderRadius: "8px", border: `1px solid ${coverDragging ? "#F63D68" : "#E5E5E5"}`, background: coverDragging ? "#FFF5F6" : "#FFFFFF", cursor: isSaving ? "default" : "pointer", textAlign: "center", transition: "all 0.15s", opacity: isSaving ? 0.7 : 1 }}>
            {coverPreview ? (
              <div style={{ width: "100%", height: "180px", position: "relative", borderRadius: "8px", overflow: "hidden" }}>
                <Image src={coverPreview} alt="Cover" fill style={{ objectFit: "cover" }} unoptimized />
              </div>
            ) : (
              <>
                <div style={{ width: "40px", height: "40px", borderRadius: "8px", border: "1px solid #EAECF0", background: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <UploadCloud size={20} style={{ color: "#525252" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>Click to upload</span>
                    <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#525252" }}>or drag and drop</span>
                  </div>
                  <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#525252" }}>SVG, PNG, JPG (max. 800×400px)</span>
                </div>
              </>
            )}
            <input ref={coverInputRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => { if (e.target.files?.[0]) handleCoverFile(e.target.files[0]); }} />
          </div>
        </Card>

        <Card title="Summary">
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <FormLabel>Description</FormLabel>
            <div style={{ border: "1px solid #E5E5E5", borderRadius: "8px", overflow: "hidden", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", display: "flex", flexDirection: "column" }}>
              <RichTextToolbar />
              <textarea placeholder="Enter a description..." value={form.description} onChange={(e) => set("description")(e.target.value)} disabled={isSaving}
                className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
                style={{ width: "100%", minHeight: "160px", padding: "12px 14px", fontSize: "16px", color: "#141414", background: isSaving ? "#F5F5F5" : "#FFFFFF", border: "none", resize: "vertical", boxSizing: "border-box", display: "block" }} />
            </div>
          </div>
        </Card>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: "1px", background: "#F2F4F7", margin: "4px 0" }} />

      {/* ── Section 2: Products ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "6px", height: "24px", background: "#F63D68", borderRadius: "3px" }} />
            <h2 className="font-nunito font-semibold" style={{ fontSize: "18px", color: "#141414", margin: 0 }}>Products</h2>
          </div>
          <span className="font-nunito font-semibold" style={{ fontSize: "13px", color: "#525252", background: "#F5F5F5", padding: "4px 12px", borderRadius: "20px" }}>
            {products.length} {products.length === 1 ? "product" : "products"}
          </span>
        </div>

        {products.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            index={i}
            onUpdate={(patch) => updateProduct(product.id, patch)}
            onRemove={() => setProducts((prev) => prev.filter((p) => p.id !== product.id))}
            canRemove={products.length > 1}
            disabled={isSaving}
          />
        ))}

        {/* Add more product */}
        <button
          type="button" onClick={addProduct} disabled={isSaving} className="font-nunito font-semibold"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "14px", borderRadius: "12px", border: "2px dashed #E5E5E5", background: "#FAFAFA", fontSize: "14px", color: "#525252", cursor: isSaving ? "default" : "pointer", transition: "all 0.15s" }}
          onMouseEnter={(e) => { if (!isSaving) { e.currentTarget.style.borderColor = "#F63D68"; e.currentTarget.style.color = "#F63D68"; e.currentTarget.style.background = "#FFF5F6"; } }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E5E5E5"; e.currentTarget.style.color = "#525252"; e.currentTarget.style.background = "#FAFAFA"; }}
        >
          <Plus size={18} />
          + Add more product
        </button>
      </div>

    </div>
  );
}
