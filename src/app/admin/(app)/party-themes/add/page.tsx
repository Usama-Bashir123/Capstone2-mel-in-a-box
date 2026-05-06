"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import {
  ChevronRight, UploadCloud,
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, List, ListOrdered,
  Link2, Image as ImageIcon, Undo2, Redo2,
} from "lucide-react";
import Image from "next/image";

// ── Step indicator ────────────────────────────────────────────────

function StepIndicator({ current }: { current: 1 | 2 }) {
  const steps = [
    { n: 1, label: "Theme Info" },
    { n: 2, label: "Add Products" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0px" }}>
      {steps.map((step, i) => {
        const done = current > step.n;
        const active = current === step.n;
        return (
          <div key={step.n} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: done ? "#F63D68" : active ? "#FFF1F3" : "#F5F5F5",
                border: `2px solid ${done || active ? "#F63D68" : "#E5E5E5"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span className="font-nunito font-semibold" style={{ fontSize: "12px", color: active ? "#F63D68" : "#A3A3A3" }}>
                    {step.n}
                  </span>
                )}
              </div>
              <span
                className="font-nunito font-semibold"
                style={{ fontSize: "14px", color: active ? "#141414" : done ? "#F63D68" : "#A3A3A3" }}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: "40px", height: "2px", background: done ? "#F63D68" : "#E5E5E5", margin: "0 12px" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Shared form primitives ────────────────────────────────────────

function FormLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="font-nunito font-semibold" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242", display: "block" }}>
      {children}{required && <span style={{ color: "#F63D68" }}> *</span>}
    </label>
  );
}

function FormInput({ label, placeholder, value, onChange, required }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <FormLabel required={required}>{label}</FormLabel>
      <input
        type="text" placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
        style={{
          height: "44px", padding: "10px 14px", borderRadius: "8px",
          border: "1px solid #E5E5E5", fontSize: "16px", color: "#141414",
          background: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
          width: "100%", boxSizing: "border-box",
        }}
      />
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
            <button key={label} type="button" title={label}
              style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px", border: "none", background: "none", cursor: "pointer", color: "#525252", flexShrink: 0 }}>
              <Icon size={15} />
            </button>
          ))}
          {gi < TOOLBAR_GROUPS.length - 1 && <div style={{ width: "1px", height: "18px", background: "#E5E5E5", margin: "0 6px" }} />}
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────

export default function AddThemePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ name: "", description: "" });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    if (!form.name) { alert("Please enter a theme name."); return; }

    const step1 = {
      name: form.name,
      description: form.description,
      coverPreview: coverPreview ?? "",
      coverFileName: coverFile?.name ?? "",
    };
    sessionStorage.setItem("partyThemeStep1", JSON.stringify(step1));

    if (coverFile) {
      (window as unknown as Record<string, unknown>).__partyThemeCoverFile = coverFile;
    }

    router.push("/admin/party-themes/add/products");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Breadcrumb + Step indicator */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin/party-themes" className="font-nunito font-bold" style={{ fontSize: "14px", color: "#424242", textDecoration: "none" }}>
            Party Themes
          </Link>
          <ChevronRight size={16} style={{ color: "#A3A3A3", flexShrink: 0 }} />
          <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>Add Theme</span>
        </div>
        <StepIndicator current={1} />
      </div>

      {/* Form cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Basic Information — name only */}
        <Card title="Basic Information">
          <FormInput label="Theme Name" placeholder="Enter theme name" value={form.name} onChange={set("name")} required />
        </Card>

        {/* Summary — before cover upload */}
        <Card title="Summary">
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <FormLabel>Description</FormLabel>
            <div style={{ border: "1px solid #E5E5E5", borderRadius: "8px", overflow: "hidden", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", display: "flex", flexDirection: "column" }}>
              <RichTextToolbar />
              <textarea
                placeholder="Enter a description..."
                value={form.description}
                onChange={(e) => set("description")(e.target.value)}
                className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
                style={{ width: "100%", minHeight: "160px", padding: "12px 14px", fontSize: "16px", color: "#141414", background: "#FFFFFF", border: "none", resize: "vertical", boxSizing: "border-box", display: "block" }}
              />
            </div>
          </div>
        </Card>

        {/* Cover Image — after summary */}
        <Card title="Upload Cover Image">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); }}
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
              padding: "16px 24px", borderRadius: "8px",
              border: `1px solid ${dragging ? "#F63D68" : "#E5E5E5"}`,
              background: dragging ? "#FFF5F6" : "#FFFFFF",
              cursor: "pointer", textAlign: "center", transition: "border-color 0.15s, background 0.15s",
            }}
          >
            {coverPreview ? (
              <div style={{ width: "100%", height: "180px", position: "relative", borderRadius: "8px", overflow: "hidden" }}>
                <Image src={coverPreview} alt="Cover preview" fill style={{ objectFit: "cover" }} unoptimized />
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
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }} />
          </div>
        </Card>

      </div>

      {/* Footer actions */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "4px" }}>
        <Link href="/admin/party-themes" className="font-nunito font-bold"
          style={{ padding: "10px 20px", borderRadius: "8px", border: "1px solid #D6D6D6", background: "#FFFFFF", fontSize: "14px", color: "#424242", textDecoration: "none", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", display: "inline-flex", alignItems: "center" }}>
          Cancel
        </Link>
        <button
          type="button" onClick={handleNext} className="font-nunito font-bold"
          style={{ padding: "10px 28px", borderRadius: "8px", border: "1px solid #F63D68", background: "#F63D68", fontSize: "14px", color: "#FFFFFF", cursor: "pointer", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>

    </div>
  );
}
