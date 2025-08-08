globalThis.process ??= {}; globalThis.process.env ??= {};
import { r as reactExports, j as jsxRuntimeExports, E as Root } from './react-vendor_BBaf1uT2.mjs';
import { c as cva } from './index_DiFg8-Jw.mjs';
import { e as cn } from './card_DRaKdq96.mjs';

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = Root.displayName;

export { Label as L };
//# sourceMappingURL=label_BGeTbS01.mjs.map
