import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Plus Jakarta Sans — the warm geometric sans food-delivery brands favour.
// One family, many weights: display weights carry headings, regular carries body.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
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
    // Font variables belong on <html>: the @theme tokens that reference them
    // (--font-sans, --font-body, --font-heading) are declared on :root.
    <html
      lang="en"
      className={jakarta.variable}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
