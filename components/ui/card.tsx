import * as React from "react";

import { cn } from "@/lib/utils";

function Card({
  className,
  size = "default",
  hoverable = false,
  ...props
}: React.ComponentProps<"div"> & {
  size?: "default" | "sm";
  hoverable?: boolean;
}) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        // Base styles
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-[#FAFAF8] text-[#1A1A1A] shadow-[0_2px_8px_rgba(0,0,0,0.08)]",
        // Size variants
        "py-4 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0",
        // Image handling
        "*:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        // Hover effects for hoverable cards
        hoverable && [
          "transition-all duration-300 cursor-pointer",
          "hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]",
          "hover:border-t-[3px] hover:border-t-[#C9A84C]",
          "hover:-translate-y-1",
        ],
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min items-start gap-1 rounded-t-xl px-5",
        "group-data-[size=sm]/card:px-4",
        "has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        "has-data-[slot=card-description]:grid-rows-[auto_auto]",
        "[.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-semibold text-lg leading-snug text-[#1A1A1A]",
        "group-data-[size=sm]/card:text-base",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-[#555555] leading-relaxed", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-5 group-data-[size=sm]/card:px-4 text-[#555555]",
        className
      )}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t border-[#DDDDDD] bg-[#F5F3EF] p-5",
        "group-data-[size=sm]/card:p-4",
        className
      )}
      {...props}
    />
  );
}

// Feature Card - Gold accent at top
function FeatureCard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="feature-card"
      className={cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-[#FAFAF8] text-[#1A1A1A] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-5",
        "border-t-4 border-t-[#C9A84C]",
        "transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:-translate-y-1",
        className
      )}
      {...props}
    />
  );
}

// Dark Card - For use on light backgrounds with dark theme
function DarkCard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dark-card"
      className={cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-[#1A1A1A] text-white shadow-lg p-5",
        "transition-all duration-300 hover:bg-[#2D2D2D]",
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  FeatureCard,
  DarkCard,
};
