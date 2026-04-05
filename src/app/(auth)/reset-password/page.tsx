"use client";

// Reset Password Page — node 213:16398
// Title: "Reset Password" Nunito 700 30px rgb(20,20,20)
// Fields: Password, Confirm Password
// "Reset Password" button: #F63D68 r=8 h=48

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1
          className="font-nunito font-bold text-ink"
          style={{ fontSize: "30px", lineHeight: "38px" }}
        >
          Reset Password
        </h1>
        <p
          className="font-nunito font-normal"
          style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}
        >
          Please set a new password of your account.
        </p>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-4">
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

        {/* Reset Password button */}
        <Link
          href="/reset-success"
          className="flex items-center justify-center font-nunito font-bold text-white hover:opacity-90 transition-opacity"
          style={{ height: "48px", borderRadius: "8px", background: "#F63D68", fontSize: "16px", lineHeight: "24px" }}
        >
          Reset Password
        </Link>
      </div>
    </div>
  );
}
