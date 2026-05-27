"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Transaction } from "@/hooks/useTransactions";
import { formatCurrency, formatDate, categoryConfig } from "@/lib/utils";
import { ArrowRight, Pencil, Trash2, Check, X, Folder } from "lucide-react";

interface RecentTransactionsProps {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

type Filter = "all" | "income" | "expense";

export default function RecentTransactions({ transactions, onEdit, onDelete }: RecentTransactionsProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const recent = transactions
    .filter((t) => filter === "all" || t.type === filter)
    .slice(0, 5);

  return (
    <Card className="animate-enter delay-4" style={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[#F9FAFB] font-semibold text-base">Recent Transactions</h3>
        <div className="flex items-center gap-2">
          {/* Filter pills */}
          <div className="flex bg-[#0A0D14] rounded-xl p-1 gap-1 border border-[#1F2A3D]">
            {(["all", "income", "expense"] as Filter[]).map((f) => (
              <button
                key={f}
                id={`recent-filter-${f}`}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all duration-200 ${
                  filter === f
                    ? "bg-[#4C6EF5] text-white"
                    : "text-[#9CA3AF] hover:text-[#F9FAFB]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <Link
            href="/transactions"
            className="text-[#4C6EF5] hover:text-[#6B8AF7] text-xs font-medium flex items-center gap-1 transition-colors"
          >
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {recent.length === 0 ? (
        <div className="text-center py-10 text-[#4B5563] text-sm">
          No transactions found
        </div>
      ) : (
        <div className="space-y-2">
          {recent.map((t) => {
            const cfg = categoryConfig[t.category] ?? { color: "#9CA3AF", icon: Folder };
            const Icon = cfg.icon;
            const isConfirming = confirmingId === t.id;
            const isDeleting = deletingId === t.id;

            if (isConfirming) {
              return (
                <div
                  key={t.id}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[#EF444415] border border-[#EF444430] transition-all duration-200"
                >
                  <div className="flex-1 text-sm text-[#EF4444] font-medium truncate">
                    Delete &ldquo;{t.description || t.category}&rdquo;?
                  </div>
                  <button
                    onClick={async () => {
                      setDeletingId(t.id);
                      await onDelete(t.id);
                      setDeletingId(null);
                      setConfirmingId(null);
                    }}
                    disabled={isDeleting}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EF4444] text-white rounded-lg text-xs font-medium hover:bg-[#DC2626] transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    {isDeleting ? "Deleting..." : "Confirm"}
                  </button>
                  <button
                    onClick={() => setConfirmingId(null)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A2235] text-[#9CA3AF] rounded-lg text-xs font-medium hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    Cancel
                  </button>
                </div>
              );
            }

            return (
              <div
                key={t.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#1A2235] transition-colors duration-150"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${cfg.color}20` }}
                >
                  <Icon className="w-4.5 h-4.5" style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#F9FAFB] truncate">
                      {t.description || t.category}
                    </span>
                    <Badge color={cfg.color} variant="subtle" className="text-[10px] px-2 py-0.5 hidden sm:inline-flex">
                      {t.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#4B5563] mt-0.5">{formatDate(t.date)}</p>
                </div>
                <span
                  className="text-sm font-bold tabular-nums flex-shrink-0 mr-2"
                  style={{ color: t.type === "income" ? "#10B981" : "#EF4444" }}
                >
                  {t.type === "income" ? "+" : "-"}{formatCurrency(Number(t.amount))}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => onEdit(t)}
                    className="p-2 rounded-xl text-[#9CA3AF] hover:text-[#4C6EF5] hover:bg-[#4C6EF515] border border-[#1F2A3D] hover:border-[#4C6EF5]/40 transition-all duration-200 cursor-pointer"
                    title="Edit Transaction"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setConfirmingId(t.id)}
                    className="p-2 rounded-xl text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#EF444415] border border-[#1F2A3D] hover:border-[#EF4444]/40 transition-all duration-200 cursor-pointer"
                    title="Delete Transaction"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
