"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  ChevronRight, UploadCloud,
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, List, ListOrdered,
  Link2, Image as ImageIcon, Undo2, Redo2,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { logActivity } from "@/lib/activity";

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
  label, placeholder, value, onChange, required, disabled
}: { label: string; placeholder: string; value: string; onChange: (v: string) => void; required?: boolean; disabled?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <FormLabel required={required}>{label}</FormLabel>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
        style={{
          height: "44px", padding: "10px 14px", borderRadius: "8px",
          border: "1px solid #E5E5E5", fontSize: "16px", color: "#141414",
          background: disabled ? "#F5F5F5" : "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
          width: "100%", boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function FormSelect({
  label, options, value, onChange, required, disabled
}: { label: string; options: {id: string, name: string}[]; value: string; onChange: (v: string) => void; required?: boolean; disabled?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, minWidth: 0 }}>
      <FormLabel required={required}>{label}</FormLabel>
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="font-nunito font-normal focus:outline-none"
          style={{
            height: "44px", padding: "10px 14px", paddingRight: "40px",
            borderRadius: "8px", border: "1px solid #E5E5E5", fontSize: "16px",
            color: value ? "#141414" : "#737373",
            background: disabled ? "#F5F5F5" : "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
            width: "100%", cursor: "pointer", appearance: "none",
          }}
        >
          <option value="" disabled>Choose</option>
          {options.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
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
  [{ icon: Link2, label: "Insert link" }, { icon: ImageIcon, label: "Insert image" }],
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

const GAME_TYPE_OPTIONS = [
  {id: "Puzzle", name: "Puzzle"},
  {id: "Memory Match", name: "Memory Match"},
  {id: "Counting", name: "Counting"},
  {id: "Spelling", name: "Spelling"},
  {id: "Sorting", name: "Sorting"},
  {id: "Tracing", name: "Tracing"}
];

export default function AddGamePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ title: "", storyId: "", type: "", instructions: "" });
  const [stories, setStories] = useState<{id: string, name: string}[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchStories() {
      const q = query(collection(db, "stories"), orderBy("title", "asc"));
      const snapshot = await getDocs(q);
      setStories(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().title })));
    }
    fetchStories();
  }, []);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleFileSelect = (file: File) => {
    setCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSave = async (status: "Published" | "Draft") => {
    if (!form.title || isSaving) return;
    setIsSaving(true);
    let coverUrl = "";

    try {
      if (coverFile) {
        const storageRef = ref(storage, `games/${Date.now()}_${coverFile.name}`);
        const snapshot = await uploadBytes(storageRef, coverFile);
        coverUrl = await getDownloadURL(snapshot.ref);
      }

      const selectedStory = stories.find(s => s.id === form.storyId);

      await addDoc(collection(db, "games"), {
        title: form.title,
        storyId: form.storyId,
        storyName: selectedStory ? selectedStory.name : "",
        type: form.type,
        instructions: form.instructions,
        icon: coverUrl,
        status: status,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
      });

      await logActivity({
        type: "Game",
        activity: `Created new game "${form.title}"`,
        targetName: form.title
      });

      router.push("/admin/games");
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Detailed Error creating game:", error);
      alert(`Failed to create game: ${error?.message || "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

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
            disabled={isSaving}
            onClick={() => onSave("Draft")}
            className="font-nunito font-bold"
            style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #D6D6D6", background: "#FFFFFF", fontSize: "14px", color: "#424242", cursor: isSaving ? "not-allowed" : "pointer", opacity: isSaving ? 0.6 : 1, boxShadow: "0px 1px 2px rgba(16,24,40,0.05)" }}
          >
            Save As Draft
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => onSave("Published")}
            className="font-nunito font-bold"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 14px", borderRadius: "8px", border: "1px solid #F63D68", background: "#F63D68", fontSize: "14px", color: "#FFFFFF", cursor: isSaving ? "not-allowed" : "pointer", opacity: isSaving ? 0.6 : 1, boxShadow: "0px 1px 2px rgba(16,24,40,0.05)" }}
          >
            {isSaving && <Loader2 size={14} className="animate-spin" />}
            Publish
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        <Card title="Basic Information">
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <FormInput
              label="Game Title"
              placeholder="Enter name"
              value={form.title}
              onChange={set("title")}
              required
              disabled={isSaving}
            />

            <div style={{ display: "flex", gap: "16px" }}>
              <FormSelect label="Link To story" options={stories} value={form.storyId} onChange={set("storyId")} required disabled={isSaving} />
              <FormSelect label="Game Type" options={GAME_TYPE_OPTIONS} value={form.type} onChange={set("type")} required disabled={isSaving} />
            </div>

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
                  disabled={isSaving}
                  className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none"
                  style={{
                    width: "100%", minHeight: "148px", padding: "12px 14px",
                    fontSize: "16px", color: "#141414", background: isSaving ? "#F5F5F5" : "#FFFFFF",
                    border: "none", resize: "vertical", boxSizing: "border-box", display: "block",
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card title="Upload Game Cover">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); }}
            onClick={() => !isSaving && fileInputRef.current?.click()}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "12px",
              padding: "16px 24px", borderRadius: "8px",
              border: `1px solid ${dragging ? "#F63D68" : "#E5E5E5"}`,
              background: dragging ? "#FFF5F6" : "#FFFFFF",
              cursor: isSaving ? "not-allowed" : "pointer", textAlign: "center",
              transition: "border-color 0.15s, background 0.15s",
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            {coverPreview ? (
              <div style={{ width: "100%", height: "200px", position: "relative", borderRadius: "8px", overflow: "hidden" }}>
                <Image
                  src={coverPreview}
                  alt="Cover preview"
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>
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
                    SVG, PNG, JPG (max. 800x400px)
                  </span>
                </div>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }}
            />
          </div>
        </Card>

      </div>
    </div>
  );
}
