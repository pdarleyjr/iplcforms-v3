globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Cd9lk-7F.mjs';
import { $ as $$AdminLayout } from '../chunks/AdminLayout_ByVTlUyg.mjs';
import { j as jsxRuntimeExports, e as cn, C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from '../chunks/card_CmFEFEbr.mjs';
import { a as reactExports, R as React } from '../chunks/_@astro-renderers_BIJ3dQRj.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_BIJ3dQRj.mjs';
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from '../chunks/tabs_BMWZTcvI.mjs';
import { P as Primitive, A as Alert, a as AlertDescription } from '../chunks/alert_W4kakS3Y.mjs';
import { c as createContextScope, u as useControllableState, a as composeEventHandlers, b as useLayoutEffect2 } from '../chunks/index_CcZ-Jgsd.mjs';
import { u as useId, c as createCollection, b as useDirection } from '../chunks/index_B1u62xhn.mjs';
import { u as useComposedRefs } from '../chunks/button_B9vnY3WY.mjs';
import { P as Presence } from '../chunks/index_DvdPJZ5U.mjs';
import { C as ChevronDown } from '../chunks/chevron-down_D1A352QV.mjs';
import { B as Badge } from '../chunks/badge_bicgCY70.mjs';
import { I as Input } from '../chunks/input_CS4ZXKo0.mjs';
import { L as Label } from '../chunks/label_Ch9XXvk2.mjs';

var COLLAPSIBLE_NAME = "Collapsible";
var [createCollapsibleContext, createCollapsibleScope] = createContextScope(COLLAPSIBLE_NAME);
var [CollapsibleProvider, useCollapsibleContext] = createCollapsibleContext(COLLAPSIBLE_NAME);
var Collapsible = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeCollapsible,
      open: openProp,
      defaultOpen,
      disabled,
      onOpenChange,
      ...collapsibleProps
    } = props;
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen ?? false,
      onChange: onOpenChange,
      caller: COLLAPSIBLE_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CollapsibleProvider,
      {
        scope: __scopeCollapsible,
        disabled,
        contentId: useId(),
        open,
        onOpenToggle: reactExports.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            "data-state": getState$1(open),
            "data-disabled": disabled ? "" : void 0,
            ...collapsibleProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Collapsible.displayName = COLLAPSIBLE_NAME;
var TRIGGER_NAME$1 = "CollapsibleTrigger";
var CollapsibleTrigger = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeCollapsible, ...triggerProps } = props;
    const context = useCollapsibleContext(TRIGGER_NAME$1, __scopeCollapsible);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        "aria-controls": context.contentId,
        "aria-expanded": context.open || false,
        "data-state": getState$1(context.open),
        "data-disabled": context.disabled ? "" : void 0,
        disabled: context.disabled,
        ...triggerProps,
        ref: forwardedRef,
        onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
      }
    );
  }
);
CollapsibleTrigger.displayName = TRIGGER_NAME$1;
var CONTENT_NAME$1 = "CollapsibleContent";
var CollapsibleContent = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { forceMount, ...contentProps } = props;
    const context = useCollapsibleContext(CONTENT_NAME$1, props.__scopeCollapsible);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleContentImpl, { ...contentProps, ref: forwardedRef, present }) });
  }
);
CollapsibleContent.displayName = CONTENT_NAME$1;
var CollapsibleContentImpl = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeCollapsible, present, children, ...contentProps } = props;
  const context = useCollapsibleContext(CONTENT_NAME$1, __scopeCollapsible);
  const [isPresent, setIsPresent] = reactExports.useState(present);
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const heightRef = reactExports.useRef(0);
  const height = heightRef.current;
  const widthRef = reactExports.useRef(0);
  const width = widthRef.current;
  const isOpen = context.open || isPresent;
  const isMountAnimationPreventedRef = reactExports.useRef(isOpen);
  const originalStylesRef = reactExports.useRef(void 0);
  reactExports.useEffect(() => {
    const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
    return () => cancelAnimationFrame(rAF);
  }, []);
  useLayoutEffect2(() => {
    const node = ref.current;
    if (node) {
      originalStylesRef.current = originalStylesRef.current || {
        transitionDuration: node.style.transitionDuration,
        animationName: node.style.animationName
      };
      node.style.transitionDuration = "0s";
      node.style.animationName = "none";
      const rect = node.getBoundingClientRect();
      heightRef.current = rect.height;
      widthRef.current = rect.width;
      if (!isMountAnimationPreventedRef.current) {
        node.style.transitionDuration = originalStylesRef.current.transitionDuration;
        node.style.animationName = originalStylesRef.current.animationName;
      }
      setIsPresent(present);
    }
  }, [context.open, present]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "data-state": getState$1(context.open),
      "data-disabled": context.disabled ? "" : void 0,
      id: context.contentId,
      hidden: !isOpen,
      ...contentProps,
      ref: composedRefs,
      style: {
        [`--radix-collapsible-content-height`]: height ? `${height}px` : void 0,
        [`--radix-collapsible-content-width`]: width ? `${width}px` : void 0,
        ...props.style
      },
      children: isOpen && children
    }
  );
});
function getState$1(open) {
  return open ? "open" : "closed";
}
var Root = Collapsible;
var Trigger = CollapsibleTrigger;
var Content = CollapsibleContent;

