"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, X } from "lucide-react";

const ALL_CATEGORIES = [
  "All Categories",
  "Salary", "Freelance", "Investment", "Gift",
  "Food & Dining", "Transport", "Shopping", "Health & Medical",
  "Entertainment", "Rent", "Utilities", "Education", "Other",
];

interface FilterBarProps {
  onFilterChange: (filters: {
    search: string;
    type: "all" | "income" | "expense";
    category: string;
    from: string;
    to: string;
  }) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [type, setType] = useState<"all" | "income" | "expense">("all");
  const [category, setCategory] = useState("All Categories");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // 300ms debounce on search
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    onFilterChange({ search: debouncedSearch, type, category, from, to });
  }, [debouncedSearch, type, category, from, to]);

  const clearAll = () => {
    setSearch("");
    setDebouncedSearch("");
    setType("all");
    setCategory("All Categories");
    setFrom("");
    setTo("");
  };

  const hasActiveFilters = search || type !== "all" || category !== "All Categories" || from || to;

  const selectClass =
    "bg-[#111827] border border-[#1F2A3D] text-[#F9FAFB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#4C6EF5] transition-colors";

  return (
    <div className="bg-[#111827] border border-[#1F2A3D] rounded-2xl p-4 mb-4 space-y-3">
      {/* Row 1: Search + Type + Clear */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
          <Input
            id="filter-search"
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full py-2.5 text-sm"
          />
        </div>

        {/* Type pills */}
        <div className="flex bg-[#0A0D14] rounded-xl p-1 border border-[#1F2A3D] gap-1">
          {(["all", "income", "expense"] as const).map((t) => (
            <button
              key={t}
              id={`filter-type-${t}`}
              onClick={() => setType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200 ${
                type === t
                  ? "bg-[#4C6EF5] text-white"
                  : "text-[#9CA3AF] hover:text-[#F9FAFB]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            id="filter-clear"
            onClick={clearAll}
            className="flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-[#EF4444] transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Clear All
          </button>
        )}
      </div>

      {/* Row 2: Category + Date range */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          id="filter-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={selectClass}
        >
          {ALL_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <Input
            id="filter-from"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="py-2.5 text-sm"
            placeholder="From"
          />
          <span className="text-[#4B5563] text-sm">→</span>
          <Input
            id="filter-to"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="py-2.5 text-sm"
            placeholder="To"
          />
        </div>
      </div>
    </div>
  );
}
