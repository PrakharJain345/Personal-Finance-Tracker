"use client";

import { Card } from "@/components/ui/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Transaction } from "@/hooks/useTransactions";

interface CashflowChartProps {
  transactions: Transaction[];
}

function getLast6MonthsData(transactions: Transaction[]) {
  const months: { month: string; income: number; expense: number }[] = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = d.toLocaleString("default", { month: "short" });
    const year = d.getFullYear();
    const monthKey = `${year}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    const monthTxs = transactions.filter((t) => t.date.startsWith(monthKey));
    months.push({
      month: monthStr,
      income: monthTxs
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + Number(t.amount), 0),
      expense: monthTxs
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + Number(t.amount), 0),
    });
  }
  return months;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A2235] border border-[#4C6EF5] rounded-xl p-3 text-sm shadow-xl">
        <p className="text-[#9CA3AF] font-medium mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.fill }}>
            {p.name}: ${p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function CashflowChart({ transactions }: CashflowChartProps) {
  const data = getLast6MonthsData(transactions);

  return (
    <Card className="animate-enter delay-4 h-full">
      <h3 className="text-[#F9FAFB] font-semibold text-base mb-5">Cashflow — Last 6 Months</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barGap={4} barCategoryGap={24}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2A3D" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span style={{ color: "#9CA3AF", fontSize: 12 }}>{value}</span>
            )}
          />
          <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} isAnimationActive={true} />
          <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} isAnimationActive={true} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
