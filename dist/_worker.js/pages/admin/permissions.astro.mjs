globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Cd9lk-7F.mjs';
import { $ as $$Layout } from '../../chunks/Layout_Cvn2ksVx.mjs';
import { j as jsxRuntimeExports, e as cn, C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from '../../chunks/card_CmFEFEbr.mjs';
import { a as reactExports, R as React } from '../../chunks/_@astro-renderers_BIJ3dQRj.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_BIJ3dQRj.mjs';
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from '../../chunks/table_CjuqCPRW.mjs';
import { u as useComposedRefs, B as Button } from '../../chunks/button_B9vnY3WY.mjs';
import { c as createContextScope, u as useControllableState, a as composeEventHandlers } from '../../chunks/index_CcZ-Jgsd.mjs';
import { u as usePrevious } from '../../chunks/index_B5aG8GrP.mjs';
import { u as useSize, L as LoaderCircle, C as CircleAlert } from '../../chunks/index_DgoZ8Qi8.mjs';
import { P as Presence } from '../../chunks/index_DvdPJZ5U.mjs';
import { P as Primitive, A as Alert, a as AlertDescription } from '../../chunks/alert_W4kakS3Y.mjs';
import { C as Check } from '../../chunks/check_BlBiI3Is.mjs';
import { B as Badge } from '../../chunks/badge_bicgCY70.mjs';
import { P as PERMISSIONS, R as ROLES, a as RESOURCES } from '../../chunks/rbac_vK5lyOl9.mjs';
import { c as createLucideIcon } from '../../chunks/createLucideIcon_BcqoDbb6.mjs';

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$1 = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode$1);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode);

