"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Transaction, NewTransaction } from "@/hooks/useTransactions";

const INCOME_CATEGORIES = ["Salary", "Freelance", "Investment", "Gift", "Other"];
const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Health & Medical",
  "Entertainment",
  "Rent",
  "Utilities",
  "Education",
  "Other",
];

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tx: NewTransaction) => void;
  editTransaction?: Transaction | null;
}

export default function TransactionModal({
  isOpen,
  onClose,
  onSubmit,
  editTransaction,
}: TransactionModalProps) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setAmount(editTransaction.amount.toString());
      setCategory(editTransaction.category);
      setDescription(editTransaction.description ?? "");
      setDate(editTransaction.date);
    } else {
      setType("expense");
      setAmount("");
      setCategory("");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [editTransaction, isOpen]);

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !date) return;

    onSubmit({
      type,
      amount: parseFloat(amount),
      category,
      description: description || null,
      date,
    });
    onClose();
  };

  const selectClass =
    "bg-[#111827] border border-[#1F2A3D] text-[#F9FAFB] rounded-xl px-4 py-3 focus:outline-none focus:border-[#4C6EF5] transition-colors w-full";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editTransaction ? "Edit Transaction" : "Add Transaction"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="flex bg-[#0A0D14] rounded-xl p-1 border border-[#1F2A3D]">
          {(["income", "expense"] as const).map((t) => (
            <button
              key={t}
              type="button"
              id={`tx-type-${t}`}
              onClick={() => { setType(t); setCategory(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                type === t
                  ? t === "income"
                    ? "bg-[#10B981] text-white shadow"
                    : "bg-[#EF4444] text-white shadow"
                  : "text-[#9CA3AF] hover:text-[#F9FAFB]"
              }`}
            >
              {t === "income" ? "Income" : "Expense"}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Amount</label>
          <Input
            id="tx-amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Category</label>
          <select
            id="tx-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={selectClass}
            required
          >
            <option value="">Select category...</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">
            Description <span className="text-[#4B5563] font-normal">(optional)</span>
          </label>
          <Input
            id="tx-description"
            type="text"
            placeholder="What was this for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-[#9CA3AF] mb-1.5">Date</label>
          <Input
            id="tx-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full"
            required
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            {editTransaction ? "Save Changes" : "Add Transaction"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
