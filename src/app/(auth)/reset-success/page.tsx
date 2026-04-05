// Reset Successfully Page — node 213:16498
// Title: "Reset Successfully" Nunito 700 30px rgb(20,20,20)
// Subtext: "Your password has been reset successfully." 16px 400 rgb(82,82,82)
// "Return to Login" button: #F63D68 r=8 h=48

import Link from "next/link";

export default function ResetSuccessPage() {
  return (
    <div className="flex flex-col gap-6 items-center text-center">

      {/* Success icon */}
      <div
        className="flex items-center justify-center"
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "9999px",
          background: "#ECFDF2",
        }}
      >
        <span style={{ fontSize: "44px" }}>✅</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1
          className="font-nunito font-bold text-ink"
          style={{ fontSize: "30px", lineHeight: "38px" }}
        >
          Reset Successfully
        </h1>
        <p
          className="font-nunito font-normal"
          style={{ fontSize: "16px", lineHeight: "24px", color: "#525252" }}
        >
          Your password has been reset successfully.
        </p>
      </div>

      {/* Return to Login button */}
      <Link
        href="/login"
        className="flex items-center justify-center font-nunito font-bold text-white hover:opacity-90 transition-opacity w-full"
        style={{ height: "48px", borderRadius: "8px", background: "#F63D68", fontSize: "16px", lineHeight: "24px" }}
      >
        Return to Login
      </Link>
    </div>
  );
}
