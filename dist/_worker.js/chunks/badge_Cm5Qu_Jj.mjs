globalThis.process ??= {}; globalThis.process.env ??= {};
import { j as jsxRuntimeExports } from './jsx-runtime_DoH26EBh.mjs';
import './_@astro-renderers_DXs7ZzLR.mjs';
import { c as cva } from './index_DZC19O4g.mjs';
import { e as cn } from './card_Bkkbi2m7.mjs';

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-iplc-primary/20 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent gradient-metallic-primary text-white shadow-[var(--iplc-shadow-sm)] hover:shadow-[var(--iplc-shadow-md)]",
        secondary: "border-transparent bg-iplc-neutral-200 text-iplc-neutral-700 hover:bg-iplc-neutral-200/80 shadow-[var(--iplc-shadow-sm)]",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow-[var(--iplc-shadow-sm)] hover:bg-destructive/80",
        outline: "text-foreground border-iplc-neutral-200",
        // New IPLC metallic variants
        gold: "border-transparent gradient-metallic-gold text-iplc-primary-dark shadow-[var(--iplc-shadow-sm)] hover:shadow-[var(--iplc-shadow-md)]",
        green: "border-transparent gradient-metallic-green text-white shadow-[var(--iplc-shadow-sm)] hover:shadow-[var(--iplc-shadow-md)]",
        navy: "border-transparent gradient-metallic-navy text-white shadow-[var(--iplc-shadow-sm)] hover:shadow-[var(--iplc-shadow-md)]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}

export { Badge as B };
//# sourceMappingURL=badge_Cm5Qu_Jj.mjs.map
