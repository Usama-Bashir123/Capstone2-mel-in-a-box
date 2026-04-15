"use client";

// Settings — Account: 214:17395 | Notifications: 214:17709
//            Parental Controls: 214:17778 | Security: 214:18127
// Fully wired to Firebase Auth, Firestore, and Storage.

import { useState, useEffect, useRef, useCallback } from "react";
import { Upload, XCircle, Eye, EyeOff, LogOut, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import {
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";
import { useAuth } from "@/components/auth/auth-context";
import { useRouter } from "next/navigation";

/* ─────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────── */
type Tab = "Account" | "Notifications" | "Parental Controls" | "Security";
const TABS: Tab[] = ["Account", "Notifications", "Parental Controls", "Security"];

interface ChildData {
  id: string;
  name: string;
  dob?: string;
  contentRating?: string;
  screenTime?: string;
  allowedCategories?: string;
}

interface NotifSettings {
  storyProgressEmail: boolean;
  newBadgeEmail: boolean;
  purchasesEmail: boolean;
  marketingEmail: boolean;
  appActivity: boolean;
  storyCompletion: boolean;
  promoOffers: boolean;
}

interface ParentalSettings {
  hideAdvanced: boolean;
  disableLinks: boolean;
  ageAppropriate: boolean;
  bedtime: boolean;
  globalScreenTime: string;
  children: Record<string, { contentRating: string; screenTime: string; allowedCategories: string }>;
}

/* ─────────────────────────────────────────────────────────
   Toast notification
───────────────────────────────────────────────────────── */
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        background: type === "success" ? "#ECFDF3" : "#FEF3F2",
        border: `1px solid ${type === "success" ? "#ABEFC6" : "#FECDCA"}`,
        borderRadius: "12px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxShadow: "0px 4px 16px rgba(16,24,40,0.12)",
        minWidth: "320px",
        maxWidth: "420px",
        animation: "slideIn 0.2s ease",
      }}
    >
      {type === "success"
        ? <CheckCircle size={20} style={{ color: "#17B26A", flexShrink: 0 }} />
        : <AlertCircle size={20} style={{ color: "#F04438", flexShrink: 0 }} />
      }
      <span className="font-nunito font-medium" style={{ fontSize: "14px", color: type === "success" ? "#054F31" : "#7A271A", flex: 1 }}>
        {message}
      </span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", display: "flex", color: "#737373" }}>×</button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Shared UI primitives
