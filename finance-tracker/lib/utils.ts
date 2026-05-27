import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Utensils,
  Car,
  ShoppingBag,
  Activity,
  Film,
  Home,
  Zap,
  BookOpen,
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  Folder,
} from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const categoryConfig: Record<string, { color: string; icon: any }> = {
  "Food & Dining": { color: "#F97316", icon: Utensils },
  Transport: { color: "#06B6D4", icon: Car },
  Shopping: { color: "#EC4899", icon: ShoppingBag },
  "Health & Medical": { color: "#10B981", icon: Activity },
  Entertainment: { color: "#8B5CF6", icon: Film },
  Rent: { color: "#EF4444", icon: Home },
  Utilities: { color: "#F59E0B", icon: Zap },
  Education: { color: "#4C6EF5", icon: BookOpen },
  Salary: { color: "#10B981", icon: Briefcase },
  Freelance: { color: "#06B6D4", icon: Laptop },
  Investment: { color: "#8B5CF6", icon: TrendingUp },
  Gift: { color: "#EC4899", icon: Gift },
  Other: { color: "#9CA3AF", icon: Folder },
};
