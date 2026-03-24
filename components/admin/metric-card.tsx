"use client";

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease" | "neutral";
  };
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-[#C9A84C]",
  iconBg = "bg-[#FBF6E9]",
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#DDDDDD] hover:border-[#C9A84C] hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#888888]">{title}</p>
          <p className="text-3xl font-bold text-[#1A1A1A] mt-2">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              {change.type === "increase" && (
                <TrendingUp className="h-4 w-4 text-[#5A7247]" />
              )}
              {change.type === "decrease" && (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  change.type === "increase" && "text-[#5A7247]",
                  change.type === "decrease" && "text-red-500",
                  change.type === "neutral" && "text-[#888888]"
                )}
              >
                {change.value > 0 ? "+" : ""}
                {change.value}%
              </span>
              <span className="text-sm text-[#888888]">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", iconBg)}>
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
      </div>
    </div>
  );
}
