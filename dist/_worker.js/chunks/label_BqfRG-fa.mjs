globalThis.process ??= {}; globalThis.process.env ??= {};
import { j as jsxRuntimeExports } from './jsx-runtime_DoH26EBh.mjs';
import { a as reactExports } from './_@astro-renderers_DXs7ZzLR.mjs';
import { P as Primitive } from './alert_BbHPkGHQ.mjs';
import { c as cva } from './index_DZC19O4g.mjs';
import { e as cn } from './card_Bkkbi2m7.mjs';

var NAME = "Label";
var Label$1 = reactExports.forwardRef((props, forwardedRef) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.label,
    {
      ...props,
      ref: forwardedRef,
      onMouseDown: (event) => {
        const target = event.target;
        if (target.closest("button, input, select, textarea")) return;
        props.onMouseDown?.(event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    }
  );
});
Label$1.displayName = NAME;
var Root = Label$1;

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
//# sourceMappingURL=label_BqfRG-fa.mjs.map
