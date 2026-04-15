"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  ChevronRight, UploadCloud,
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, List, ListOrdered,
  Link2, Image, Undo2, Redo2,
  Loader2,
} from "lucide-react";

// ── Types ───────────────────────────────────────────────────────

interface StoryForm {
  name: string;
  age: string;
  category: string;
  description: string;
  coverUrl: string | null;
}

// ── Shared form primitives ──────────────────────────────────────

function FormLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="font-nunito font-semibold" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242", display: "block" }}>
      {children}{required && <span style={{ color: "#F63D68" }}> *</span>}
    </label>
  );
}

function FormInput({ label, placeholder, value, onChange, required }: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; required?: boolean;
}) {
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

function FormSelect({ label, options, value, onChange, required }: {
  label: string; options: string[]; value: string;
  onChange: (v: string) => void; required?: boolean;
}) {
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
            background: "#FFFFFF",
            boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
            width: "100%", cursor: "pointer", appearance: "none",
          }}
        >
          <option value="" disabled>Choose</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronRight
          size={16}
          style={{
            position: "absolute", right: "14px", top: "50%",
            transform: "translateY(-50%) rotate(90deg)",
            color: "#A3A3A3", pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

// ── Card wrapper ────────────────────────────────────────────────

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

// ── Rich-text toolbar ───────────────────────────────────────────

const TOOLBAR_GROUPS = [
  [
    { icon: Bold,          label: "Bold" },
    { icon: Italic,        label: "Italic" },
    { icon: Underline,     label: "Underline" },
    { icon: Strikethrough, label: "Strikethrough" },
  ],
  [
    { icon: AlignLeft,   label: "Align left" },
    { icon: List,        label: "Bullet list" },
    { icon: ListOrdered, label: "Numbered list" },
  ],
  [
    { icon: Link2, label: "Insert link" },
    { icon: Image, label: "Insert image" },
  ],
  [
    { icon: Undo2, label: "Undo" },
    { icon: Redo2, label: "Redo" },
  ],
];

function RichTextToolbar() {
  return (
    <div style={{
      display: "flex", alignItems: "center", flexWrap: "wrap",
      gap: "2px", padding: "10px 14px",
      background: "#FAFAFA", borderBottom: "1px solid #E5E5E5",
      borderRadius: "8px 8px 0 0",
    }}>
      {TOOLBAR_GROUPS.map((group, gi) => (
        <div key={gi} style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {group.map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              title={label}
              style={{
                width: "30px", height: "30px", display: "flex", alignItems: "center",
                justifyContent: "center", borderRadius: "4px", border: "none",
                background: "none", cursor: "pointer", color: "#525252", flexShrink: 0,
              }}
            >
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

// ── Options ─────────────────────────────────────────────────────

const AGE_OPTIONS      = ["3-6", "4-7", "5-6", "5-8", "6-9", "7-10", "8-12"];
const CATEGORY_OPTIONS = ["Adventure", "Magical", "Educational", "Fantasy", "Science", "Animals"];

// ── Page ────────────────────────────────────────────────────────

export default function EditStoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { id } = params;

  // ── Data-fetching state ──────────────────────────────────────
  const [isLoading, setIsLoading]   = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isSaving, setIsSaving]     = useState(false);

  // ── Form state (populated from API response) ─────────────────
  const [form, setForm] = useState<StoryForm>({
    name: "", age: "", category: "", description: "", coverUrl: null,
  });
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [newCoverFile, setNewCoverFile] = useState<File | null>(null);
  const [dragging, setDragging]         = useState(false);

  const set = (k: keyof StoryForm) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  // ── Fetch story on mount ─────────────────────────────────────
  // TODO (backend): replace with actual API base URL + auth header
  useEffect(() => {
    const controller = new AbortController();

    async function fetchStory() {
      setIsLoading(true);
      setFetchError(null);
      try {
        const res = await fetch(`/api/stories/${id}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to load story (${res.status})`);
        const data = await res.json();

        // TODO (backend): adjust field names to match actual API response shape
        setForm({
          name:        data.name        ?? "",
          age:         data.age         ?? "",
          category:    data.category    ?? "",
          description: data.description ?? "",
          coverUrl:    data.coverUrl    ?? null,
        });
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setFetchError((err as Error).message ?? "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStory();
    return () => controller.abort();
  }, [id]);

  // ── File handling ────────────────────────────────────────────
  const handleFileSelect = (file: File) => {
    setNewCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFileSelect(file);
  };

  // ── Save helpers ─────────────────────────────────────────────
  async function save(status: "published" | "draft") {
    setIsSaving(true);
    try {
      // TODO (backend): if newCoverFile exists, upload to storage first and get URL
      // const uploadedUrl = newCoverFile ? await uploadCover(newCoverFile) : form.coverUrl;

      const body = {
        name:        form.name,
        age:         form.age,
        category:    form.category,
        description: form.description,
        status,
        // coverUrl: uploadedUrl,
      };

      // TODO (backend): adjust endpoint + auth header
      const res = await fetch(`/api/stories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Save failed (${res.status})`);
      router.push("/admin/stories");
    } catch (err) {
      alert((err as Error).message ?? "Save failed");
    } finally {
      setIsSaving(false);
    }
  }

  // ── Loading skeleton ─────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <Loader2 size={32} className="animate-spin" style={{ color: "#F63D68" }} />
          <p className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#525252" }}>
            Loading story…
          </p>
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────
  if (fetchError) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", maxWidth: "360px", textAlign: "center" }}>
          <p className="font-nunito font-semibold" style={{ fontSize: "18px", color: "#141414" }}>
            Failed to load story
          </p>
          <p className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>
            {fetchError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="font-nunito font-bold"
            style={{
              padding: "10px 20px", borderRadius: "8px", border: "1px solid #F63D68",
              background: "#F63D68", color: "#FFFFFF", cursor: "pointer", fontSize: "14px",
            }}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // ── Main form ────────────────────────────────────────────────
  const activeCover = coverPreview ?? form.coverUrl;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Breadcrumb + Actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin/stories" className="font-nunito font-bold" style={{ fontSize: "14px", color: "#424242", textDecoration: "none" }}>
            Stories
          </Link>
          <ChevronRight size={16} style={{ color: "#A3A3A3", flexShrink: 0 }} />
          <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>
            Edit Story
          </span>
        </div>

        <div style={{ display: "flex", gap: "12px", flexShrink: 0 }}>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => save("draft")}
            className="font-nunito font-bold"
            style={{
              padding: "10px 14px", borderRadius: "8px",
              border: "1px solid #D6D6D6", background: "#FFFFFF",
              fontSize: "14px", color: "#424242", cursor: isSaving ? "not-allowed" : "pointer",
              opacity: isSaving ? 0.6 : 1,
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
            }}
          >
            Save As Draft
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => save("published")}
            className="font-nunito font-bold"
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "10px 14px", borderRadius: "8px",
              border: "1px solid #F63D68", background: "#F63D68",
              fontSize: "14px", color: "#FFFFFF", cursor: isSaving ? "not-allowed" : "pointer",
              opacity: isSaving ? 0.6 : 1,
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
            }}
          >
            {isSaving && <Loader2 size={14} className="animate-spin" />}
            Save
          </button>
        </div>
      </div>

      {/* Single-column form */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* 1. Basic Information */}
        <Card title="Basic Information">
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <FormInput
              label="Product Name"
              placeholder="Enter name"
              value={form.name}
              onChange={set("name")}
              required
            />
            <div style={{ display: "flex", gap: "20px" }}>
              <FormSelect label="Age"      options={AGE_OPTIONS}      value={form.age}      onChange={set("age")}      required />
              <FormSelect label="Category" options={CATEGORY_OPTIONS} value={form.category} onChange={set("category")} required />
            </div>
          </div>
        </Card>

        {/* 2. Upload Cover Image */}
        <Card title="Upload Cover Image">
          {/* Current cover preview (from API or new upload) */}
          {activeCover && (
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeCover}
                alt="Story cover"
                style={{ width: "80px", height: "80px", borderRadius: "12px", objectFit: "cover", border: "1px solid #E5E5E5", flexShrink: 0 }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <p className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#424242" }}>Current Cover</p>
                <p className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>
                  Upload a new image below to replace it.
                </p>
              </div>
            </div>
          )}

          {/* Dropzone */}
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
              cursor: "pointer", textAlign: "center", transition: "border-color 0.15s, background 0.15s",
            }}
          >
            <div style={{
              width: "40px", height: "40px", borderRadius: "8px",
              border: "1px solid #EAECF0", background: "#FFFFFF",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <UploadCloud size={20} style={{ color: "#525252" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span className="font-nunito font-bold" style={{ fontSize: "14px", color: "#F63D68" }}>
                  Click to upload
                </span>
                <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#525252" }}>
                  or drag and drop
                </span>
              </div>
              <span className="font-nunito font-normal" style={{ fontSize: "12px", color: "#525252", textAlign: "center" }}>
                {newCoverFile ? newCoverFile.name : "SVG, PNG, JPG or mp4 (max. 800x400px)"}
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/mp4"
              style={{ display: "none" }}
              onChange={(e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }}
            />
          </div>
        </Card>

        {/* 3. Summary */}
        <Card title="Summary">
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <FormLabel>Description</FormLabel>
            <div style={{
              border: "1px solid #E5E5E5", borderRadius: "8px", overflow: "hidden",
              boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", display: "flex", flexDirection: "column",
            }}>
              <RichTextToolbar />
              <textarea
                placeholder="Enter a description..."
                value={form.description}
                onChange={(e) => set("description")(e.target.value)}
                className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
                style={{
                  width: "100%", minHeight: "180px", padding: "12px 14px",
                  fontSize: "16px", color: "#141414", background: "#FFFFFF",
                  border: "none", resize: "vertical", boxSizing: "border-box", display: "block",
                }}
              />
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
