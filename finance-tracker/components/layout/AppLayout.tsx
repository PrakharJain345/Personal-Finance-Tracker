"use client";

import Sidebar from "./Sidebar";
import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
  email?: string;
}

export default function AppLayout({ children, email }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0A0D14]">
      <Sidebar email={email} />
      {/* Main content with left margin for sidebar */}
      <main className="md:ml-16 lg:ml-60 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
