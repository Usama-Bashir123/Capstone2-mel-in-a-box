"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleResend = async () => {
    if (!searchParams.get("email")) return;

    setIsLoading(true);
    setMessage(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Reset email resent successfully!");
    } catch (err: unknown) {
      console.error(err);
      setMessage("Failed to resend. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center text-center">

      {/* Mail icon */}
      <div
        className="flex items-center justify-center"
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "20px",
          background: "#FFF4F6",
        }}
      >
        <span style={{ fontSize: "44px" }}>📬</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1
          className="font-nunito font-bold text-ink"
          style={{ fontSize: "30px", lineHeight: "38px" }}
        >
          Check your mail
        </h1>
        <p
          className="font-nunito font-normal"
          style={{ fontSize: "16px", lineHeight: "24px", color: "#525252", maxWidth: "340px" }}
        >
          An email has been sent to <span className="font-bold text-ink">{email}</span>. Please click on the included link to reset your password.
        </p>
      </div>

      {/* Resend */}
      <div className="flex flex-col gap-2">
        <p
          className="font-nunito font-normal"
          style={{ fontSize: "14px", lineHeight: "20px", color: "#282828" }}
        >
          Did not receive the email?{" "}
          <button
            onClick={handleResend}
            disabled={isLoading || !searchParams.get("email")}
            className="font-bold hover:opacity-75 transition-opacity disabled:opacity-50"
            style={{ color: "#F63D68" }}
          >
            {isLoading ? "Sending..." : "Click to resend"}
          </button>
        </p>

        {message && (
          <p className="font-nunito text-sm text-ink-subtle animate-in fade-in duration-300">
            {message}
          </p>
        )}
      </div>

      {/* Sign up prompt */}
      <p
        className="font-nunito font-normal"
        style={{ fontSize: "14px", lineHeight: "20px", color: "#282828" }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-bold hover:opacity-75 transition-opacity"
          style={{ color: "#F63D68" }}
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense>
      <CheckEmailContent />
    </Suspense>
  );
}
