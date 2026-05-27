"use client";

export const dynamic = "force-dynamic";

import { useMemo, useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Topbar from "@/components/layout/Topbar";
import FilterBar from "@/components/transactions/FilterBar";
import TransactionRow from "@/components/transactions/TransactionRow";
import TransactionModal from "@/components/transactions/TransactionModal";
import { useTransactions, Transaction } from "@/hooks/useTransactions";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/utils/supabase/client";
import { Plus } from "lucide-react";

export default function TransactionsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [email, setEmail] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    type: "all" as "all" | "income" | "expense",
    category: "All Categories",
    from: "",
    to: "",
  });

  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions();

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
      }
    }
    fetchUser();
  }, []);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        !filters.search ||
        t.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.category.toLowerCase().includes(filters.search.toLowerCase());
      const matchType = filters.type === "all" || t.type === filters.type;
      const matchCategory =
        filters.category === "All Categories" || t.category === filters.category;
      const matchFrom = !filters.from || t.date >= filters.from;
      const matchTo = !filters.to || t.date <= filters.to;
      return matchSearch && matchType && matchCategory && matchFrom && matchTo;
    });
  }, [transactions, filters]);

  const openEdit = (t: Transaction) => {
    setEditTransaction(t);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTransaction(null);
  };

  const handleSubmit = (tx: any) => {
    if (editTransaction) {
      updateTransaction(editTransaction.id, tx);
    } else {
      addTransaction(tx);
    }
    closeModal();
  };

  return (
    <AppLayout email={email}>
      <Topbar title="Transactions" onAddTransaction={() => setModalOpen(true)} />

      <div className="p-4 md:p-6">
        <FilterBar onFilterChange={setFilters} />

        <Card>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <svg className="animate-spin h-7 w-7 text-[#4C6EF5]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-[#F9FAFB] font-medium">No transactions found</p>
              <p className="text-[#4B5563] text-sm mt-1">Try adjusting your filters or add a new transaction</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-[#9CA3AF]">
                  Showing <span className="text-[#F9FAFB] font-medium">{filtered.length}</span> transaction{filtered.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="space-y-1">
                {filtered.map((t) => (
                  <TransactionRow
                    key={t.id}
                    transaction={t}
                    onEdit={openEdit}
                    onDelete={deleteTransaction}
                  />
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Mobile FAB */}
      <button
        id="fab-add-tx"
        onClick={() => setModalOpen(true)}
        className="fixed bottom-20 right-5 md:hidden w-14 h-14 bg-[#4C6EF5] hover:bg-[#6B8AF7] text-white rounded-full shadow-lg shadow-[#4C6EF540] flex items-center justify-center transition-all duration-200 hover:scale-110 z-30"
      >
        <Plus className="w-6 h-6" />
      </button>

      <TransactionModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editTransaction={editTransaction}
      />
    </AppLayout>
  );
}
