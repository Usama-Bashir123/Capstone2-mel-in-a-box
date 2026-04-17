"use client";

// Login Page — Figma node 213:16101 (auto layout inside 213:16032)
// Container: 534px, padding 42px, gap 32px, r=30, white, shadow
// Header: Display sm/Bold = Nunito 700 30px, textAlign CENTER, Gray true/900 = #141414
// Supporting text: Text md/Regular = Nunito 400 16px, textAlign CENTER, Gray true/600 = #525252
// Role selector: row gap=32, each 172px, padding 12px 24px, r=12
//   Inactive: bg white, border Rosé/400 = #FD6F8E 2px, text Rosé/400
//   Active: bg Rosé/400 = #FD6F8E, border Rosé/400, text white
// Labels: Text sm/Medium = Nunito 500 14px, Gray true/800 = #292929
// Inputs: border Gray/300 = #D6D6D6, r=8, padding 10px 14px, shadow-xs
// Row (remember + forgot): space-between
// Sign in button: Rosé/500 = #F63D68, Text md/Bold = Nunito 700 16px white, full width, padding 10px 16px
// Social buttons: border #D0D5DD, gap 12, padding 10px 16px, r=8, Text md/Semibold = Nunito 600 16px
// Footer: Text sm/Regular = Nunito 400 14px, Gray true/800; "Sign up" = Text sm/Bold Rosé/500

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"parents" | "child">("child");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check user status in Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (userDoc.exists() && userDoc.data().status === "Disabled") {
        await auth.signOut();
        setError("Your account has been disabled. Please contact support.");
        setIsLoading(false);
        return;
      }

      router.push(role === "parents" ? "/parent" : "/child");
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to log in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setError(null);
    setIsLoading(true);
    
    try {
      const authProvider = provider === "google" 
        ? new GoogleAuthProvider() 
        : new GithubAuthProvider();
      const userCredential = await signInWithPopup(auth, authProvider);
      
      // Check user status in Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (userDoc.exists() && userDoc.data().status === "Disabled") {
        await auth.signOut();
        setError("Your account has been disabled. Please contact support.");
        setIsLoading(false);
        return;
      }

      router.push(role === "parents" ? "/parent" : "/child");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : `Failed to sign in with ${provider}.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header — Display sm/Bold = Nunito 700 30px lh=38px, CENTER, Gray true/900 */}
      <div className="flex flex-col gap-2 text-center">
        <h1
          className="font-nunito font-bold"
          style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}
        >
          Log in to your account
        </h1>
        {/* Text md/Regular = Nunito 400 16px lh=24px CENTER Gray true/600 = #525252 */}
        <p
          className="font-nunito font-normal"
          style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}
        >
          Welcome back! Please enter your details.
        </p>
      </div>

      {/* Role selector — layout_8J74Z1: row gap=32
          Each container: 172px w, padding 12px 24px, r=12
          Inactive: bg white, border Rosé/400 = #FD6F8E 2px, text Rosé/400
          Active: bg Rosé/400 = #FD6F8E, border Rosé/400, text white */}
      <div className="flex justify-center gap-8">
        {(["parents", "child"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className="flex items-center justify-center gap-2 font-nunito font-semibold transition-all"
            style={{
              width: "172px",
              padding: "12px 24px",
              borderRadius: "12px",
              fontSize: "20px",
              lineHeight: "30px",
              background: role === r ? "#FD6F8E" : "#FFFFFF",
              border: "2px solid #FD6F8E",
              color: role === r ? "#FFFFFF" : "#FD6F8E",
            }}
          >
            <span style={{ fontSize: "28px" }}>{r === "parents" ? "👨‍👩‍👧" : "🧒"}</span>
            {r === "parents" ? "Parents" : "Child"}
          </button>
        ))}
      </div>

      {/* Form — layout_0GV9GR: col gap=24 */}
      <form onSubmit={handleLogin} className="flex flex-col gap-6">
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-lg text-sm font-nunito">
            {error}
          </div>
        )}

        {/* Fields — layout_5BJVYO: col gap=20 */}
        <div className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            {/* Text sm/Medium = Nunito 500 14px lh=20px Gray true/800 = #292929 */}
            <label className="font-nunito font-medium" style={{ fontSize: "14px", lineHeight: "20px", color: "#292929" }}>
              Email
            </label>
            {/* Input: border Gray/300 = #D6D6D6 1px, r=8, shadow-xs, padding 10px 14px */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="font-nunito font-normal focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300"
              style={{
                height: "44px",
                borderRadius: "8px",
                padding: "0 14px",
                fontSize: "16px",
                color: "#141414",
                border: "1px solid #D6D6D6",
                boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)",
              }}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="font-nunito font-medium" style={{ fontSize: "14px", lineHeight: "20px", color: "#292929" }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full font-nunito font-normal focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300"
                style={{
                  height: "44px",
                  borderRadius: "8px",
                  padding: "0 44px 0 14px",
                  fontSize: "16px",
                  color: "#141414",
                  border: "1px solid #D6D6D6",
                  boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Row — layout_M5LQ4G: row space-between, align center */}
        <div className="flex items-center justify-between">
          {/* Checkbox + "Remember for 30 days" — Text sm/Medium Nunito 500 14px Gray/800 */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded accent-rose-500"
              style={{ borderColor: "#D6D6D6" }}
            />
            <span className="font-nunito font-medium" style={{ fontSize: "14px", lineHeight: "20px", color: "#292929" }}>
              Remember for 30 days
            </span>
          </label>
          {/* "Forgot password" — Text sm/Bold = Nunito 700 14px Rosé/500 = #F63D68 */}
          <Link
            href="/forgot-password"
            className="font-nunito font-bold hover:opacity-75 transition-opacity"
            style={{ fontSize: "14px", lineHeight: "20px", color: "#F63D68" }}
          >
            Forgot password
          </Link>
        </div>

        {/* Actions — layout_YSTNRW: col gap=16 */}
        <div className="flex flex-col gap-4">
          {/* Sign in — Rosé/500 = #F63D68, Text md/Bold = Nunito 700 16px white, full w, padding 10px 16px, r=8 */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center font-nunito font-bold text-white hover:opacity-90 disabled:opacity-50 transition-opacity w-full"
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              background: "#F63D68",
              fontSize: "16px",
              lineHeight: "24px",
              boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)",
            }}
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Sign in"}
          </button>

          <div className="flex flex-col gap-3">
            {[
              { label: "Sign in with Google", icon: "G", bg: "#EA4335", provider: "google" as const },
              { label: "Sign in with Facebook", icon: "f", bg: "#1877F2", provider: null },
              { label: "Sign in with Apple", icon: "⌘", bg: "#000000", provider: null },
              { label: "Sign in with X", icon: "𝕏", bg: "#000000", provider: null },
            ].map(({ label, icon, bg, provider }) => (
              <button
                key={label}
                type="button"
                onClick={() => provider && handleSocialLogin(provider)}
                disabled={isLoading}
                className={`flex items-center justify-center gap-3 font-nunito font-semibold hover:bg-gray-50 transition-colors w-full ${!provider ? 'cursor-default' : ''}`}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: "#292929",
                  border: "1px solid #D0D5DD",
                  boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)",
                  opacity: isLoading || (!provider && isLoading) ? 0.5 : 1,
                }}
              >
                {/* Social icon 24×24 */}
                <span
                  className="flex items-center justify-center rounded shrink-0 text-white font-bold"
                  style={{ width: 24, height: 24, background: bg, fontSize: "14px", borderRadius: "4px" }}
                >
                  {icon}
                </span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Footer row — layout_RJTLCX: row justify center, gap=4, baseline */}
      <p className="font-nunito font-normal text-center" style={{ fontSize: "14px", lineHeight: "20px", color: "#292929" }}>
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-bold hover:opacity-75 transition-opacity"
          style={{ color: "#F63D68" }}
        >
          Sign up
        </Link>
      </p>
    </>
  );
}