var CHECKBOX_NAME = "Checkbox";
var [createCheckboxContext, createCheckboxScope] = createContextScope(CHECKBOX_NAME);
var [CheckboxProviderImpl, useCheckboxContext] = createCheckboxContext(CHECKBOX_NAME);
function CheckboxProvider(props) {
  const {
    __scopeCheckbox,
    checked: checkedProp,
    children,
    defaultChecked,
    disabled,
    form,
    name,
    onCheckedChange,
    required,
    value = "on",
    // @ts-expect-error
    internal_do_not_use_render
  } = props;
  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: CHECKBOX_NAME
  });
  const [control, setControl] = reactExports.useState(null);
  const [bubbleInput, setBubbleInput] = reactExports.useState(null);
  const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
  const isFormControl = control ? !!form || !!control.closest("form") : (
    // We set this to true by default so that events bubble to forms without JS (SSR)
    true
  );
  const context = {
    checked,
    disabled,
    setChecked,
    control,
    setControl,
    name,
    form,
    value,
    hasConsumerStoppedPropagationRef,
    required,
    defaultChecked: isIndeterminate(defaultChecked) ? false : defaultChecked,
    isFormControl,
    bubbleInput,
    setBubbleInput
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CheckboxProviderImpl,
    {
      scope: __scopeCheckbox,
      ...context,
      children: isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children
    }
  );
}
var TRIGGER_NAME = "CheckboxTrigger";
var CheckboxTrigger = reactExports.forwardRef(
  ({ __scopeCheckbox, onKeyDown, onClick, ...checkboxProps }, forwardedRef) => {
    const {
      control,
      value,
      disabled,
      checked,
      required,
      setControl,
      setChecked,
      hasConsumerStoppedPropagationRef,
      isFormControl,
      bubbleInput
    } = useCheckboxContext(TRIGGER_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setControl);
    const initialCheckedStateRef = reactExports.useRef(checked);
    reactExports.useEffect(() => {
      const form = control?.form;
      if (form) {
        const reset = () => setChecked(initialCheckedStateRef.current);
        form.addEventListener("reset", reset);
        return () => form.removeEventListener("reset", reset);
      }
    }, [control, setChecked]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        role: "checkbox",
        "aria-checked": isIndeterminate(checked) ? "mixed" : checked,
        "aria-required": required,
        "data-state": getState(checked),
        "data-disabled": disabled ? "" : void 0,
        disabled,
        value,
        ...checkboxProps,
        ref: composedRefs,
        onKeyDown: composeEventHandlers(onKeyDown, (event) => {
          if (event.key === "Enter") event.preventDefault();
        }),
        onClick: composeEventHandlers(onClick, (event) => {
          setChecked((prevChecked) => isIndeterminate(prevChecked) ? true : !prevChecked);
          if (bubbleInput && isFormControl) {
            hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
            if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
          }
        })
      }
    );
  }
);
CheckboxTrigger.displayName = TRIGGER_NAME;
var Checkbox$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeCheckbox,
      name,
      checked,
      defaultChecked,
      required,
      disabled,
      value,
      onCheckedChange,
      form,
      ...checkboxProps
    } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CheckboxProvider,
      {
        __scopeCheckbox,
        checked,
        defaultChecked,
        disabled,
        required,
        onCheckedChange,
        name,
        form,
        value,
        internal_do_not_use_render: ({ isFormControl }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxTrigger,
            {
              ...checkboxProps,
              ref: forwardedRef,
              __scopeCheckbox
            }
          ),
          isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxBubbleInput,
            {
              __scopeCheckbox
            }
          )
        ] })
      }
    );
  }
);
Checkbox$1.displayName = CHECKBOX_NAME;
var INDICATOR_NAME = "CheckboxIndicator";
var CheckboxIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeCheckbox, forceMount, ...indicatorProps } = props;
    const context = useCheckboxContext(INDICATOR_NAME, __scopeCheckbox);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Presence,
      {
        present: forceMount || isIndeterminate(context.checked) || context.checked === true,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            "data-state": getState(context.checked),
            "data-disabled": context.disabled ? "" : void 0,
            ...indicatorProps,
            ref: forwardedRef,
            style: { pointerEvents: "none", ...props.style }
          }
        )
      }
    );
  }
);
CheckboxIndicator.displayName = INDICATOR_NAME;
var BUBBLE_INPUT_NAME = "CheckboxBubbleInput";
var CheckboxBubbleInput = reactExports.forwardRef(
  ({ __scopeCheckbox, ...props }, forwardedRef) => {
    const {
      control,
      hasConsumerStoppedPropagationRef,
      checked,
      defaultChecked,
      required,
      disabled,
      name,
      value,
      form,
      bubbleInput,
      setBubbleInput
    } = useCheckboxContext(BUBBLE_INPUT_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = bubbleInput;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      const bubbles = !hasConsumerStoppedPropagationRef.current;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        input.indeterminate = isIndeterminate(checked);
        setChecked.call(input, isIndeterminate(checked) ? false : checked);
        input.dispatchEvent(event);
      }
    }, [bubbleInput, prevChecked, checked, hasConsumerStoppedPropagationRef]);
    const defaultCheckedRef = reactExports.useRef(isIndeterminate(checked) ? false : checked);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.input,
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: defaultChecked ?? defaultCheckedRef.current,
        required,
        disabled,
        name,
        value,
        form,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: "translateX(-100%)"
        }
      }
    );
  }
);
CheckboxBubbleInput.displayName = BUBBLE_INPUT_NAME;
function isFunction(value) {
  return typeof value === "function";
}
function isIndeterminate(checked) {
  return checked === "indeterminate";
}
function getState(checked) {
  return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}

const Checkbox = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Checkbox$1,
  {
    ref,
    className: cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-[hsl(var(--iplc-neutral-700))] bg-background shadow-[var(--iplc-shadow-sm)] transition-all duration-200",
      "hover:border-[hsl(var(--iplc-primary))] hover:shadow-[var(--iplc-shadow-md)]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--iplc-accent-sky))] focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:border-transparent data-[state=checked]:bg-[var(--iplc-gradient-primary)] data-[state=checked]:text-white",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      CheckboxIndicator,
      {
        className: cn("flex items-center justify-center text-current"),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 font-bold" })
      }
    )
  }
));
Checkbox.displayName = Checkbox$1.displayName;

