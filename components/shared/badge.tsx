import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        // Audience badges
        fathers: "bg-[#FBF6E9] text-[#A68A2E] border border-[#E8D48B]",
        youth: "bg-[#EFF4EB] text-[#3D5030] border border-[#7A9A63]",
        families: "bg-[#FBF6E9] text-[#A68A2E] border border-[#E8D48B]",
        kids: "bg-[#EFF4EB] text-[#3D5030] border border-[#7A9A63]",
        students: "bg-[#EFF4EB] text-[#3D5030] border border-[#7A9A63]",
        // Status badges
        new: "bg-blue-50 text-blue-700 border border-blue-200",
        active: "bg-[#EFF4EB] text-[#5A7247] border border-[#7A9A63]",
        pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
        completed: "bg-[#EFF4EB] text-[#5A7247] border border-[#7A9A63]",
        cancelled: "bg-red-50 text-red-700 border border-red-200",
        // General badges
        default: "bg-[#F5F3EF] text-[#555555] border border-[#DDDDDD]",
        gold: "bg-[#FBF6E9] text-[#A68A2E] border border-[#C9A84C]",
        olive: "bg-[#EFF4EB] text-[#5A7247] border border-[#7A9A63]",
        dark: "bg-[#2D2D2D] text-white border border-[#444444]",
        // Pipeline stages
        discovery: "bg-blue-50 text-blue-700 border border-blue-200",
        assessment: "bg-purple-50 text-purple-700 border border-purple-200",
        proposal: "bg-yellow-50 text-yellow-700 border border-yellow-200",
        negotiation: "bg-orange-50 text-orange-700 border border-orange-200",
        contract: "bg-pink-50 text-pink-700 border border-pink-200",
        onboarding: "bg-cyan-50 text-cyan-700 border border-cyan-200",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        default: "text-xs px-3 py-1",
        lg: "text-sm px-4 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

// Audience labels for badge variants
const audienceLabels: Record<string, string> = {
  fathers: "Fathers",
  youth: "Youth (16+)",
  families: "Families",
  kids: "Kids",
  students: "Students",
};

export function Badge({
  className,
  variant,
  size,
  children,
  ...props
}: BadgeProps & { children?: React.ReactNode }) {
  // Auto-generate label if variant is an audience type and no children
  const label = !children && variant && audienceLabels[variant]
    ? audienceLabels[variant]
    : children;

  return (
    <span
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    >
      {label}
    </span>
  );
}

// Audience badge helper
export function AudienceBadge({
  audience,
  ...props
}: Omit<BadgeProps, "variant"> & {
  audience: "fathers" | "youth" | "families" | "kids" | "students";
}) {
  const labels: Record<typeof audience, string> = {
    fathers: "Fathers",
    youth: "Youth (16+)",
    families: "Families",
    kids: "Kids",
    students: "Students",
  };

  return (
    <Badge variant={audience} {...props}>
      {labels[audience]}
    </Badge>
  );
}

// Status badge helper
export function StatusBadge({
  status,
  ...props
}: Omit<BadgeProps, "variant"> & {
  status: "new" | "active" | "pending" | "completed" | "cancelled";
}) {
  const labels: Record<typeof status, string> = {
    new: "New",
    active: "Active",
    pending: "Pending",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return (
    <Badge variant={status} {...props}>
      {labels[status]}
    </Badge>
  );
}

export { badgeVariants };
