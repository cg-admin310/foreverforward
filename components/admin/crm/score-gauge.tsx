"use client";

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  showLabel?: boolean;
}

export function ScoreGauge({
  score,
  maxScore = 100,
  size = "md",
  label,
  showLabel = true,
}: ScoreGaugeProps) {
  const percentage = Math.min(Math.max((score / maxScore) * 100, 0), 100);

  const getColor = () => {
    if (percentage >= 70) return { stroke: "#22C55E", bg: "#DCFCE7", text: "#166534" };
    if (percentage >= 40) return { stroke: "#F59E0B", bg: "#FEF3C7", text: "#92400E" };
    return { stroke: "#EF4444", bg: "#FEE2E2", text: "#991B1B" };
  };

  const getLabel = () => {
    if (label) return label;
    if (percentage >= 70) return "High";
    if (percentage >= 40) return "Medium";
    return "Low";
  };

  const colors = getColor();

  const sizeConfig = {
    sm: { outer: 60, stroke: 6, fontSize: "text-lg", labelSize: "text-xs" },
    md: { outer: 80, stroke: 8, fontSize: "text-2xl", labelSize: "text-sm" },
    lg: { outer: 120, stroke: 10, fontSize: "text-4xl", labelSize: "text-base" },
  };

  const config = sizeConfig[size];
  const radius = (config.outer - config.stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: config.outer, height: config.outer }}>
        <svg className="transform -rotate-90" width={config.outer} height={config.outer}>
          {/* Background circle */}
          <circle
            cx={config.outer / 2}
            cy={config.outer / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={config.stroke}
          />
          {/* Progress circle */}
          <circle
            cx={config.outer / 2}
            cy={config.outer / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${config.fontSize}`} style={{ color: colors.text }}>
            {Math.round(score)}
          </span>
        </div>
      </div>
      {showLabel && (
        <span
          className={`mt-2 font-medium ${config.labelSize} px-2 py-0.5 rounded-full`}
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          {getLabel()}
        </span>
      )}
    </div>
  );
}