───────────────────────────────────────────────────────── */
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
      <span className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>
        {title}
      </span>
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="font-nunito font-semibold" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}>
      {children}
    </label>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300"
        style={{
          width: "100%",
          height: "44px",
          padding: "10px 14px",
          borderRadius: "8px",
          border: "1px solid #E5E5E5",
          fontSize: "16px",
          color: "#292929",
          background: disabled ? "#FAFAFA" : "#FFFFFF",
          boxShadow: "0px 1px 2px rgba(16,24,40,0.05)",
          boxSizing: "border-box",
          opacity: disabled ? 0.7 : 1,
        }}
      />
    </div>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
      <FieldLabel>{label}</FieldLabel>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="font-nunito font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300"
          style={{ width: "100%", height: "44px", padding: "10px 44px 10px 14px", borderRadius: "8px", border: "1px solid #E5E5E5", fontSize: "16px", color: "#292929", background: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", boxSizing: "border-box" }}
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}
        >
          {show ? <EyeOff size={16} style={{ color: "#737373" }} /> : <Eye size={16} style={{ color: "#737373" }} />}
        </button>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
      <FieldLabel>{label}</FieldLabel>
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-nunito font-normal focus:outline-none"
          style={{ width: "100%", height: "44px", padding: "10px 40px 10px 14px", borderRadius: "8px", border: "1px solid #E5E5E5", fontSize: "16px", color: "#292929", background: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", appearance: "none", cursor: "pointer" }}
        >
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <svg style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="20" height="20" fill="none" viewBox="0 0 20 20">
          <path d="M5 7.5l5 5 5-5" stroke="#424242" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function Toggle({ on, onToggle, disabled = false }: { on: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      style={{ width: "36px", height: "20px", borderRadius: "9999px", background: on ? "#F63D68" : "#F2F4F7", border: "none", cursor: disabled ? "default" : "pointer", padding: "2px", display: "flex", alignItems: "center", justifyContent: on ? "flex-end" : "flex-start", flexShrink: 0, transition: "background 0.2s", opacity: disabled ? 0.6 : 1 }}
    >
      <div style={{ width: "16px", height: "16px", borderRadius: "9999px", background: "#FFFFFF", boxShadow: "0px 1px 2px rgba(16,24,40,0.06), 0px 1px 3px rgba(16,24,40,0.10)" }} />
    </button>
  );
}

function ToggleRow({ label, on, onToggle, disabled = false }: { label: string; on: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <div style={{ background: "#FAFAFA", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
      <span className="font-nunito font-semibold" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}>{label}</span>
      <Toggle on={on} onToggle={onToggle} disabled={disabled} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Delete Account Modal
───────────────────────────────────────────────────────── */
function DeleteAccountModal({
  onCancel,
  onConfirm,
  isDeleting,
}: {
  onCancel: () => void;
  onConfirm: (password: string) => void;
  isDeleting: boolean;
}) {
  const [pwd, setPwd] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "28px", width: "440px", display: "flex", flexDirection: "column", gap: "20px", boxShadow: "0px 8px 32px rgba(16,24,40,0.16)" }}>
        <div>
          <h2 className="font-nunito font-semibold" style={{ fontSize: "20px", color: "#141414", marginBottom: "6px" }}>Delete Account?</h2>
          <p className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252", lineHeight: "20px" }}>
            This action is permanent and cannot be undone. All child profiles, story history, and purchased content will be lost.
          </p>
        </div>
        <PasswordInput label="Confirm your password to continue" value={pwd} onChange={setPwd} placeholder="Your current password" />
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button onClick={onCancel} className="font-nunito font-semibold" style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #D6D6D6", background: "#FFFFFF", fontSize: "14px", color: "#424242", cursor: "pointer" }}>
            Cancel
          </button>
          <button
            onClick={() => onConfirm(pwd)}
            disabled={isDeleting || !pwd}
            className="font-nunito font-bold text-white"
            style={{ padding: "10px 16px", borderRadius: "8px", background: "#F04438", border: "1px solid #FECDCA", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", opacity: isDeleting || !pwd ? 0.6 : 1 }}
          >
            {isDeleting ? <><Loader2 size={14} className="animate-spin" /> Deleting...</> : "Delete My Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────── */
export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Account");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
  }, []);

  // ── ACCOUNT state ────────────────────────────────────────
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState("English");
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isAccountLoading, setIsAccountLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── NOTIFICATIONS state ──────────────────────────────────
  const [notif, setNotif] = useState<NotifSettings>({
    storyProgressEmail: true,
    newBadgeEmail: true,
    purchasesEmail: true,
    marketingEmail: false,
    appActivity: true,
    storyCompletion: true,
    promoOffers: true,
  });
  const [isNotifLoading, setIsNotifLoading] = useState(true);

  // ── PARENTAL CONTROLS state ──────────────────────────────
  const [children, setChildren] = useState<ChildData[]>([]);
  const [parental, setParental] = useState<ParentalSettings>({
    hideAdvanced: true,
    disableLinks: true,
    ageAppropriate: true,
    bedtime: true,
    globalScreenTime: "1h 30m",
    children: {},
  });
  const [isParentalLoading, setIsParentalLoading] = useState(true);

  // ── SECURITY state ───────────────────────────────────────
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [isUpdatingPwd, setIsUpdatingPwd] = useState(false);
  const [twoFA] = useState(false);

  /* ── Load Account data ─────────────────────────────────── */
  useEffect(() => {
    if (!user) return;
    setDisplayName(user.displayName || "");
    setEmail(user.email || "");
    setPhotoURL(user.photoURL || null);

    const fetchProfile = async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setPhone(data.phone || "");
          setLanguage(data.language || "English");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setIsAccountLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  /* ── Load Notifications ────────────────────────────────── */
  useEffect(() => {
    if (!user) return;
    const fetchNotif = async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid, "settings", "notifications"));
        if (snap.exists()) setNotif((prev) => ({ ...prev, ...snap.data() }));
      } catch (err) {
        console.error("Error loading notifications:", err);
      } finally {
        setIsNotifLoading(false);
      }
    };
    fetchNotif();
  }, [user]);

  /* ── Load Parental Controls + Children ─────────────────── */
  useEffect(() => {
    if (!user) return;
    const fetchParental = async () => {
      try {
        // Load settings
        const snap = await getDoc(doc(db, "users", user.uid, "settings", "parentalControls"));
        if (snap.exists()) setParental((prev) => ({ ...prev, ...snap.data() }));

        // Load children list
        const childSnap = await getDocs(
          query(collection(db, "users", user.uid, "children"), orderBy("createdAt", "desc"))
        );
        const childList = childSnap.docs.map((d) => ({ id: d.id, ...d.data() } as ChildData));
        setChildren(childList);

        // Init per-child overrides if missing
        setParental((prev) => {
          const updated = { ...prev };
          childList.forEach((c) => {
            if (!updated.children[c.id]) {
              updated.children[c.id] = {
                contentRating: c.contentRating || "Age-appropriate (3-7)",
                screenTime: c.screenTime || "1h 30m",
                allowedCategories: "Stories & Games",
              };
            }
          });
          return updated;
        });
      } catch (err) {
        console.error("Error loading parental controls:", err);
      } finally {
        setIsParentalLoading(false);
      }
    };
    fetchParental();
  }, [user]);

  /* ── Handle photo file pick ────────────────────────────── */
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  /* ── Save Account ──────────────────────────────────────── */
  const handleSaveAccount = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      let newPhotoURL = user.photoURL || null;

      // Upload photo if changed
      if (photoFile) {
        const sRef = storageRef(storage, `avatars/${user.uid}/parent_avatar`);
        await uploadBytes(sRef, photoFile);
        newPhotoURL = await getDownloadURL(sRef);
      }

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName,
        photoURL: newPhotoURL ?? undefined,
      });

      // Update email if changed
      if (email !== user.email) {
        await updateEmail(user, email);
      }

      // Save extra fields to Firestore
      await setDoc(
        doc(db, "users", user.uid),
        { phone, language, displayName, email, photoURL: newPhotoURL },
        { merge: true }
      );

      setPhotoURL(newPhotoURL);
      setPhotoFile(null);
      setPhotoPreview(null);
      showToast("Profile updated successfully!", "success");
    } catch (err) {
      const e = err as { message?: string; code?: string };
      console.error(err);
      showToast(e.message || "Failed to update profile.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  /* ── Save Notifications ────────────────────────────────── */
  const handleSaveNotifications = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid, "settings", "notifications"), notif);
      showToast("Notification preferences saved!", "success");
    } catch (err) {
      const e = err as { message?: string };
      showToast(e.message || "Failed to save notifications.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  /* ── Save Parental Controls ────────────────────────────── */
  const handleSaveParental = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid, "settings", "parentalControls"), parental);
      showToast("Parental controls saved!", "success");
    } catch (err) {
      const e = err as { message?: string };
      showToast(e.message || "Failed to save parental controls.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  /* ── Change Password ───────────────────────────────────── */
  const handleChangePassword = async () => {
    if (!user || !user.email) return;
    if (newPwd !== confirmPwd) {
      showToast("New passwords do not match.", "error");
      return;
    }
    if (newPwd.length < 6) {
      showToast("Password must be at least 6 characters.", "error");
      return;
    }
    setIsUpdatingPwd(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPwd);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPwd);
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
      showToast("Password updated successfully!", "success");
    } catch (err) {
      const e = err as { code?: string; message?: string };
      showToast(
        e.code === "auth/wrong-password"
          ? "Current password is incorrect."
          : e.message || "Failed to update password.",
        "error"
      );
    } finally {
      setIsUpdatingPwd(false);
    }
  };

  /* ── Delete Account ────────────────────────────────────── */
  const handleDeleteAccount = async (password: string) => {
    if (!user || !user.email) return;
    setIsDeletingAccount(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      await deleteUser(user);
      router.push("/login");
    } catch (err) {
      const e = err as { code?: string; message?: string };
      setIsDeletingAccount(false);
      showToast(
        e.code === "auth/wrong-password"
          ? "Incorrect password. Please try again."
          : e.message || "Failed to delete account.",
        "error"
      );
    }
  };

  /* ── Sign Out ──────────────────────────────────────────── */
  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  /* ── Save dispatcher ───────────────────────────────────── */
  const handleSave = () => {
    if (activeTab === "Account") handleSaveAccount();
    else if (activeTab === "Notifications") handleSaveNotifications();
    else if (activeTab === "Parental Controls") handleSaveParental();
  };

  /* ── Cancel ────────────────────────────────────────────── */
  const handleCancel = () => {
    if (activeTab === "Account") {
      setDisplayName(user?.displayName || "");
      setEmail(user?.email || "");
      setPhotoFile(null);
      setPhotoPreview(null);
    }
  };

  const currentAvatar = photoPreview || photoURL;
  const initials = displayName?.trim().charAt(0)?.toUpperCase() || "?";

  /* ═══════════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{`@keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* ── Page Header ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <h1 className="font-nunito font-semibold" style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}>Settings</h1>
            <p className="font-nunito font-normal" style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}>
              Manage your account, preferences, and parental controls.
            </p>
          </div>
          {activeTab !== "Security" && (
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="font-nunito font-semibold"
                style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #D6D6D6", background: "#FFFFFF", fontSize: "14px", lineHeight: "20px", color: "#424242", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer", opacity: isSaving ? 0.5 : 1 }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="font-nunito font-bold text-white"
                style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #F63D68", background: "#F63D68", fontSize: "14px", lineHeight: "20px", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", opacity: isSaving ? 0.7 : 1 }}
              >
                {isSaving ? <><Loader2 size={14} className="animate-spin" />Saving...</> : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* ── Tab Bar ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px", paddingBottom: "12px", borderBottom: "1px solid #E5E5E5" }}>
          {TABS.map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={active ? "font-nunito font-semibold" : "font-nunito font-medium"}
                style={{ height: "36px", padding: "8px 12px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "14px", lineHeight: "20px", color: active ? "#F63D68" : "#292929", background: active ? "#FFFFFF" : "transparent", boxShadow: active ? "0px 1px 2px rgba(16,24,40,0.06), 0px 1px 3px rgba(16,24,40,0.10)" : "none", transition: "all 0.15s", whiteSpace: "nowrap" }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════
            ACCOUNT TAB
        ══════════════════════════════════════════════════ */}
        <div style={{ display: activeTab === "Account" ? "flex" : "none", flexDirection: "column", gap: "16px" }}>

          {isAccountLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
              <Loader2 className="animate-spin" size={28} style={{ color: "#F63D68" }} />
            </div>
          ) : (
            <>
              {/* Parent Profile */}
              <SectionCard title="Parent Profile">
                <InputField label="Full Name" value={displayName} onChange={setDisplayName} placeholder="Your name" />
                <div style={{ display: "flex", gap: "20px" }}>
                  <InputField label="Email" value={email} onChange={setEmail} placeholder="your@email.com" type="email" />
                  <InputField label="Phone Number" value={phone} onChange={setPhone} placeholder="+1 (555) 000-0000" type="tel" />
                </div>

                {/* Photo upload */}
                <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span className="font-nunito font-semibold" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}>Your photo</span>
                    <span className="font-nunito font-normal" style={{ fontSize: "14px", lineHeight: "20px", color: "#737373" }}>This will be displayed on your profile.</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "24px", flex: 1 }}>
                    {/* Avatar */}
                    <div style={{ width: "80px", height: "80px", borderRadius: "9999px", background: currentAvatar ? "transparent" : "#F2F4F7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "0.75px solid rgba(0,0,0,0.08)", overflow: "hidden" }}>
                      {currentAvatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={currentAvatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span className="font-nunito font-semibold" style={{ fontSize: "24px", color: "#737373" }}>{initials}</span>
                      )}
                    </div>

                    {/* Drop zone */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{ flex: 1, background: "#FFFFFF", border: "1px dashed #E5E5E5", borderRadius: "8px", padding: "16px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer" }}
                    >
                      <div style={{ width: "40px", height: "40px", borderRadius: "8px", border: "1px solid #E5E5E5", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)" }}>
                        <Upload size={20} style={{ color: "#424242" }} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#F63D68" }}>Click to upload</span>
                        <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#525252" }}>or drag and drop</span>
                      </div>
                      <span className="font-nunito font-normal" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>SVG, PNG, JPG (max 5 MB)</span>
                      {photoFile && (
                        <span className="font-nunito font-medium" style={{ fontSize: "12px", color: "#F63D68" }}>✓ {photoFile.name}</span>
                      )}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoChange} />
                  </div>
                </div>
              </SectionCard>

              {/* Language */}
              <SectionCard title="Language Preference">
                <SelectField
                  label="Preferred Language"
                  value={language}
                  onChange={setLanguage}
                  options={["English", "Spanish", "French", "Arabic", "Portuguese"]}
                />
              </SectionCard>

              {/* Delete Account */}
              <SectionCard title="DELETE ACCOUNT">
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <span className="font-nunito font-semibold" style={{ fontSize: "14px", lineHeight: "20px", color: "#424242" }}>If you delete this account:</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {["All child profiles", "Story history", "Game progress", "Purchased content access"].map((item) => (
                      <div key={item} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <XCircle size={16} style={{ color: "#F04438", flexShrink: 0 }} />
                        <span className="font-nunito font-normal" style={{ fontSize: "12px", lineHeight: "18px", color: "#525252" }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(true)}
                      className="font-nunito font-bold"
                      style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #FECDCA", background: "#FEF3F2", fontSize: "12px", lineHeight: "18px", color: "#F04438", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer" }}
                    >
                      Delete my Account
                    </button>
                  </div>
                </div>
              </SectionCard>
            </>
          )}
        </div>

        {/* ══════════════════════════════════════════════════
            NOTIFICATIONS TAB
        ══════════════════════════════════════════════════ */}
        <div style={{ display: activeTab === "Notifications" ? "flex" : "none", flexDirection: "column", gap: "16px" }}>
          {isNotifLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
              <Loader2 className="animate-spin" size={28} style={{ color: "#F63D68" }} />
            </div>
          ) : (
            <>
              <SectionCard title="Email Notifications">
                <div style={{ display: "flex", gap: "32px" }}>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
                    <ToggleRow label="Story Progress Updates" on={notif.storyProgressEmail} onToggle={() => setNotif((p) => ({ ...p, storyProgressEmail: !p.storyProgressEmail }))} />
                    <ToggleRow label="Purchase Confirmations" on={notif.purchasesEmail} onToggle={() => setNotif((p) => ({ ...p, purchasesEmail: !p.purchasesEmail }))} />
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
                    <ToggleRow label="New Badge Earned" on={notif.newBadgeEmail} onToggle={() => setNotif((p) => ({ ...p, newBadgeEmail: !p.newBadgeEmail }))} />
                    <ToggleRow label="Marketing Updates" on={notif.marketingEmail} onToggle={() => setNotif((p) => ({ ...p, marketingEmail: !p.marketingEmail }))} />
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Push Notifications">
                <div style={{ display: "flex", gap: "32px" }}>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
                    <ToggleRow label="App Activity" on={notif.appActivity} onToggle={() => setNotif((p) => ({ ...p, appActivity: !p.appActivity }))} />
                    <ToggleRow label="Promotional Offers" on={notif.promoOffers} onToggle={() => setNotif((p) => ({ ...p, promoOffers: !p.promoOffers }))} />
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
                    <ToggleRow label="Story Completion Alerts" on={notif.storyCompletion} onToggle={() => setNotif((p) => ({ ...p, storyCompletion: !p.storyCompletion }))} />
                  </div>
                </div>
              </SectionCard>
            </>
          )}
        </div>

        {/* ══════════════════════════════════════════════════
            PARENTAL CONTROLS TAB
        ══════════════════════════════════════════════════ */}
        <div style={{ display: activeTab === "Parental Controls" ? "flex" : "none", flexDirection: "column", gap: "16px" }}>
          {isParentalLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
              <Loader2 className="animate-spin" size={28} style={{ color: "#F63D68" }} />
            </div>
          ) : (
            <>
              {/* Child Access Rules — only shown if children exist */}
              {children.length > 0 && (
                <SectionCard title="Child Access Rules">
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {children.map((child) => {
                      const childSettings = parental.children[child.id] || {
                        contentRating: "Age-appropriate (3-7)",
                        screenTime: "1h 30m",
                        allowedCategories: "Stories & Games",
                      };
                      const updateChild = (key: string, val: string) =>
                        setParental((p) => ({
                          ...p,
                          children: {
                            ...p.children,
                            [child.id]: { ...childSettings, [key]: val },
                          },
                        }));

                      return (
                        <div key={child.id} style={{ background: "#FAFAFA", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                          <span className="font-nunito font-semibold" style={{ fontSize: "18px", lineHeight: "28px", color: "#141414" }}>
                            {child.name}
                          </span>
                          <div style={{ display: "flex", gap: "12px" }}>
                            <SelectField
                              label="Content Rating"
                              value={childSettings.contentRating}
                              onChange={(v) => updateChild("contentRating", v)}
                              options={["Age-appropriate (3-7)", "Educational only", "All content"]}
                            />
                            <SelectField
                              label="Daily Screen Time"
                              value={childSettings.screenTime}
                              onChange={(v) => updateChild("screenTime", v)}
                              options={["30m", "1h", "1h 30m", "2h", "Unlimited"]}
                            />
                          </div>
                          <SelectField
                            label="Allowed Categories"
                            value={childSettings.allowedCategories}
                            onChange={(v) => updateChild("allowedCategories", v)}
                            options={["Stories only", "Games only", "Stories & Games", "All"]}
                          />
                        </div>
                      );
                    })}
                  </div>
                </SectionCard>
              )}

              {children.length === 0 && (
                <div style={{ background: "#FAFAFA", borderRadius: "12px", padding: "32px", textAlign: "center" }}>
                  <p className="font-nunito font-medium" style={{ color: "#737373", fontSize: "14px" }}>
                    No children profiles yet. Add a child profile to configure per-child access rules.
                  </p>
                </div>
              )}

              {/* Content Restrictions */}
              <SectionCard title="Content Restrictions">
                <div style={{ display: "flex", gap: "32px" }}>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
                    <ToggleRow label="Hide advanced games" on={parental.hideAdvanced} onToggle={() => setParental((p) => ({ ...p, hideAdvanced: !p.hideAdvanced }))} />
                    <ToggleRow label="Allow only age-appropriate content" on={parental.ageAppropriate} onToggle={() => setParental((p) => ({ ...p, ageAppropriate: !p.ageAppropriate }))} />
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
                    <ToggleRow label="Disable external links" on={parental.disableLinks} onToggle={() => setParental((p) => ({ ...p, disableLinks: !p.disableLinks }))} />
                  </div>
                </div>
              </SectionCard>

              {/* Time Controls */}
              <SectionCard title="Time Controls">
                <SelectField
                  label="Global Daily Time Limit (all children)"
                  value={parental.globalScreenTime}
                  onChange={(v) => setParental((p) => ({ ...p, globalScreenTime: v }))}
                  options={["30m", "1h", "1h 30m", "2h", "3h", "Unlimited"]}
                />
                <ToggleRow label="Bedtime Mode ( 8:00 PM to 7:00 AM )" on={parental.bedtime} onToggle={() => setParental((p) => ({ ...p, bedtime: !p.bedtime }))} />
              </SectionCard>
            </>
          )}
        </div>

        {/* ══════════════════════════════════════════════════
            SECURITY TAB
        ══════════════════════════════════════════════════ */}
        <div style={{ display: activeTab === "Security" ? "flex" : "none", flexDirection: "column", gap: "16px" }}>

          {/* Change Password */}
          <SectionCard title="Change Password">
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <PasswordInput label="Current Password" value={currentPwd} onChange={setCurrentPwd} placeholder="••••••••" />
              <div style={{ display: "flex", gap: "20px" }}>
                <PasswordInput label="New Password" value={newPwd} onChange={setNewPwd} placeholder="Min. 6 characters" />
                <PasswordInput label="Re-type New Password" value={confirmPwd} onChange={setConfirmPwd} placeholder="Min. 6 characters" />
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={isUpdatingPwd || !currentPwd || !newPwd || !confirmPwd}
                className="font-nunito font-bold text-white"
                style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #F63D68", background: "#F63D68", fontSize: "12px", lineHeight: "18px", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", opacity: isUpdatingPwd || !currentPwd || !newPwd || !confirmPwd ? 0.6 : 1 }}
              >
                {isUpdatingPwd ? <><Loader2 size={12} className="animate-spin" />Updating...</> : "Update Password"}
              </button>
            </div>
          </SectionCard>

          {/* Sign Out */}
          <SectionCard title="Session">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FAFAFA", borderRadius: "12px", padding: "16px" }}>
              <div>
                <p className="font-nunito font-semibold" style={{ fontSize: "14px", color: "#424242" }}>Signed in as</p>
                <p className="font-nunito font-normal" style={{ fontSize: "14px", color: "#737373" }}>{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="font-nunito font-semibold"
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px", borderRadius: "8px", border: "1px solid #D6D6D6", background: "#FFFFFF", fontSize: "14px", color: "#424242", cursor: "pointer", boxShadow: "0px 1px 2px rgba(16,24,40,0.05)" }}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </SectionCard>

          {/* Two-Factor Authentication */}
          <SectionCard title="Two-Factor Authentication">
            <ToggleRow
              label="Enable Two-Factor Authentication (coming soon)"
              on={twoFA}
              onToggle={() => showToast("2FA is coming soon!", "error")}
              disabled={true}
            />
          </SectionCard>
        </div>

      </div>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <DeleteAccountModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
          isDeleting={isDeletingAccount}
        />
      )}
    </>
  );
}
