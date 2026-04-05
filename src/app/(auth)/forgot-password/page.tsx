// Forgot Password Page — node 213:16227
// Title: "Forget Password" Nunito 700 30px rgb(20,20,20)
// Subtext: 16px 400 rgb(82,82,82)
// Email field
// "Send Email" button: #F63D68 r=8 h=48
// "Back to Login" link: #F63D68 700 14px

import Link from "next/link";

export default function ForgotPasswordPage() {
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
      <div className="flex flex-col gap-4">
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

        {/* Send Email button */}
        <Link
          href="/check-email"
          className="flex items-center justify-center font-nunito font-bold text-white hover:opacity-90 transition-opacity"
          style={{ height: "48px", borderRadius: "8px", background: "#F63D68", fontSize: "16px", lineHeight: "24px" }}
        >
          Send Email
        </Link>
      </div>

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
