globalThis.process ??= {}; globalThis.process.env ??= {};
import { r as reactExports, j as jsxRuntimeExports } from './react-vendor_BBaf1uT2.mjs';
import { c as cva } from './index_DiFg8-Jw.mjs';
import { e as cn } from './card_DRaKdq96.mjs';

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm shadow-[var(--iplc-shadow-sm)] transition-all [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-iplc-background border-iplc-neutral-200 text-iplc-neutral-700 [&>svg]:text-iplc-primary",
        destructive: "border-destructive/50 bg-destructive/10 text-destructive dark:border-destructive [&>svg]:text-destructive",
        // IPLC-specific variants
        info: "gradient-metallic-primary border-transparent text-white [&>svg]:text-white",
        success: "gradient-metallic-green border-transparent text-white [&>svg]:text-white",
        warning: "gradient-metallic-gold border-transparent text-iplc-primary-dark [&>svg]:text-iplc-primary-dark",
        navy: "gradient-metallic-navy border-transparent text-white [&>svg]:text-white"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Alert = reactExports.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    ref,
    role: "alert",
    className: cn(alertVariants({ variant }), className),
    ...props
  }
));
Alert.displayName = "Alert";
const AlertTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "h5",
  {
    ref,
    className: cn("mb-1 font-medium leading-none tracking-tight", className),
    ...props
  }
));
AlertTitle.displayName = "AlertTitle";
const AlertDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    ref,
    className: cn("text-sm [&_p]:leading-relaxed", className),
    ...props
  }
));
AlertDescription.displayName = "AlertDescription";

export { Alert as A, AlertDescription as a, AlertTitle as b };
//# sourceMappingURL=alert_oZX2k7yW.mjs.map
