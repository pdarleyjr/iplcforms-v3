globalThis.process ??= {}; globalThis.process.env ??= {};
import { r as reactExports, j as jsxRuntimeExports, Z as List, _ as Trigger, $ as Content, a0 as Root2 } from './react-vendor_BBaf1uT2.mjs';
import { e as cn } from './card_DRaKdq96.mjs';

const Tabs = Root2;
const TabsList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  List,
  {
    ref,
    className: cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = List.displayName;
const TabsTrigger = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = Trigger.displayName;
const TabsContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content,
  {
    ref,
    className: cn(
      "mt-3 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-iplc-primary/20 focus-visible:ring-offset-2",
      "rounded-lg border border-iplc-neutral-200 bg-iplc-background p-4 shadow-[var(--iplc-shadow-sm)]",
      className
    ),
    ...props
  }
));
TabsContent.displayName = Content.displayName;

export { Tabs as T, TabsList as a, TabsTrigger as b, TabsContent as c };
//# sourceMappingURL=tabs_BvJqzT84.mjs.map
