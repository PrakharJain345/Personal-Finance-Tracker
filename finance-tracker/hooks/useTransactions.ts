"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { getLocalSession } from "@/utils/auth";
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

const STORAGE_KEY = "fintrack_local_transactions";

function getInitialMockTransactions(): Transaction[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const fmtDate = (y: number, m: number, d: number) => {
    // Handle month rollunder/rollover correctly
    const target = new Date(y, m, d);
    const yyyy = target.getFullYear();
    const mm = String(target.getMonth() + 1).padStart(2, "0");
    const dd = String(target.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  return [
    {
      id: "seed-1",
      user_id: "demo-user",
      type: "income",
      amount: 4500,
      category: "Salary",
      description: "Monthly Tech Corp Salary",
      date: fmtDate(year, month, 1),
      created_at: new Date(year, month, 1, 9, 0).toISOString(),
    },
    {
      id: "seed-2",
      user_id: "demo-user",
      type: "expense",
      amount: 1400,
      category: "Rent",
      description: "Downtown Apartment Rent",
      date: fmtDate(year, month, 2),
      created_at: new Date(year, month, 2, 10, 0).toISOString(),
    },
    {
      id: "seed-3",
      user_id: "demo-user",
      type: "income",
      amount: 950,
      category: "Freelance",
      description: "UI/UX Client Project",
      date: fmtDate(year, month, 5),
      created_at: new Date(year, month, 5, 14, 30).toISOString(),
    },
    {
      id: "seed-4",
      user_id: "demo-user",
      type: "expense",
      amount: 215.5,
      category: "Food & Dining",
      description: "Weekly Whole Foods Grocery",
      date: fmtDate(year, month, 7),
      created_at: new Date(year, month, 7, 18, 15).toISOString(),
    },
    {
      id: "seed-5",
      user_id: "demo-user",
      type: "expense",
      amount: 140,
      category: "Utilities",
      description: "Fiber Internet & Power",
      date: fmtDate(year, month, 10),
      created_at: new Date(year, month, 10, 11, 0).toISOString(),
    },
    {
      id: "seed-6",
      user_id: "demo-user",
      type: "expense",
      amount: 160,
      category: "Shopping",
      description: "Mechanical Keyboard & Desk Mat",
      date: fmtDate(year, month, 12),
      created_at: new Date(year, month, 12, 16, 45).toISOString(),
    },
    {
      id: "seed-7",
      user_id: "demo-user",
      type: "expense",
      amount: 85,
      category: "Food & Dining",
      description: "Dinner & Artisanal Coffee",
      date: fmtDate(year, month, 15),
      created_at: new Date(year, month, 15, 20, 0).toISOString(),
    },
    {
      id: "seed-8",
      user_id: "demo-user",
      type: "income",
      amount: 120,
      category: "Investment",
      description: "Q3 Index Fund Dividend",
      date: fmtDate(year, month, 18),
      created_at: new Date(year, month, 18, 12, 0).toISOString(),
    },
    {
      id: "seed-9",
      user_id: "demo-user",
      type: "expense",
      amount: 45,
      category: "Entertainment",
      description: "Cinema & Streaming Subscriptions",
      date: fmtDate(year, month, 20),
      created_at: new Date(year, month, 20, 21, 30).toISOString(),
    },
    {
      id: "seed-10",
      user_id: "demo-user",
      type: "expense",
      amount: 75,
      category: "Health & Medical",
      description: "Monthly Gym Membership & Protein",
      date: fmtDate(year, month, 22),
      created_at: new Date(year, month, 22, 8, 30).toISOString(),
    },
    // Historical entries for the 6-month cashflow chart
    {
      id: "seed-prev-1",
      user_id: "demo-user",
      type: "income",
      amount: 4500,
      category: "Salary",
      description: "Previous Month Salary",
      date: fmtDate(year, month - 1, 1),
      created_at: new Date(year, month - 1, 1, 9, 0).toISOString(),
    },
    {
      id: "seed-prev-2",
      user_id: "demo-user",
      type: "expense",
      amount: 1400,
      category: "Rent",
      description: "Previous Month Rent",
      date: fmtDate(year, month - 1, 2),
      created_at: new Date(year, month - 1, 2, 10, 0).toISOString(),
    },
    {
      id: "seed-prev-3",
      user_id: "demo-user",
      type: "expense",
      amount: 680,
      category: "Shopping",
      description: "Quarterly Wardrobe Refresh",
      date: fmtDate(year, month - 1, 14),
      created_at: new Date(year, month - 1, 14, 15, 0).toISOString(),
    },
    {
      id: "seed-prev-4",
      user_id: "demo-user",
      type: "income",
      amount: 4200,
      category: "Salary",
      description: "Previous Month Salary",
      date: fmtDate(year, month - 2, 1),
      created_at: new Date(year, month - 2, 1, 9, 0).toISOString(),
    },
    {
      id: "seed-prev-5",
      user_id: "demo-user",
      type: "expense",
      amount: 1850,
      category: "Rent",
      description: "Rent & Bills",
      date: fmtDate(year, month - 2, 5),
      created_at: new Date(year, month - 2, 5, 9, 0).toISOString(),
    },
    {
      id: "seed-prev-6",
      user_id: "demo-user",
      type: "income",
      amount: 4100,
      category: "Salary",
      description: "Salary",
      date: fmtDate(year, month - 3, 1),
      created_at: new Date(year, month - 3, 1, 9, 0).toISOString(),
    },
    {
      id: "seed-prev-7",
      user_id: "demo-user",
      type: "expense",
      amount: 1650,
      category: "Rent",
      description: "Rent & Utilities",
      date: fmtDate(year, month - 3, 5),
      created_at: new Date(year, month - 3, 5, 9, 0).toISOString(),
    },
  ];
}

function getStorageKey(email?: string): string {
  if (!email || email === "demo@fintrack.com") return "fintrack_local_transactions_demo";
  const safe = email.toLowerCase().replace(/[^a-z0-9_]/g, "_");
  return `fintrack_local_transactions_${safe}`;
}

function loadLocalTransactions(email?: string): Transaction[] {
  if (typeof window === "undefined") return [];
  const key = getStorageKey(email);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      const initial = getInitialMockTransactions();
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = getInitialMockTransactions();
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return parsed;
  } catch {
    return getInitialMockTransactions();
  }
}

function saveLocalTransactions(email: string | undefined, txs: Transaction[]) {
  if (typeof window === "undefined") return;
  const key = getStorageKey(email);
  try {
    localStorage.setItem(key, JSON.stringify(txs));
  } catch (e) {
    console.error("Failed to save to localStorage", e);
  }
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCloudMode, setIsCloudMode] = useState(false);
  const supabase = createClient();

  const fetch = useCallback(async () => {
    setLoading(true);
    const session = getLocalSession();
    const userEmail = session?.email;

    // If explicit demo or offlineFallback, load local storage immediately
    if (session?.isDemo || session?.offlineFallback) {
      const localData = loadLocalTransactions(userEmail);
      setTransactions(localData);
      setIsCloudMode(false);
      setLoading(false);
      return;
    }

    // Check if user has active Supabase authentication
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Not authenticated in Supabase -> use local storage
        const localData = loadLocalTransactions(userEmail);
        setTransactions(localData);
        setIsCloudMode(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }
      setTransactions(data ?? []);
      setIsCloudMode(true);
    } catch {
      // Supabase is unreachable/paused or network error -> gracefully fallback to local storage
      const localData = loadLocalTransactions(userEmail);
      setTransactions(localData);
      setIsCloudMode(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const addTransaction = async (tx: NewTransaction) => {
    const session = getLocalSession();
    const userEmail = session?.email;
    const useLocal = !isCloudMode || session?.isDemo || session?.offlineFallback;

    if (useLocal) {
      const newTx: Transaction = {
        ...tx,
        id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        user_id: session?.id || "demo-user",
        created_at: new Date().toISOString(),
      };
      setTransactions((prev) => {
        const next = [newTx, ...prev].sort((a, b) => b.date.localeCompare(a.date));
        saveLocalTransactions(userEmail, next);
        return next;
      });
      toast.success("Transaction added!");
      return;
    }

    // Cloud Mode
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("No active user");
      }

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
        throw error;
      }

      setTransactions((prev) =>
        prev.map((t) => (t.id === tempId ? data : t))
      );
      toast.success("Transaction added!");
    } catch {
      // Fallback locally so user data is never lost
      const newTx: Transaction = {
        ...tx,
        id: `tx-${Date.now()}`,
        user_id: session?.id || "demo-user",
        created_at: new Date().toISOString(),
      };
      setTransactions((prev) => {
        const next = [newTx, ...prev.filter((t) => !t.id.startsWith("temp-"))].sort((a, b) => b.date.localeCompare(a.date));
        saveLocalTransactions(userEmail, next);
        return next;
      });
      setIsCloudMode(false);
      toast.success("Transaction added (Saved locally)");
    }
  };

  const updateTransaction = async (id: string, updates: Partial<NewTransaction>) => {
    const original = transactions.find((t) => t.id === id);
    if (!original) return;

    const session = getLocalSession();
    const userEmail = session?.email;

    // Optimistic update
    setTransactions((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...updates } : t));
      saveLocalTransactions(userEmail, next);
      return next;
    });

    if (!isCloudMode || session?.isDemo || session?.offlineFallback) {
      toast.success("Transaction updated!");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("transactions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      setTransactions((prev) => prev.map((t) => (t.id === id ? data : t)));
      toast.success("Transaction updated!");
    } catch {
      // Local copy is already updated optimistically
      setIsCloudMode(false);
      toast.success("Transaction updated (Saved locally)");
    }
  };

  const deleteTransaction = async (id: string) => {
    const original = transactions.find((t) => t.id === id);
    if (!original) return;

    const session = getLocalSession();
    const userEmail = session?.email;

    // Optimistic removal
    setTransactions((prev) => {
      const next = prev.filter((t) => t.id !== id);
      saveLocalTransactions(userEmail, next);
      return next;
    });

    if (!isCloudMode || session?.isDemo || session?.offlineFallback) {
      toast.success("Transaction deleted!");
      return;
    }

    try {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
      toast.success("Transaction deleted!");
    } catch {
      // Local state is already updated
      setIsCloudMode(false);
      toast.success("Transaction deleted (Saved locally)");
    }
  };

  const resetToSampleData = () => {
    const session = getLocalSession();
    const userEmail = session?.email;
    const fresh = getInitialMockTransactions();
    saveLocalTransactions(userEmail, fresh);
    setTransactions(fresh);
    toast.success("Sample transactions loaded!");
  };

  return {
    transactions,
    loading,
    isCloudMode,
    refetch: fetch,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    resetToSampleData,
  };
}
