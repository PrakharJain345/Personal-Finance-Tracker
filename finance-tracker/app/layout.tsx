import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: "Personal Finance Tracker",
  description: "Track your income and expenses easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${caveat.variable} antialiased bg-[var(--color-bg-base)] text-[var(--color-text-main)]`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