var ACCORDION_NAME = "Accordion";
var ACCORDION_KEYS = ["Home", "End", "ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"];
var [Collection, useCollection, createCollectionScope] = createCollection(ACCORDION_NAME);
var [createAccordionContext, createAccordionScope] = createContextScope(ACCORDION_NAME, [
  createCollectionScope,
  createCollapsibleScope
]);
var useCollapsibleScope = createCollapsibleScope();
var Accordion$1 = React.forwardRef(
  (props, forwardedRef) => {
    const { type, ...accordionProps } = props;
    const singleProps = accordionProps;
    const multipleProps = accordionProps;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeAccordion, children: type === "multiple" ? /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionImplMultiple, { ...multipleProps, ref: forwardedRef }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionImplSingle, { ...singleProps, ref: forwardedRef }) });
  }
);
Accordion$1.displayName = ACCORDION_NAME;
var [AccordionValueProvider, useAccordionValueContext] = createAccordionContext(ACCORDION_NAME);
var [AccordionCollapsibleProvider, useAccordionCollapsibleContext] = createAccordionContext(
  ACCORDION_NAME,
  { collapsible: false }
);
var AccordionImplSingle = React.forwardRef(
  (props, forwardedRef) => {
    const {
      value: valueProp,
      defaultValue,
      onValueChange = () => {
      },
      collapsible = false,
      ...accordionSingleProps
    } = props;
    const [value, setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue ?? "",
      onChange: onValueChange,
      caller: ACCORDION_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AccordionValueProvider,
      {
        scope: props.__scopeAccordion,
        value: React.useMemo(() => value ? [value] : [], [value]),
        onItemOpen: setValue,
        onItemClose: React.useCallback(() => collapsible && setValue(""), [collapsible, setValue]),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionCollapsibleProvider, { scope: props.__scopeAccordion, collapsible, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionImpl, { ...accordionSingleProps, ref: forwardedRef }) })
      }
    );
  }
);
var AccordionImplMultiple = React.forwardRef((props, forwardedRef) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange = () => {
    },
    ...accordionMultipleProps
  } = props;
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue ?? [],
    onChange: onValueChange,
    caller: ACCORDION_NAME
  });
  const handleItemOpen = React.useCallback(
    (itemValue) => setValue((prevValue = []) => [...prevValue, itemValue]),
    [setValue]
  );
  const handleItemClose = React.useCallback(
    (itemValue) => setValue((prevValue = []) => prevValue.filter((value2) => value2 !== itemValue)),
    [setValue]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AccordionValueProvider,
    {
      scope: props.__scopeAccordion,
      value,
      onItemOpen: handleItemOpen,
      onItemClose: handleItemClose,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionCollapsibleProvider, { scope: props.__scopeAccordion, collapsible: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionImpl, { ...accordionMultipleProps, ref: forwardedRef }) })
    }
  );
});
var [AccordionImplProvider, useAccordionContext] = createAccordionContext(ACCORDION_NAME);
var AccordionImpl = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAccordion, disabled, dir, orientation = "vertical", ...accordionProps } = props;
    const accordionRef = React.useRef(null);
    const composedRefs = useComposedRefs(accordionRef, forwardedRef);
    const getItems = useCollection(__scopeAccordion);
    const direction = useDirection(dir);
    const isDirectionLTR = direction === "ltr";
    const handleKeyDown = composeEventHandlers(props.onKeyDown, (event) => {
      if (!ACCORDION_KEYS.includes(event.key)) return;
      const target = event.target;
      const triggerCollection = getItems().filter((item) => !item.ref.current?.disabled);
      const triggerIndex = triggerCollection.findIndex((item) => item.ref.current === target);
      const triggerCount = triggerCollection.length;
      if (triggerIndex === -1) return;
      event.preventDefault();
      let nextIndex = triggerIndex;
      const homeIndex = 0;
      const endIndex = triggerCount - 1;
      const moveNext = () => {
        nextIndex = triggerIndex + 1;
        if (nextIndex > endIndex) {
          nextIndex = homeIndex;
        }
      };
      const movePrev = () => {
        nextIndex = triggerIndex - 1;
        if (nextIndex < homeIndex) {
          nextIndex = endIndex;
        }
      };
      switch (event.key) {
        case "Home":
          nextIndex = homeIndex;
          break;
        case "End":
          nextIndex = endIndex;
          break;
        case "ArrowRight":
          if (orientation === "horizontal") {
            if (isDirectionLTR) {
              moveNext();
            } else {
              movePrev();
            }
          }
          break;
        case "ArrowDown":
          if (orientation === "vertical") {
            moveNext();
          }
          break;
        case "ArrowLeft":
          if (orientation === "horizontal") {
            if (isDirectionLTR) {
              movePrev();
            } else {
              moveNext();
            }
          }
          break;
        case "ArrowUp":
          if (orientation === "vertical") {
            movePrev();
          }
          break;
      }
      const clampedIndex = nextIndex % triggerCount;
      triggerCollection[clampedIndex].ref.current?.focus();
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AccordionImplProvider,
      {
        scope: __scopeAccordion,
        disabled,
        direction: dir,
        orientation,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: __scopeAccordion, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            ...accordionProps,
            "data-orientation": orientation,
            ref: composedRefs,
            onKeyDown: disabled ? void 0 : handleKeyDown
          }
        ) })
      }
    );
  }
);
var ITEM_NAME = "AccordionItem";
var [AccordionItemProvider, useAccordionItemContext] = createAccordionContext(ITEM_NAME);
var AccordionItem$1 = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAccordion, value, ...accordionItemProps } = props;
    const accordionContext = useAccordionContext(ITEM_NAME, __scopeAccordion);
    const valueContext = useAccordionValueContext(ITEM_NAME, __scopeAccordion);
    const collapsibleScope = useCollapsibleScope(__scopeAccordion);
    const triggerId = useId();
    const open = value && valueContext.value.includes(value) || false;
    const disabled = accordionContext.disabled || props.disabled;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AccordionItemProvider,
      {
        scope: __scopeAccordion,
        open,
        disabled,
        triggerId,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Root,
          {
            "data-orientation": accordionContext.orientation,
            "data-state": getState(open),
            ...collapsibleScope,
            ...accordionItemProps,
            ref: forwardedRef,
            disabled,
            open,
            onOpenChange: (open2) => {
              if (open2) {
                valueContext.onItemOpen(value);
              } else {
                valueContext.onItemClose(value);
              }
            }
          }
        )
      }
    );
  }
);
AccordionItem$1.displayName = ITEM_NAME;
var HEADER_NAME = "AccordionHeader";
var AccordionHeader = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAccordion, ...headerProps } = props;
    const accordionContext = useAccordionContext(ACCORDION_NAME, __scopeAccordion);
    const itemContext = useAccordionItemContext(HEADER_NAME, __scopeAccordion);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.h3,
      {
        "data-orientation": accordionContext.orientation,
        "data-state": getState(itemContext.open),
        "data-disabled": itemContext.disabled ? "" : void 0,
        ...headerProps,
        ref: forwardedRef
      }
    );
  }
);
AccordionHeader.displayName = HEADER_NAME;
var TRIGGER_NAME = "AccordionTrigger";
var AccordionTrigger$1 = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAccordion, ...triggerProps } = props;
    const accordionContext = useAccordionContext(ACCORDION_NAME, __scopeAccordion);
    const itemContext = useAccordionItemContext(TRIGGER_NAME, __scopeAccordion);
    const collapsibleContext = useAccordionCollapsibleContext(TRIGGER_NAME, __scopeAccordion);
    const collapsibleScope = useCollapsibleScope(__scopeAccordion);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.ItemSlot, { scope: __scopeAccordion, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Trigger,
      {
        "aria-disabled": itemContext.open && !collapsibleContext.collapsible || void 0,
        "data-orientation": accordionContext.orientation,
        id: itemContext.triggerId,
        ...collapsibleScope,
        ...triggerProps,
        ref: forwardedRef
      }
    ) });
  }
);
AccordionTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "AccordionContent";
var AccordionContent$1 = React.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAccordion, ...contentProps } = props;
    const accordionContext = useAccordionContext(ACCORDION_NAME, __scopeAccordion);
    const itemContext = useAccordionItemContext(CONTENT_NAME, __scopeAccordion);
    const collapsibleScope = useCollapsibleScope(__scopeAccordion);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Content,
      {
        role: "region",
        "aria-labelledby": itemContext.triggerId,
        "data-orientation": accordionContext.orientation,
        ...collapsibleScope,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ["--radix-accordion-content-height"]: "var(--radix-collapsible-content-height)",
          ["--radix-accordion-content-width"]: "var(--radix-collapsible-content-width)",
          ...props.style
        }
      }
    );
  }
);
AccordionContent$1.displayName = CONTENT_NAME;
function getState(open) {
  return open ? "open" : "closed";
}
var Root2 = Accordion$1;
var Item = AccordionItem$1;
var Header = AccordionHeader;
var Trigger2 = AccordionTrigger$1;
var Content2 = AccordionContent$1;

