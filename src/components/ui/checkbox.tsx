import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-[hsl(var(--iplc-neutral-700))] bg-background shadow-[var(--iplc-shadow-sm)] transition-all duration-200",
      "hover:border-[hsl(var(--iplc-primary))] hover:shadow-[var(--iplc-shadow-md)]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--iplc-accent-sky))] focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:border-transparent data-[state=checked]:bg-[var(--iplc-gradient-primary)] data-[state=checked]:text-white",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-3 w-3 font-bold" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };