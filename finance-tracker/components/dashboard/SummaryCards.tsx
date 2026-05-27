"use client";

import { Card } from "@/components/ui/Card";
import { TrendingUp, TrendingDown, Hash } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface SummaryCardsProps {
  income: number;
  expense: number;
  count: number;
}

export default function SummaryCards({ income, expense, count }: SummaryCardsProps) {
  const cards = [
    {
      label: "Total Income",
      value: formatCurrency(income),
      icon: TrendingUp,
      iconBg: "#10B98120",
      iconColor: "#10B981",
      valueColor: "#10B981",
      delay: "delay-1",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(expense),
      icon: TrendingDown,
      iconBg: "#EF444420",
      iconColor: "#EF4444",
      valueColor: "#EF4444",
      delay: "delay-2",
    },
    {
      label: "Transactions",
      value: count.toString(),
      icon: Hash,
      iconBg: "#4C6EF520",
      iconColor: "#4C6EF5",
      valueColor: "#4C6EF5",
      delay: "delay-3",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(({ label, value, icon: Icon, iconBg, iconColor, valueColor, delay }) => (
        <Card key={label} className={`animate-enter ${delay}`}>
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: iconBg }}
            >
              <Icon className="w-5 h-5" style={{ color: iconColor }} />
            </div>
            <div>
              <p className="text-[#9CA3AF] text-xs font-medium mb-0.5">{label}</p>
              <p className="font-bold text-xl tabular-nums" style={{ color: valueColor }}>
                {value}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
