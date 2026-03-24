"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent text-sm font-semibold whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Primary: Gold fill, black text
        default:
          "bg-[#C9A84C] text-[#1A1A1A] hover:bg-[#A68A2E] shadow-sm hover:shadow-md",
        // Secondary: Olive border, olive text, fills on hover
        secondary:
          "border-2 border-[#5A7247] text-[#5A7247] bg-transparent hover:bg-[#5A7247] hover:text-white",
        // Outline: Black border with hover effect
        outline:
          "border border-[#DDDDDD] bg-transparent text-[#1A1A1A] hover:bg-[#F5F3EF] hover:border-[#C9A84C]",
        // Ghost: Gold text with underline hover
        ghost:
          "text-[#C9A84C] bg-transparent hover:bg-[#FBF6E9] underline-offset-4 hover:underline",
        // Link: Simple text link
        link: "text-[#C9A84C] underline-offset-4 hover:underline bg-transparent",
        // Destructive: Red variant
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md",
        // On dark background: Gold fill, black text (same as default)
        dark: "bg-[#C9A84C] text-[#1A1A1A] hover:bg-[#E8D48B] shadow-sm hover:shadow-md",
        // Black fill variant
        black:
          "bg-[#1A1A1A] text-white hover:bg-[#2D2D2D] shadow-sm hover:shadow-md",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
