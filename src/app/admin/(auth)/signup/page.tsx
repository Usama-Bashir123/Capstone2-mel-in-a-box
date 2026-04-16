"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function AdminSignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("You must agree to the Terms and Conditions.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile display name
      await updateProfile(user, { displayName: name });

      // Create a Firestore document for the admin
      // Note: This won't automatically grant access if the layout checks for hardcoded emails,
      // but it's good for the 'users' collection.
      await setDoc(doc(db, "users", user.uid), {
        displayName: name,
        email: email,
        role: "Admin",
        status: "Active",
        createdAt: serverTimestamp(),
      });

      router.push("/admin/login");
    } catch (err: any) {
      console.error("Signup error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already in use.");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2 text-center">
        <h1
          className="font-nunito font-bold text-[#141414]"
          style={{ fontSize: "30px", lineHeight: "38px" }}
        >
          Create your account
        </h1>
        <p className="font-nunito text-[#525252]" style={{ fontSize: "16px", lineHeight: "24px" }}>
          Please enter your details.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-3 text-sm font-medium text-red-600 bg-red-50 rounded-lg border border-red-100">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label className="font-nunito font-medium text-[#292929]" style={{ fontSize: "14px", lineHeight: "20px" }}>
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
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

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <label className="font-nunito font-medium text-[#292929]" style={{ fontSize: "14px", lineHeight: "20px" }}>
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirm(e.target.value)}
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
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Terms checkbox */}
        <label className="flex items-start gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded accent-rose-500 cursor-pointer"
          />
          <span className="font-nunito font-medium text-[#292929]" style={{ fontSize: "14px", lineHeight: "20px" }}>
            I agree to the{" "}
            <span className="text-[#F63D68] hover:underline cursor-pointer">Terms of Service</span>,{" "}
            <span className="text-[#F63D68] hover:underline cursor-pointer">Privacy Policy</span>, and{" "}
            <span className="text-[#F63D68] hover:underline cursor-pointer">Cookie Policy</span>
          </span>
        </label>

        {/* Sign Up button */}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center font-nunito font-bold text-white hover:bg-[#F63D68]/90 disabled:opacity-50 transition-all w-full h-[48px]"
          style={{
            borderRadius: "8px",
            background: "#F63D68",
            fontSize: "16px",
            lineHeight: "24px",
            boxShadow: "0px 1px 2px 0px rgba(16,24,40,0.05)",
          }}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
        </button>
      </form>

      {/* Footer */}
      <p className="font-nunito text-center text-[#292929]" style={{ fontSize: "14px", lineHeight: "20px" }}>
        Already have an account?{" "}
        <Link
          href="/admin/login"
          className="font-bold text-[#F63D68] hover:text-[#F63D68]/80 transition-colors"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
