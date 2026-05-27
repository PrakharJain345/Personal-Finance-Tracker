"use client";

import { Card } from "@/components/ui/Card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Transaction } from "@/hooks/useTransactions";
import { categoryConfig } from "@/lib/utils";
import { Folder } from "lucide-react";

interface CategoryChartProps {
  transactions: Transaction[];
}

const COLORS = [
  "#4C6EF5", "#10B981", "#F59E0B", "#EF4444",
  "#8B5CF6", "#06B6D4", "#F97316", "#EC4899",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div className="bg-[#1A2235] border border-[#4C6EF5] rounded-xl p-3 text-sm shadow-xl">
        <p className="text-[#F9FAFB] font-medium">{name}</p>
        <p className="text-[#9CA3AF]">${value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function CategoryChart({ transactions }: CategoryChartProps) {
  const expenses = transactions.filter((t) => t.type === "expense");

  const categoryTotals: Record<string, number> = {};
  expenses.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
  });

  const data = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <Card className="animate-enter delay-4 h-full" style={{ opacity: 0 }}>
      <h3 className="text-[#F9FAFB] font-semibold text-base mb-5">Spending by Category</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-[#4B5563] text-sm">
          No expense data yet
        </div>
      ) : (
        <div className="relative">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                isAnimationActive={true}
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-xs text-[#9CA3AF]">Total</p>
              <p className="text-base font-bold text-[#F9FAFB]">${total.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
      {/* Legend */}
      <div className="mt-2 space-y-1.5">
        {data.slice(0, 4).map(({ name, value }, i) => {
          const cfg = categoryConfig[name] ?? { color: "#9CA3AF", icon: Folder };
          const Icon = cfg.icon;
          return (
            <div key={name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-[#9CA3AF] flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                  {name}
                </span>
              </div>
              <span className="text-[#F9FAFB] font-medium">
                {total > 0 ? `${((value / total) * 100).toFixed(0)}%` : "0%"}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
