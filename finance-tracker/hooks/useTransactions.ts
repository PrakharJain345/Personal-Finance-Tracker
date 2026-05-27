"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";

export interface Transaction {
  id: string;
  user_id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string | null;
  date: string;
  created_at: string;
}

export type NewTransaction = Omit<Transaction, "id" | "user_id" | "created_at">;

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load transactions");
    } else {
      setTransactions(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const addTransaction = async (tx: NewTransaction) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimistic: Transaction = {
      ...tx,
      id: tempId,
      user_id: user.id,
      created_at: new Date().toISOString(),
    };
    setTransactions((prev) => [optimistic, ...prev]);

    const { data, error } = await supabase
      .from("transactions")
      .insert([{ ...tx, user_id: user.id }])
      .select()
      .single();

    if (error) {
      toast.error("Failed to add transaction");
      setTransactions((prev) => prev.filter((t) => t.id !== tempId));
    } else {
      setTransactions((prev) =>
        prev.map((t) => (t.id === tempId ? data : t))
      );
      toast.success("Transaction added!");
    }
  };

  const updateTransaction = async (id: string, updates: Partial<NewTransaction>) => {
    const original = transactions.find((t) => t.id === id);
    if (!original) return;

    // Optimistic update
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );

    const { data, error } = await supabase
      .from("transactions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      toast.error("Failed to update transaction");
      setTransactions((prev) => prev.map((t) => (t.id === id ? original : t)));
    } else {
      setTransactions((prev) => prev.map((t) => (t.id === id ? data : t)));
      toast.success("Transaction updated!");
    }
  };

  const deleteTransaction = async (id: string) => {
    const original = transactions.find((t) => t.id === id);
    if (!original) return;

    // Optimistic update
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    const { error } = await supabase.from("transactions").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete transaction");
      setTransactions((prev) => [...prev, original].sort((a, b) => b.date.localeCompare(a.date)));
    } else {
      toast.success("Transaction deleted!");
    }
  };

  return {
    transactions,
    loading,
    refetch: fetch,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
