import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand — Rose
        rose: {
          25: "#FFF5F6",
          50: "#FFF1F3",
          100: "#FFE4E8",
          200: "#FECDD6",
          300: "#FEA3B4",
          400: "#FD6F8E",
          500: "#F63D68",
          600: "#E31B54",
          700: "#C01048",
          800: "#A11043",
          900: "#89123E",
          950: "#510B24",
        },
        // Neutral — Gray (overrides Tailwind's default gray)
        gray: {
          25: "#FCFCFC",
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D6D6D6",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#424242",
          800: "#292929",
          900: "#141414",
          950: "#0F0F0F",
        },
        // Success
        success: {
          25: "#F3FAF6",
          500: "#15A654",
          600: "#108443",
          700: "#0C6332",
          950: "#03160B",
        },
        // Error
        error: {
          25: "#FFFBFA",
          400: "#F97066",
          500: "#F04438",
          600: "#D92D20",
          700: "#B42318",
          950: "#55160C",
        },
        // Warning
        warning: {
          25: "#FFFCF5",
          400: "#FDB022",
          500: "#F79009",
          600: "#DC6803",
          950: "#4E1D09",
        },
        // Utility — exact Figma text colors
        ink: {
          DEFAULT: "#141414", // rgb(20,20,20)   — primary text
          secondary: "#282828", // rgb(40,40,40)  — section titles
          subtle: "#525252",   // rgb(82,82,82)   — muted text
          muted: "#424242",    // rgb(66,66,66)   — stats/numbers
          label: "#475467",    // rgb(71,84,103)  — card supporting text
          badge: "#344054",    // rgb(52,64,84)   — badge text
        },
        // Tick / success green
        tick: "#17B169",       // rgb(23,177,105)
      },
      fontFamily: {
        nunito: ["var(--font-nunito)", "Nunito", "sans-serif"],
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      fontSize: {
        // Display scale
        "display-2xl": ["72px", { lineHeight: "90px", letterSpacing: "-1.44px" }],
        "display-xl": ["60px", { lineHeight: "72px", letterSpacing: "-1.2px" }],
        "display-lg": ["48px", { lineHeight: "60px", letterSpacing: "-0.96px" }],
        "display-md": ["36px", { lineHeight: "44px", letterSpacing: "-0.72px" }],
        "display-sm": ["30px", { lineHeight: "38px" }],
        "display-xs": ["24px", { lineHeight: "32px" }],
        // Text/paragraph scale
        "text-xl": ["20px", { lineHeight: "30px" }],
        "text-lg": ["18px", { lineHeight: "28px" }],
        "text-md": ["16px", { lineHeight: "24px" }],
        "text-sm": ["14px", { lineHeight: "20px" }],
        "text-xs": ["12px", { lineHeight: "18px" }],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
