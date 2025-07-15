import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-iplc-primary/20 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent gradient-metallic-primary text-white shadow-[var(--iplc-shadow-sm)] hover:shadow-[var(--iplc-shadow-md)]",
        secondary:
          "border-transparent bg-iplc-neutral-200 text-iplc-neutral-700 hover:bg-iplc-neutral-200/80 shadow-[var(--iplc-shadow-sm)]",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-[var(--iplc-shadow-sm)] hover:bg-destructive/80",
        outline: "text-foreground border-iplc-neutral-200",
        // New IPLC metallic variants
        gold:
          "border-transparent gradient-metallic-gold text-iplc-primary-dark shadow-[var(--iplc-shadow-sm)] hover:shadow-[var(--iplc-shadow-md)]",
        green:
          "border-transparent gradient-metallic-green text-white shadow-[var(--iplc-shadow-sm)] hover:shadow-[var(--iplc-shadow-md)]",
        navy:
          "border-transparent gradient-metallic-navy text-white shadow-[var(--iplc-shadow-sm)] hover:shadow-[var(--iplc-shadow-md)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