const Accordion = Root2;
const AccordionItem = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Item,
  {
    ref,
    className: cn("border-b", className),
    ...props
  }
));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { className: "flex", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Trigger2,
  {
    ref,
    className: cn(
      "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })
    ]
  }
) }));
AccordionTrigger.displayName = Trigger2.displayName;
const AccordionContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("pb-4 pt-0", className), children })
  }
));
AccordionContent.displayName = Content2.displayName;

const apiEndpoints = [
  {
    method: "GET",
    path: "/api/customers",
    description: "Retrieve a list of all customers",
    responses: [
      {
        name: "Response",
        example: {
          customers: [
            {
              id: 1,
              name: "John Doe",
              email: "john@example.com"
            },
            {
              id: 2,
              name: "Jane Smith",
              email: "jane@example.com"
            }
          ]
        },
        description: "Returns an array of customer objects"
      },
      {
        name: "Response (with subscriptions)",
        example: {
          customers: [
            {
              id: 1,
              name: "John Doe",
              email: "john@example.com",
              subscription: {
                id: 1,
                status: "active"
              }
            },
            {
              id: 2,
              name: "Jane Smith",
              email: "jane@example.com"
            }
          ]
        },
        description: "If subscriptions are active for a customer, some information about the subscription will be included in the response."
      }
    ]
  },
  {
    method: "POST",
    path: "/api/customers",
    description: "Create a new customer",
    parameters: [
      {
        name: "name",
        type: "string",
        required: true,
        description: "Name of the customer"
      },
      {
        name: "email",
        type: "string",
        required: true,
        description: "Email address of the customer"
      },
      {
        name: "notes",
        type: "string",
        required: false,
        description: "Notes about the customer"
      }
    ],
    requestBody: {
      example: {
        name: "John Doe",
        email: "john@example.com",
        notes: "This is a note"
      }
    },
    responses: [
      {
        name: "Response",
        example: {
          message: "Customer created successfully",
          success: true
        }
      }
    ]
  },
  {
    method: "GET",
    path: "/api/customers/:id",
    description: "Retrieve a single customer",
    parameters: [
      {
        name: "id",
        type: "string",
        required: true,
        description: "ID of the customer"
      }
    ],
    responses: [
      {
        name: "Response",
        example: {
          customer: {
            id: 1,
            name: "John Doe",
            email: "john@example.com"
          }
        },
        description: "Returns a customer object"
      }
    ]
  },
  {
    method: "GET",
    path: "/api/subscriptions",
    description: "Retrieve a list of all subscriptions",
    responses: [
      {
        example: {
          subscriptions: [
            {
              id: 1,
              name: "Basic",
              description: "$9.99 per month",
              price: 9.99,
              created_at: "2023-01-01T00:00:00.000Z",
              updated_at: "2023-01-01T00:00:00.000Z"
            },
            {
              id: 2,
              name: "Pro",
              description: "$19.99 per month",
              price: 19.99,
              created_at: "2023-01-01T00:00:00.000Z",
              updated_at: "2023-01-01T00:00:00.000Z"
            }
          ]
        },
        description: "Returns an array of subscription objects"
      }
    ]
  },
  {
    method: "POST",
    path: "/api/subscriptions",
    description: "Create a new subscription",
    parameters: [
      {
        name: "name",
        type: "string",
        required: true,
        description: "Name of the subscription"
      },
      {
        name: "description",
        type: "string",
        required: false,
        description: "Description of the subscription"
      },
      {
        name: "price",
        type: "number",
        required: true,
        description: "Price of the subscription"
      },
      {
        name: "features",
        type: "array",
        required: false,
        description: "Array of feature objects"
      }
    ],
    requestBody: {
      example: {
        name: "Basic",
        description: "$9.99 per month",
        price: 9.99,
        features: [
          {
            name: "Feature 1",
            description: "This is a feature description"
          },
          {
            name: "Feature 2",
            description: "This is another feature description"
          }
        ]
      }
    },
    responses: [
      {
        name: "Response",
        example: {
          message: "Customer created successfully",
          success: true
        }
      }
    ]
  },
  {
    method: "GET",
    path: "/api/subscriptions/:id",
    description: "Retrieve a single subscription",
    parameters: [
      {
        name: "id",
        type: "string",
        required: true,
        description: "ID of the subscription"
      }
    ],
    responses: [
      {
        name: "Response",
        example: {
          subscription: {
            id: 1,
            name: "Basic",
            description: "$9.99 per month",
            price: 9.99,
            created_at: "2023-01-01T00:00:00.000Z",
            updated_at: "2023-01-01T00:00:00.000Z"
          }
        },
        description: "Returns a subscription object"
      }
    ]
  },
  {
    method: "GET",
    path: "/api/customer_subscriptions",
    description: "Retrieve a list of all customer subscriptions",
    responses: [
      {
        example: {
          customer_subscriptions: [
            {
              id: 1,
              customer_id: 1,
              subscription_id: 1,
              status: "active",
              subscription_starts_at: "2024-12-23 21:57:21",
              subscription_ends_at: 1734993633434,
              created_at: "2024-12-23 21:57:21",
              updated_at: "2024-12-23 21:57:21"
            }
          ]
        },
        description: "Returns an array of customer subscription objects"
      }
    ]
  },
  {
    method: "POST",
    path: "/api/customer-subscriptions",
    description: "Create a new customer subscription",
    parameters: [
      {
        name: "customer_id",
        type: "string",
        required: true,
        description: "ID of the customer"
      },
      {
        name: "subscription_id",
        type: "string",
        required: true,
        description: "ID of the subscription plan"
      },
      {
        name: "start_date",
        type: "string",
        required: true,
        description: "Start date of the subscription (ISO 8601 format)"
      },
      {
        name: "end_date",
        type: "string",
        required: false,
        description: "End date of the subscription (ISO 8601 format)"
      }
    ],
    requestBody: {
      example: {
        customer_id: "456",
        subscription_id: "789",
        start_date: "2024-01-01",
        end_date: "2025-01-01"
      }
    },
    responses: [
      {
        name: "Success Response",
        example: {
          message: "Customer subscription created successfully",
          success: true,
          customer_subscription: {
            id: "123",
            customer_id: "456",
            subscription_id: "789",
            status: "active",
            start_date: "2024-01-01",
            end_date: "2025-01-01",
            current_period_start: "2024-01-01",
            current_period_end: "2024-02-01",
            cancel_at_period_end: false,
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z"
          }
        }
      },
      {
        name: "Error Response",
        example: {
          message: "Couldn't create customer subscription",
          success: false
        }
      }
    ]
  },
  {
    method: "POST",
    path: "/api/customer/[:id]/workflow",
    description: "Start a workflow for a customer",
    parameters: [
      {
        name: "customer_id",
        type: "string",
        required: true,
        description: "ID of the customer"
      }
    ],
    responses: [
      {
        name: "Success Response",
        description: "Empty body with status code 202",
        example: null
      }
    ]
  }
];

