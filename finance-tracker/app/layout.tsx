import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: "FinTrack — Personal Finance Tracker",
  description: "FinTrack helps you capture expenses instantly, visualize your cashflow, and hit your savings goals — free forever.",
  icons: {
    icon: [
      { url: "/fintrack-logo.svg", type: "image/svg+xml" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: "/logo.png",
    shortcut: "/fintrack-logo.svg",
  },
  openGraph: {
    title: "FinTrack — Personal Finance Tracker",
    description: "Never lose track of where your money goes. FinTrack makes budgeting effortless.",
    images: [{ url: "/logo.png" }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "FinTrack — Personal Finance Tracker",
    description: "Never lose track of where your money goes.",
    images: ["/logo.png"],
  },
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
