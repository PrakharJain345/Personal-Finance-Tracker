"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface BalanceCardProps {
  balance: number;
  income: number;
  expense: number;
  lastMonthBalance: number;
}

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    let start: number | null = null;
    const initial = 0;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(initial + (target - initial) * eased);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return count;
}

export default function BalanceCard({ balance, income, expense, lastMonthBalance }: BalanceCardProps) {
  const animatedBalance = useCountUp(balance);
  const change = lastMonthBalance !== 0 ? ((balance - lastMonthBalance) / Math.abs(lastMonthBalance)) * 100 : 0;
  const positive = change >= 0;

  return (
    <div
      className="rounded-2xl p-6 border border-[#1F2A3D] shadow-[0_4px_24px_rgba(0,0,0,0.3)] animate-enter"
      style={{ background: "linear-gradient(135deg, #1A2235 0%, #0D1117 100%)" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#9CA3AF] text-sm font-medium mb-2">Net Balance</p>
          <p className="text-[#F9FAFB] font-bold tabular-nums" style={{ fontSize: "2.25rem" }}>
            {formatCurrency(animatedBalance)}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                positive ? "bg-[#10B98120] text-[#10B981]" : "bg-[#EF444420] text-[#EF4444]"
              }`}
            >
              {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(change).toFixed(1)}% vs last month
            </span>
          </div>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-[#4C6EF520] flex items-center justify-center">
          <TrendingUp className="w-7 h-7 text-[#4C6EF5]" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 pt-5 border-t border-[#1F2A3D]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#10B98120] flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
          </div>
          <div>
            <p className="text-[#9CA3AF] text-xs">Total Income</p>
            <p className="text-[#10B981] font-semibold text-sm tabular-nums">{formatCurrency(income)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#EF444420] flex items-center justify-center">
            <TrendingDown className="w-4 h-4 text-[#EF4444]" />
          </div>
          <div>
            <p className="text-[#9CA3AF] text-xs">Total Expenses</p>
            <p className="text-[#EF4444] font-semibold text-sm tabular-nums">{formatCurrency(expense)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
