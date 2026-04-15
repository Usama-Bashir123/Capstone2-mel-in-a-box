"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import {
  ChevronRight, UploadCloud,
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, List, ListOrdered,
  Link2, Image, Undo2, Redo2,
} from "lucide-react";

// ── Shared primitives ─────────────────────────────────────────────

function FormLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label
      className="font-nunito font-semibold"
      style={{ fontSize: "14px", lineHeight: "20px", color: "#424242", display: "block" }}
    >
      {children}{required && <span style={{ color: "#F63D68" }}> *</span>}
    </label>
  );
}

function FormInput({
  label, placeholder, value, onChange, required,
}: { label: string; placeholder: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <FormLabel required={required}>{label}</FormLabel>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
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

function FormSelect({
  label, options, value, onChange, required,
}: { label: string; options: string[]; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, minWidth: 0 }}>
      <FormLabel required={required}>{label}</FormLabel>
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-nunito font-normal focus:outline-none"
          style={{
            height: "44px", padding: "10px 14px", paddingRight: "40px",
            borderRadius: "8px", border: "1px solid #E5E5E5", fontSize: "16px",
            color: value ? "#141414" : "#737373",
            background: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
            width: "100%", cursor: "pointer", appearance: "none",
          }}
        >
          <option value="" disabled>Choose</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronRight size={16} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%) rotate(90deg)", color: "#A3A3A3", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px",
      padding: "20px", display: "flex", flexDirection: "column", gap: "24px",
    }}>
      <h3 className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414", margin: 0 }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

// ── Rich-text toolbar ─────────────────────────────────────────────

const TOOLBAR_GROUPS = [
  [{ icon: Bold, label: "Bold" }, { icon: Italic, label: "Italic" }, { icon: Underline, label: "Underline" }, { icon: Strikethrough, label: "Strikethrough" }],
  [{ icon: AlignLeft, label: "Align left" }, { icon: List, label: "Bullet list" }, { icon: ListOrdered, label: "Numbered list" }],
  [{ icon: Link2, label: "Insert link" }, { icon: Image, label: "Insert image" }],
  [{ icon: Undo2, label: "Undo" }, { icon: Redo2, label: "Redo" }],
];

function RichTextToolbar() {
  return (
    <div style={{
      display: "flex", alignItems: "center", flexWrap: "wrap", gap: "2px",
      padding: "10px 14px", background: "#FAFAFA",
      borderBottom: "1px solid #E5E5E5", borderRadius: "8px 8px 0 0",
    }}>
      {TOOLBAR_GROUPS.map((group, gi) => (
        <div key={gi} style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {group.map(({ icon: Icon, label }) => (
            <button key={label} type="button" title={label} style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px", border: "none", background: "none", cursor: "pointer", color: "#525252", flexShrink: 0 }}>
              <Icon size={15} />
            </button>
          ))}
          {gi < TOOLBAR_GROUPS.length - 1 && (
            <div style={{ width: "1px", height: "18px", background: "#E5E5E5", margin: "0 6px" }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Options ───────────────────────────────────────────────────────

const STORY_OPTIONS    = ["The Magical Jungle", "Space Explorer Mel", "Underwater Kingdom", "Dino Land Adventure"];
const GAME_TYPE_OPTIONS = ["Puzzle", "Memory Match", "Counting", "Spelling", "Sorting", "Tracing"];

// ── Page ──────────────────────────────────────────────────────────

export default function AddGamePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ title: "", story: "", type: "", instructions: "" });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleFileSelect = (file: File) => {
    setCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  void coverFile;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Breadcrumb + Actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin/games" className="font-nunito font-bold" style={{ fontSize: "14px", color: "#424242", textDecoration: "none" }}>
            Games
          </Link>
          <ChevronRight size={16} style={{ color: "#A3A3A3", flexShrink: 0 }} />
          <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>
            Add New Game
          </span>
        </div>

        <div style={{ display: "flex", gap: "12px", flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => router.push("/admin/games")}
            className="font-nunito font-bold"
            style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #D6D6D6", background: "#FFFFFF", fontSize: "14px", color: "#424242", cursor: "pointer", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)" }}
          >
            Save As Draft
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/games")}
            className="font-nunito font-bold"
            style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #F63D68", background: "#F63D68", fontSize: "14px", color: "#FFFFFF", cursor: "pointer", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)" }}
          >
            Publish
          </button>
        </div>
      </div>

      {/* Single column of cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* 1. Basic Information — single column: title → dropdowns → instructions */}
        <Card title="Basic Information">
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            <FormInput
              label="Game Title"
              placeholder="Enter name"
              value={form.title}
              onChange={set("title")}
              required
            />

            <div style={{ display: "flex", gap: "16px" }}>
              <FormSelect label="Link To story" options={STORY_OPTIONS}     value={form.story} onChange={set("story")} required />
              <FormSelect label="Game Type"     options={GAME_TYPE_OPTIONS} value={form.type}  onChange={set("type")}  required />
            </div>

            {/* Instructions — full width, below the dropdowns */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <FormLabel required>Instructions</FormLabel>
              <div style={{
                border: "1px solid #E5E5E5", borderRadius: "8px", overflow: "hidden",
                boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", display: "flex", flexDirection: "column",
              }}>
                <RichTextToolbar />
                <textarea
                  placeholder="Enter a description..."
                  value={form.instructions}
                  onChange={(e) => set("instructions")(e.target.value)}
                  className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
                  style={{
                    width: "100%", minHeight: "148px", padding: "12px 14px",
                    fontSize: "16px", color: "#141414", background: "#FFFFFF",
                    border: "none", resize: "vertical", boxSizing: "border-box", display: "block",
                  }}
                />
              </div>
            </div>

          </div>
        </Card>

        {/* 2. Upload Game Cover — full width */}
        <Card title="Upload Game Cover">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
              padding: "16px 24px", borderRadius: "8px",
              border: `1px solid ${dragging ? "#F63D68" : "#E5E5E5"}`,
              background: dragging ? "#FFF5F6" : "#FFFFFF",
              cursor: "pointer", textAlign: "center",
              transition: "border-color 0.15s, background 0.15s",
            }}
          >
            {coverPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverPreview} alt="Cover preview" style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px" }} />
            ) : (
              <>
                <div style={{ width: "40px", height: "40px", borderRadius: "8px", border: "1px solid #EAECF0", background: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <UploadCloud size={20} style={{ color: "#525252" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>Click to upload</span>
                    <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#525252" }}>or drag and drop</span>
                  </div>
                  <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#525252", textAlign: "center" }}>
                    SVG, PNG, JPG or mp4 (max. 800x400px)
                  </span>
                </div>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/mp4"
              style={{ display: "none" }}
              onChange={(e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }}
            />
          </div>
        </Card>

      </div>
    </div>
  );
}
