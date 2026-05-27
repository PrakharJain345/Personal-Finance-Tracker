"use client";

import { Bell, Plus } from "lucide-react";

interface TopbarProps {
  title: string;
  onAddTransaction?: () => void;
}

export default function Topbar({ title, onAddTransaction }: TopbarProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[#1F2A3D] bg-[#0A0D14] sticky top-0 z-30">
      <h1 className="text-xl font-semibold text-[#F9FAFB]">{title}</h1>
      <div className="flex items-center gap-3">
        {onAddTransaction && (
          <button
            id="add-transaction-btn"
            onClick={onAddTransaction}
            className="flex items-center gap-2 bg-[#4C6EF5] hover:bg-[#6B8AF7] text-white rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-[1px] hover:shadow-lg hover:shadow-[#4C6EF530]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Transaction</span>
          </button>
        )}
      </div>
    </header>
  );
}