const methodStyles = (method) => cn(method === "POST" ? "bg-green-700" : "");
const APIDocumentation = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn("space-y-4"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Authentication" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
          "All requests must be authenticated by passing the API token as a request header. The API token is configured using",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              className: "text-primary underline",
              href: "https://developers.cloudflare.com/workers/configuration/secrets/",
              children: "secrets"
            }
          ),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Supported header styles" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: "Authorization: Bearer $apiToken", readOnly: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: "Authorization: Token $apiToken", readOnly: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: "x-api-token: $apiToken", readOnly: true })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: apiEndpoints.map((endpoint, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: methodStyles(endpoint.method),
              variant: endpoint.method === "GET" ? "default" : endpoint.method === "POST" ? "destructive" : endpoint.method === "PUT" ? "outline" : "secondary",
              children: endpoint.method
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-sm font-mono", children: endpoint.path })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: endpoint.description })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Accordion, { type: "single", collapsible: true, children: [
        endpoint.parameters && endpoint.parameters.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "parameters", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { children: "Parameters" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: endpoint.parameters.map((param, paramIndex) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-sm font-mono", children: param.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: param.type }),
              param.required && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", children: "Required" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: param.description })
          ] }, paramIndex)) }) })
        ] }),
        endpoint.requestBody && /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "request", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { children: "Request Body" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-auto", children: JSON.stringify(endpoint.requestBody.example, null, 2) }),
            endpoint.requestBody.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2", children: endpoint.requestBody.description })
          ] })
        ] }),
        endpoint.responses.map((response, responseIndex) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          AccordionItem,
          {
            value: `response-${responseIndex}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { children: endpoint.responses.length === 1 ? "Response" : response.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-auto", children: JSON.stringify(response.example, null, 2) }),
                response.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2", children: response.description })
              ] })
            ]
          },
          responseIndex
        ))
      ] }) })
    ] }, index)) })
  ] });
};

const DashboardTabs = ({
  formTemplates = 12,
  subscriptions = 45,
  customers = 38,
  customerSubscriptions = 156,
  recentActivity = [
    {
      action: "New assessment created",
      user: "Dr. Smith",
      time: "2 minutes ago",
      type: "assessment"
    },
    {
      action: "Session completed",
      user: "Jane Doe",
      time: "15 minutes ago",
      type: "session"
    },
    {
      action: "Report generated",
      user: "Dr. Johnson",
      time: "1 hour ago",
      type: "report"
    }
  ]
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "overview", className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "overview", className: "text-sm", children: "Overview" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "analytics", className: "text-sm", children: "Analytics" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "clinical", className: "text-sm", children: "Clinical" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "api", className: "text-sm", children: "API" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "overview", className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-5 w-5 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Clinical Workflow Status" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Current status of clinical operations and assessments" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600", children: "Active Assessments" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                formTemplates,
                " forms"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-slate-200 rounded-full h-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-blue-600 h-2 rounded-full", style: { width: "75%" } }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600", children: "Compliance Rate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "98.5%" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-slate-200 rounded-full h-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-green-600 h-2 rounded-full", style: { width: "98.5%" } }) })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Recent Activity" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: recentActivity.map((activity, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start space-x-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `rounded-full p-1 mt-0.5 ${activity.type === "assessment" ? "bg-blue-100" : activity.type === "session" ? "bg-green-100" : activity.type === "report" ? "bg-purple-100" : "bg-orange-100"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-2 h-2 rounded-full ${activity.type === "assessment" ? "bg-blue-600" : activity.type === "session" ? "bg-green-600" : activity.type === "report" ? "bg-purple-600" : "bg-orange-600"}` }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-slate-900", children: activity.action }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500", children: activity.user }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400", children: activity.time })
          ] })
        ] }, index)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "analytics", className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Platform Subscriptions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Clinical subscription analytics" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-600", children: "Total Subscriptions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: subscriptions })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-600", children: "Active Customers" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: customers })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-600", children: "Customer Subscriptions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: customerSubscriptions })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "System Health" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Platform performance metrics" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { className: "border-green-200 bg-green-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-green-800", children: "All systems operational" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600", children: "API Response Time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 font-medium", children: "145ms" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600", children: "Database Connection" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 font-medium", children: "Healthy" })
            ] })
          ] })
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "clinical", className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-5 w-5 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Clinical Compliance Monitoring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "HIPAA, ASHA, and AOTA compliance tracking" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-4 bg-green-50 rounded-lg border border-green-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-green-700", children: "100%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-green-600", children: "HIPAA Compliance" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-4 bg-blue-50 rounded-lg border border-blue-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-blue-700", children: "100%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-blue-600", children: "ASHA Standards" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-4 bg-purple-50 rounded-lg border border-purple-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-purple-700", children: "100%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-purple-600", children: "AOTA Guidelines" })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "api", className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(APIDocumentation, {}) }) })
  ] });
};

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const title = "Dashboard";
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": title }, { "actions": ($$result2) => renderTemplate`${maybeRenderHead()}<div> <h1 class="text-3xl font-bold tracking-tight gradient-metallic-primary bg-clip-text text-transparent">
Dashboard
</h1> </div>`, "default": ($$result2) => renderTemplate`  <div class="space-y-4"> ${renderComponent($$result2, "DashboardTabs", DashboardTabs, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/admin/dashboard-tabs", "client:component-export": "DashboardTabs" })} </div> ` })}`;
}, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/admin/index.astro", void 0);

const $$file = "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=admin.astro.mjs.map
