"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Topbar from "@/components/layout/Topbar";
import BalanceCard from "@/components/dashboard/BalanceCard";
import SummaryCards from "@/components/dashboard/SummaryCards";
import CashflowChart from "@/components/dashboard/CashflowChart";
import CategoryChart from "@/components/dashboard/CategoryChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import TransactionModal from "@/components/transactions/TransactionModal";
import { useTransactions } from "@/hooks/useTransactions";
import { createClient } from "@/utils/supabase/client";
import { Plus } from "lucide-react";

function getMonthlyStats(transactions: ReturnType<typeof useTransactions>["transactions"]) {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthKey = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, "0")}`;

  const currentTxs = transactions.filter((t) => t.date.startsWith(currentMonth));
  const lastMonthTxs = transactions.filter((t) => t.date.startsWith(lastMonthKey));

  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
  const currentIncome = currentTxs.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const currentExpense = currentTxs.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
  const lastBalance =
    lastMonthTxs.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0) -
    lastMonthTxs.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);

  return {
    income,
    expense,
    balance: income - expense,
    currentCount: currentTxs.length,
    lastMonthBalance: lastBalance,
  };
}

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<any>(null);
  const [email, setEmail] = useState("");
  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const stats = getMonthlyStats(transactions);

  const openEdit = (t: any) => {
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

  return (
    <AppLayout email={email}>
      <Topbar title="Dashboard" onAddTransaction={() => setModalOpen(true)} />

      <div className="p-4 md:p-6 space-y-5">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-[#4C6EF5]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : (
          <>
            {/* Hero Balance */}
            <BalanceCard
              balance={stats.balance}
              income={stats.income}
              expense={stats.expense}
              lastMonthBalance={stats.lastMonthBalance}
            />

            {/* Summary Cards */}
            <SummaryCards
              income={stats.income}
              expense={stats.expense}
              count={stats.currentCount}
            />

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              <div className="lg:col-span-3">
                <CashflowChart transactions={transactions} />
              </div>
              <div className="lg:col-span-2">
                <CategoryChart transactions={transactions} />
              </div>
            </div>

            {/* Recent Transactions */}
            <RecentTransactions
              transactions={transactions}
              onEdit={openEdit}
              onDelete={deleteTransaction}
            />
          </>
        )}
      </div>

      {/* Floating Action Button (mobile) */}
      <button
        id="fab-add-transaction"
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
