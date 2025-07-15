import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-iplc-neutral-200 bg-white px-3 py-1 text-base shadow-iplc-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-iplc-neutral-700/60 hover:border-iplc-accent-sky/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-iplc-accent-sky focus-visible:ring-offset-2 focus-visible:border-iplc-accent-sky focus-visible:shadow-iplc-md disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-iplc-neutral-200/20 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
