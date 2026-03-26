"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ValueDisplayProps {
  monthlyValue: number;
  annualValue?: number;
  confidence?: "high" | "medium" | "low";
  trend?: "up" | "down" | "flat";
  trendPercentage?: number;
  showAnnual?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ValueDisplay({
  monthlyValue,
  annualValue,
  confidence = "medium",
  trend,
  trendPercentage,
  showAnnual = true,
  size = "md",
}: ValueDisplayProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getConfidenceColor = () => {
    switch (confidence) {
      case "high":
        return { bg: "#DCFCE7", text: "#166534", label: "High Confidence" };
      case "medium":
        return { bg: "#FEF3C7", text: "#92400E", label: "Medium Confidence" };
      case "low":
        return { bg: "#FEE2E2", text: "#991B1B", label: "Low Confidence" };
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    const iconClass = "h-4 w-4";
    switch (trend) {
      case "up":
        return <TrendingUp className={`${iconClass} text-[#22C55E]`} />;
      case "down":
        return <TrendingDown className={`${iconClass} text-[#EF4444]`} />;
      default:
        return <Minus className={`${iconClass} text-[#888888]`} />;
    }
  };

  const confidenceConfig = getConfidenceColor();
  const calculatedAnnual = annualValue ?? monthlyValue * 12;

  const sizeConfig = {
    sm: { value: "text-xl", label: "text-xs" },
    md: { value: "text-3xl", label: "text-sm" },
    lg: { value: "text-4xl", label: "text-base" },
  };

  const config = sizeConfig[size];

  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-3">
        <span className={`font-bold text-[#1A1A1A] ${config.value}`}>
          {formatCurrency(monthlyValue)}
        </span>
        <span className={`text-[#888888] ${config.label}`}>/mo</span>
        {trend && (
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            {trendPercentage !== undefined && (
              <span
                className={`text-xs font-medium ${
                  trend === "up"
                    ? "text-[#22C55E]"
                    : trend === "down"
                    ? "text-[#EF4444]"
                    : "text-[#888888]"
                }`}
              >
                {trendPercentage > 0 ? "+" : ""}
                {trendPercentage}%
              </span>
            )}
          </div>
        )}
      </div>

      {showAnnual && (
        <div className="flex items-center gap-2">
          <span className="text-[#555555] text-sm">
            {formatCurrency(calculatedAnnual)}
            <span className="text-[#888888]">/yr</span>
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: confidenceConfig.bg, color: confidenceConfig.text }}
          >
            {confidenceConfig.label}
          </span>
        </div>
      )}
    </div>
  );
}
