globalThis.process ??= {}; globalThis.process.env ??= {};
import { r as reactExports, j as jsxRuntimeExports, G as Slot } from './react-vendor_BBaf1uT2.mjs';
import { c as cva } from './index_DiFg8-Jw.mjs';
import { e as cn } from './card_DRaKdq96.mjs';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-iplc-accent-sky focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "gradient-metallic-primary text-white shadow-iplc-sm hover:shadow-iplc-md hover:scale-[1.02] active:scale-[0.98]",
        destructive: "bg-destructive text-destructive-foreground shadow-iplc-sm hover:bg-destructive/90 hover:shadow-iplc-md",
        outline: "border border-iplc-neutral-200 bg-background shadow-iplc-sm hover:bg-iplc-accent-sky/10 hover:border-iplc-accent-sky hover:shadow-iplc-md",
        secondary: "bg-iplc-accent-sky text-white shadow-iplc-sm hover:bg-iplc-accent-sky/90 hover:shadow-iplc-md",
        ghost: "hover:bg-iplc-neutral-200/20 hover:text-iplc-primary",
        link: "text-iplc-primary underline-offset-4 hover:underline hover:text-iplc-primary-dark"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";

export { Button as B, buttonVariants as b };
//# sourceMappingURL=button_D4hUjemp.mjs.map
