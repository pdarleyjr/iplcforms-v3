globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as requireReactDom, a as reactExports } from './_@astro-renderers_BIJ3dQRj.mjs';
import { g as getDefaultExportFromCjs } from './astro/server_Cd9lk-7F.mjs';
import { c as createSlot } from './button_B9vnY3WY.mjs';
import { j as jsxRuntimeExports, e as cn } from './card_CmFEFEbr.mjs';
import { c as cva } from './index_IYbmRB1y.mjs';

var reactDomExports = requireReactDom();
const ReactDOM = /*@__PURE__*/getDefaultExportFromCjs(reactDomExports);

// src/primitive.tsx
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
function dispatchDiscreteCustomEvent(target, event) {
  if (target) reactDomExports.flushSync(() => target.dispatchEvent(event));
}

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

export { Alert as A, Primitive as P, ReactDOM as R, AlertDescription as a, AlertTitle as b, dispatchDiscreteCustomEvent as d, reactDomExports as r };
//# sourceMappingURL=alert_W4kakS3Y.mjs.map
