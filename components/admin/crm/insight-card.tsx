"use client";

import { LucideIcon, AlertTriangle, Lightbulb, Target, TrendingUp, Shield, Zap } from "lucide-react";

type InsightType = "pain_point" | "recommendation" | "opportunity" | "risk" | "strength" | "urgent";

interface InsightCardProps {
  type: InsightType;
  title: string;
  description: string;
  icon?: LucideIcon;
}

export function InsightCard({ type, title, description, icon }: InsightCardProps) {
  const getTypeConfig = () => {
    switch (type) {
      case "pain_point":
        return {
          Icon: icon || AlertTriangle,
          bg: "#FEE2E2",
          iconBg: "#FEF2F2",
          iconColor: "#DC2626",
          borderColor: "#FECACA",
        };
      case "recommendation":
        return {
          Icon: icon || Lightbulb,
          bg: "#FEF3C7",
          iconBg: "#FFFBEB",
          iconColor: "#D97706",
          borderColor: "#FDE68A",
        };
      case "opportunity":
        return {
          Icon: icon || Target,
          bg: "#DCFCE7",
          iconBg: "#F0FDF4",
          iconColor: "#16A34A",
          borderColor: "#BBF7D0",
        };
      case "risk":
        return {
          Icon: icon || Shield,
          bg: "#FFE4E6",
          iconBg: "#FFF1F2",
          iconColor: "#E11D48",
          borderColor: "#FECDD3",
        };
      case "strength":
        return {
          Icon: icon || TrendingUp,
          bg: "#EFF4EB",
          iconBg: "#F0FDF4",
          iconColor: "#5A7247",
          borderColor: "#A7C49A",
        };
      case "urgent":
        return {
          Icon: icon || Zap,
          bg: "#FBF6E9",
          iconBg: "#FFFBEB",
          iconColor: "#C9A84C",
          borderColor: "#E8D48B",
        };
    }
  };

  const config = getTypeConfig();
  const IconComponent = config.Icon;

  return (
    <div
      className="flex items-start gap-3 p-4 rounded-xl transition-all hover:shadow-sm"
      style={{ backgroundColor: config.bg, borderLeft: `3px solid ${config.borderColor}` }}
    >
      <div
        className="p-2 rounded-lg shrink-0"
        style={{ backgroundColor: config.iconBg }}
      >
        <IconComponent className="h-4 w-4" style={{ color: config.iconColor }} />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-medium text-[#1A1A1A] text-sm">{title}</h4>
        <p className="text-[#555555] text-sm mt-0.5 line-clamp-2">{description}</p>
      </div>
    </div>
  );
}

interface InsightListProps {
  insights: Array<{
    type: InsightType;
    title: string;
    description: string;
  }>;
  maxItems?: number;
}

export function InsightList({ insights, maxItems }: InsightListProps) {
  const displayedInsights = maxItems ? insights.slice(0, maxItems) : insights;
  const hasMore = maxItems && insights.length > maxItems;

  return (
    <div className="space-y-3">
      {displayedInsights.map((insight, index) => (
        <InsightCard key={index} {...insight} />
      ))}
      {hasMore && (
        <p className="text-sm text-[#888888] text-center py-2">
          +{insights.length - maxItems} more insights
        </p>
      )}
    </div>
  );
}
