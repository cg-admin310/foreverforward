import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean;
}

// Base skeleton with optional gold shimmer
export function Skeleton({ className, shimmer = true, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-[#F5F3EF]",
        shimmer && "shimmer",
        className
      )}
      {...props}
    />
  );
}

// Text line skeleton
export function SkeletonText({
  lines = 1,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 && lines > 1 && "w-3/4"
          )}
        />
      ))}
    </div>
  );
}

// Card skeleton
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl bg-[#FAFAF8] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]",
        className
      )}
    >
      <Skeleton className="h-48 w-full rounded-lg mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

// Avatar skeleton
export function SkeletonAvatar({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };

  return (
    <Skeleton
      className={cn("rounded-full", sizeClasses[size], className)}
    />
  );
}

// Button skeleton
export function SkeletonButton({
  size = "default",
  className,
}: {
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-8 w-20",
    default: "h-10 w-24",
    lg: "h-12 w-32",
  };

  return (
    <Skeleton
      className={cn("rounded-lg", sizeClasses[size], className)}
    />
  );
}

// Table row skeleton
export function SkeletonTableRow({
  columns = 4,
  className,
}: {
  columns?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 py-4 border-b border-[#DDDDDD]",
        className
      )}
    >
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4 flex-1",
            i === 0 && "max-w-[200px]",
            i === columns - 1 && "max-w-[100px]"
          )}
        />
      ))}
    </div>
  );
}

// Metric card skeleton
export function SkeletonMetricCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl bg-[#FAFAF8] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-8 w-24 mb-1" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}