function PermissionMatrix() {
  const [permissionData, setPermissionData] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [modifiedPermissions, setModifiedPermissions] = reactExports.useState(/* @__PURE__ */ new Set());
  reactExports.useEffect(() => {
    fetchPermissions();
  }, []);
  const fetchPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/permissions", {
        headers: {
          "X-Customer-ID": localStorage.getItem("customerId") || ""
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch permissions");
      }
      const data = await response.json();
      setPermissionData(data.permissions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  const hasPermission = (role, resource, permission) => {
    const roleData = permissionData.find((p) => p.role === role);
    return roleData?.permissions[resource]?.includes(permission) || false;
  };
  const togglePermission = (role, resource, permission) => {
    const updatedData = permissionData.map((roleData) => {
      if (roleData.role === role) {
        const resourcePermissions = roleData.permissions[resource] || [];
        const hasPermission2 = resourcePermissions.includes(permission);
        return {
          ...roleData,
          permissions: {
            ...roleData.permissions,
            [resource]: hasPermission2 ? resourcePermissions.filter((p) => p !== permission) : [...resourcePermissions, permission]
          }
        };
      }
      return roleData;
    });
    setPermissionData(updatedData);
    setModifiedPermissions(/* @__PURE__ */ new Set([...modifiedPermissions, `${role}-${resource}-${permission}`]));
  };
  const savePermissions = async () => {
    try {
      setSaving(true);
      setError(null);
      const response = await fetch("/api/admin/permissions", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Customer-ID": localStorage.getItem("customerId") || ""
        },
        body: JSON.stringify({ permissions: permissionData })
      });
      if (!response.ok) {
        throw new Error("Failed to save permissions");
      }
      setModifiedPermissions(/* @__PURE__ */ new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-5 w-5" }),
        "Permission Matrix"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Configure permissions for each role across different resources" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
      error && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", className: "mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: error })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { className: "min-w-[800px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "sticky left-0 bg-background", children: "Resource" }),
          Object.keys(PERMISSIONS).map((permission) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center gap-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium uppercase", children: permission }) }) }, permission))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: Object.keys(ROLES).map((role) => /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { className: "bg-muted/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: Object.keys(PERMISSIONS).length + 1, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: role === "admin" ? "destructive" : "default", children: role.toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
              role === "admin" && "(Has all permissions)",
              role === "patient" && "(Limited to own data)"
            ] })
          ] }) }) }),
          Object.keys(RESOURCES).map((resource) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "sticky left-0 bg-background font-medium", children: resource.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) }),
            Object.keys(PERMISSIONS).map((permission) => {
              const isAllowed = hasPermission(role, resource, permission);
              const isModified = modifiedPermissions.has(`${role}-${resource}-${permission}`);
              const isDisabled = role === "admin" || role === "patient" && !["own_submissions", "own_profile"].includes(resource);
              return /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Checkbox,
                {
                  checked: isAllowed,
                  disabled: isDisabled,
                  onCheckedChange: () => togglePermission(role, resource, permission),
                  className: isModified ? "border-blue-500" : ""
                }
              ) }) }, permission);
            })
          ] }, `${role}-${resource}`))
        ] }, role)) })
      ] }) }),
      modifiedPermissions.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: savePermissions,
          disabled: saving,
          className: "flex items-center gap-2",
          children: [
            saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
            "Save Changes (",
            modifiedPermissions.size,
            ")"
          ]
        }
      ) })
    ] })
  ] });
}

const $$Astro = createAstro();
const $$Permissions = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Permissions;
  const customerId = Astro2.cookies.get("customerId");
  const customerRole = Astro2.cookies.get("customerRole");
  if (!customerId || customerRole?.value !== "admin") {
    return Astro2.redirect("/login");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Permission Management - Admin" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto py-8"> <div class="mb-8"> <h1 class="text-3xl font-bold">Permission Management</h1> <p class="text-muted-foreground mt-2">
Configure role-based access control permissions
</p> </div> ${renderComponent($$result2, "PermissionMatrix", PermissionMatrix, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/components/admin/PermissionMatrix", "client:component-export": "PermissionMatrix" })} </div> ` })}`;
}, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/admin/permissions.astro", void 0);

const $$file = "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/admin/permissions.astro";
const $$url = "/admin/permissions";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Permissions,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=permissions.astro.mjs.map
