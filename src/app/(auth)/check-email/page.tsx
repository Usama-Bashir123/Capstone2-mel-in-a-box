// Check your mail Page — node 213:16313
// Title: "Check your mail" Nunito 700 30px rgb(20,20,20)
// Subtext: 16px 400 rgb(82,82,82)
// "Did not receive the email?" + "Click to resend" link
// "Don't have an account?" + "Sign up" link

import Link from "next/link";

export default function CheckEmailPage() {
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
          An email has been sent to example@company.com please click on the included link to reset your password.
        </p>
      </div>

      {/* Resend */}
      <p
        className="font-nunito font-normal"
        style={{ fontSize: "14px", lineHeight: "20px", color: "#282828" }}
      >
        Did not receive the email?{" "}
        <button
          className="font-bold hover:opacity-75 transition-opacity"
          style={{ color: "#F63D68" }}
        >
          Click to resend
        </button>
      </p>

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
