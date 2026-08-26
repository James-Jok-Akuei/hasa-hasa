import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HASA HASA — Restaurant Dashboard",
  description: "HASA HASA — business dashboard for restaurant operations",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={jost.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
