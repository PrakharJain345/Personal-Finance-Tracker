"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Transaction, NewTransaction } from "@/hooks/useTransactions";
import { formatCurrency, formatDate, categoryConfig } from "@/lib/utils";
import { Pencil, Trash2, Check, X, Folder } from "lucide-react";

interface TransactionRowProps {
  transaction: Transaction;
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function TransactionRow({ transaction: t, onEdit, onDelete }: TransactionRowProps) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const cfg = categoryConfig[t.category] ?? { color: "#9CA3AF", icon: Folder };
  const Icon = cfg.icon;

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(t.id);
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[#EF444415] border border-[#EF444430] transition-all duration-200">
        <div className="flex-1 text-sm text-[#EF4444] font-medium">
          Delete &ldquo;{t.description || t.category}&rdquo;?
        </div>
        <button
          id={`confirm-delete-${t.id}`}
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EF4444] text-white rounded-lg text-xs font-medium hover:bg-[#DC2626] transition-colors disabled:opacity-50"
        >
          <Check className="w-3 h-3" />
          {deleting ? "Deleting..." : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A2235] text-[#9CA3AF] rounded-lg text-xs font-medium hover:text-white transition-colors"
        >
          <X className="w-3 h-3" />
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#1A2235] transition-colors duration-150">
      {/* Icon */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${cfg.color}20` }}
      >
        <Icon className="w-4.5 h-4.5" style={{ color: cfg.color }} />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#F9FAFB] truncate">
            {t.description || t.category}
          </span>
          <Badge color={cfg.color} variant="subtle" className="text-[10px] px-2 py-0.5 hidden sm:inline-flex flex-shrink-0">
            {t.category}
          </Badge>
        </div>
        <p className="text-xs text-[#4B5563] mt-0.5">{formatDate(t.date)}</p>
      </div>

      {/* Amount */}
      <span
        className="text-sm font-bold tabular-nums flex-shrink-0"
        style={{ color: t.type === "income" ? "#10B981" : "#EF4444" }}
      >
        {t.type === "income" ? "+" : "-"}{formatCurrency(Number(t.amount))}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
        <button
          id={`edit-tx-${t.id}`}
          onClick={() => onEdit(t)}
          className="p-2 rounded-xl text-[#9CA3AF] hover:text-[#4C6EF5] hover:bg-[#4C6EF515] border border-[#1F2A3D] hover:border-[#4C6EF5]/40 transition-all duration-200 cursor-pointer"
          title="Edit Transaction"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          id={`delete-tx-${t.id}`}
          onClick={() => setConfirming(true)}
          className="p-2 rounded-xl text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#EF444415] border border-[#1F2A3D] hover:border-[#EF4444]/40 transition-all duration-200 cursor-pointer"
          title="Delete Transaction"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
