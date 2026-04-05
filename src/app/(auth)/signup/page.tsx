"use client";

// Sign Up Page — node 213:16134
// Title: "Create your account" Nunito 700 30px rgb(20,20,20)
// Fields: Full Name, Email, Password, Confirm Password
// Checkbox: agree to Terms
// Sign Up button: #F63D68 r=8 h=48
// Social sign-in: Google, Facebook, Apple, X
// Footer: "Already have an account?" + "Sign In" link

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="flex flex-col gap-6">

      {/* Header — Display sm/Bold = Nunito 700 30px lh=38px CENTER, Gray true/900
          Text md/Regular = Nunito 400 16px lh=24px CENTER, Gray true/600 */}
      <div className="flex flex-col gap-2 text-center">
        <h1
          className="font-nunito font-bold"
          style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}
        >
          Create your account
        </h1>
        <p
          className="font-nunito font-normal"
          style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}
        >
          Please enter your details.
        </p>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label
            className="font-nunito font-medium"
            style={{ fontSize: "14px", lineHeight: "20px", color: "#282828" }}
          >
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="font-nunito font-normal border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300"
            style={{ height: "44px", borderRadius: "8px", padding: "0 14px", fontSize: "14px", color: "#141414" }}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label
            className="font-nunito font-medium"
            style={{ fontSize: "14px", lineHeight: "20px", color: "#282828" }}
          >
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="font-nunito font-normal border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300"
            style={{ height: "44px", borderRadius: "8px", padding: "0 14px", fontSize: "14px", color: "#141414" }}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label
            className="font-nunito font-medium"
            style={{ fontSize: "14px", lineHeight: "20px", color: "#282828" }}
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full font-nunito font-normal border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300"
              style={{ height: "44px", borderRadius: "8px", padding: "0 44px 0 14px", fontSize: "14px", color: "#141414" }}
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
          <label
            className="font-nunito font-medium"
            style={{ fontSize: "14px", lineHeight: "20px", color: "#282828" }}
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              className="w-full font-nunito font-normal border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300"
              style={{ height: "44px", borderRadius: "8px", padding: "0 44px 0 14px", fontSize: "14px", color: "#141414" }}
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
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded accent-rose-500"
          />
          <span
            className="font-nunito font-medium"
            style={{ fontSize: "14px", lineHeight: "20px", color: "#282828" }}
          >
            I agree to the{" "}
            <span style={{ color: "#F63D68" }}>Terms of Service</span>,{" "}
            <span style={{ color: "#F63D68" }}>Privacy Policy</span>, and{" "}
            <span style={{ color: "#F63D68" }}>Cookie Policy</span>
          </span>
        </label>

        {/* Sign Up button */}
        <button
          className="flex items-center justify-center font-nunito font-bold text-white hover:opacity-90 transition-opacity"
          style={{ height: "48px", borderRadius: "8px", background: "#F63D68", fontSize: "16px", lineHeight: "24px" }}
        >
          Sign Up
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="font-nunito font-normal" style={{ fontSize: "14px", color: "#9CA3AF" }}>or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Social sign-in */}
      <div className="flex flex-col gap-3">
        {[
          { label: "Sign in with Google", emoji: "🌐", color: "#282828" },
          { label: "Sign in with Facebook", emoji: "📘", color: "#344054" },
          { label: "Sign in with Apple", emoji: "🍎", color: "#344054" },
          { label: "Sign in with X", emoji: "𝕏", color: "#344054" },
        ].map(({ label, emoji, color }) => (
          <button
            key={label}
            className="flex items-center justify-center gap-3 font-nunito font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
            style={{ height: "44px", borderRadius: "8px", fontSize: "16px", lineHeight: "24px", color }}
          >
            <span>{emoji}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Footer */}
      <p className="font-nunito font-normal text-center" style={{ fontSize: "14px", lineHeight: "20px", color: "#282828" }}>
        Already have an account?{" "}
        <Link href="/login" className="font-bold hover:opacity-75 transition-opacity" style={{ color: "#F63D68" }}>
          Sign In
        </Link>
      </p>
    </div>
  );
}
