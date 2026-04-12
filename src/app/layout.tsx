import type { Metadata } from "next";
import { Nunito, Inter, Poppins, Luckiest_Guy } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-poppins",
});

const luckiestGuy = Luckiest_Guy({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-luckiest-guy",
});

export const metadata: Metadata = {
  title: "Mel in a Box",
  description: "Educational platform for children",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${inter.variable} ${poppins.variable} ${luckiestGuy.variable} font-nunito antialiased bg-white`}
        style={{ color: "#141414" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
