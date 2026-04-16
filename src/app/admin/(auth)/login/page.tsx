"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  // Show error if redirected from layout due to unauthorized email
  useEffect(() => {
    if (searchParams.get("error") === "unauthorized") {
      setError("This account is not authorized to access the admin dashboard.");
    }
  }, [searchParams]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/stories");
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (err.code === "auth/user-not-found") {
        setError("Account not found.");
      } else {
        setError("Failed to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    
    try {
      await signInWithPopup(auth, provider);
      router.push("/admin/stories");
    } catch (err: any) {
      console.error("Google login error:", err);
      setError("Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2 text-center">
        <h1
          className="font-nunito font-bold text-[#141414]"
          style={{ fontSize: "30px", lineHeight: "38px" }}
        >
          Log in to your account
        </h1>
        <p className="font-nunito text-[#525252]" style={{ fontSize: "16px", lineHeight: "24px" }}>
          Welcome back! Please enter your details.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-3 text-sm font-medium text-red-600 bg-red-50 rounded-lg border border-red-100">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleEmailLogin} className="flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="font-nunito font-medium text-[#292929]" style={{ fontSize: "14px", lineHeight: "20px" }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="font-nunito focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all"
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
            <label className="font-nunito font-medium text-[#292929]" style={{ fontSize: "14px", lineHeight: "20px" }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full font-nunito focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all"
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

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded accent-rose-500 cursor-pointer"
            />
            <span className="font-nunito font-medium text-[#292929]" style={{ fontSize: "14px", lineHeight: "20px" }}>
              Remember for 30 days
            </span>
          </label>
          <Link
            href="/admin/forgot-password"
            className="font-nunito font-bold hover:text-[#F63D68]/80 transition-colors"
            style={{ fontSize: "14px", lineHeight: "20px", color: "#F63D68" }}
          >
            Forgot password
          </Link>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center font-nunito font-bold text-white hover:bg-[#F63D68]/90 disabled:opacity-50 transition-all w-full h-[44px]"
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              background: "#F63D68",
              fontSize: "16px",
              lineHeight: "24px",
              boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)",
            }}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in"}
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-3 font-nunito font-semibold hover:bg-gray-50 disabled:opacity-50 transition-all w-full h-[44px]"
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              fontSize: "16px",
              lineHeight: "24px",
              color: "#292929",
              border: "1px solid #D0D5DD",
              boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </button>
        </div>
      </form>

      {/* Footer */}
      <p className="font-nunito text-center text-[#292929]" style={{ fontSize: "14px", lineHeight: "20px" }}>
        Don&apos;t have an account?{" "}
        <Link
          href="/admin/signup"
          className="font-bold text-[#F63D68] hover:text-[#F63D68]/80 transition-colors"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
