"use client";

import { LucideIcon } from "lucide-react";

type TagVariant = "gold" | "olive" | "blue" | "purple" | "pink" | "gray";

interface TagPillProps {
  label: string;
  variant?: TagVariant;
  icon?: LucideIcon;
  onClick?: () => void;
  removable?: boolean;
  onRemove?: () => void;
}

export function TagPill({
  label,
  variant = "gold",
  icon: Icon,
  onClick,
  removable = false,
  onRemove,
}: TagPillProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "gold":
        return "bg-[#FBF6E9] text-[#A68A2E] border-[#E8D48B]";
      case "olive":
        return "bg-[#EFF4EB] text-[#5A7247] border-[#A7C49A]";
      case "blue":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "purple":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "pink":
        return "bg-pink-50 text-pink-700 border-pink-200";
      case "gray":
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border transition-all ${getVariantStyles()} ${
        onClick ? "cursor-pointer hover:shadow-sm" : ""
      }`}
      onClick={onClick}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {label}
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-1 hover:opacity-70 transition-opacity"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
}

interface TagPillsProps {
  tags: Array<{
    label: string;
    variant?: TagVariant;
    icon?: LucideIcon;
  }>;
  onClick?: (label: string) => void;
  maxVisible?: number;
}

export function TagPills({ tags, onClick, maxVisible }: TagPillsProps) {
  const visibleTags = maxVisible ? tags.slice(0, maxVisible) : tags;
  const hiddenCount = maxVisible ? tags.length - maxVisible : 0;

  return (
    <div className="flex flex-wrap gap-2">
      {visibleTags.map((tag, index) => (
        <TagPill
          key={index}
          {...tag}
          onClick={onClick ? () => onClick(tag.label) : undefined}
        />
      ))}
      {hiddenCount > 0 && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
          +{hiddenCount} more
        </span>
      )}
    </div>
  );
}

// Service-specific tag mapping for MSP leads
export function ServiceTagPills({ services }: { services: string[] }) {
  const getServiceVariant = (service: string): TagVariant => {
    const s = service.toLowerCase();
    if (s.includes("security") || s.includes("cyber")) return "purple";
    if (s.includes("cloud") || s.includes("365")) return "blue";
    if (s.includes("network") || s.includes("cabling")) return "olive";
    if (s.includes("cctv") || s.includes("camera")) return "pink";
    return "gold";
  };

  const tags = services.map((service) => ({
    label: service,
    variant: getServiceVariant(service),
  }));

  return <TagPills tags={tags} />;
}
