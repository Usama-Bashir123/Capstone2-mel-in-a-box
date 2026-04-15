"use client";

import Link from "next/link";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      // Redirect to check-email with the email in query params for better UX
      router.push(`/check-email?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Header — Display sm/Bold CENTER, Text md/Regular CENTER (Figma textAlignHorizontal=CENTER) */}
      <div className="flex flex-col gap-2 text-center">
        <h1
          className="font-nunito font-bold"
          style={{ fontSize: "30px", lineHeight: "38px", color: "#141414" }}
        >
          Forget Password
        </h1>
        <p
          className="font-nunito font-normal"
          style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}
        >
          Enter your email and check inbox for password reset link.
        </p>
      </div>


      {/* Form */}
      <form onSubmit={handleReset} className="flex flex-col gap-4">
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-lg text-sm font-nunito">
            {error}
          </div>
        )}
        
        <div className="flex flex-col gap-1.5">
          <label
            className="font-nunito font-medium"
            style={{ fontSize: "14px", lineHeight: "20px", color: "#282828" }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="font-nunito font-normal border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300"
            style={{ height: "44px", borderRadius: "8px", padding: "0 14px", fontSize: "14px", color: "#141414" }}
          />
        </div>

        {/* Send Email button */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center font-nunito font-bold text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
          style={{ height: "48px", borderRadius: "8px", background: "#F63D68", fontSize: "16px", lineHeight: "24px" }}
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Send Email"}
        </button>
      </form>

      {/* Back to login */}
      <p className="font-nunito text-center" style={{ fontSize: "14px", lineHeight: "20px" }}>
        <Link
          href="/login"
          className="font-bold hover:opacity-75 transition-opacity"
          style={{ color: "#F63D68" }}
        >
          ← Back to Login
        </Link>
      </p>
    </div>
  );
}
