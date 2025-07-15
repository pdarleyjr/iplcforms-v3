import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-[hsl(var(--iplc-neutral-700))] bg-background shadow-[var(--iplc-shadow-sm)] transition-all duration-200",
        "hover:border-[hsl(var(--iplc-primary))] hover:shadow-[var(--iplc-shadow-md)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--iplc-accent-sky))] focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-transparent data-[state=checked]:bg-[var(--iplc-gradient-primary)] data-[state=checked]:text-white",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };