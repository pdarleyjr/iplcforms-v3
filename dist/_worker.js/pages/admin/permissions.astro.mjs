globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BhDrV1PX.mjs';
import { $ as $$Layout } from '../../chunks/Layout_Cm10FlEX.mjs';
import { r as reactExports, j as jsxRuntimeExports, b as Checkbox$1, d as CheckboxIndicator, e as Check, L as LoaderCircle, f as Lock, h as CircleAlert, R as React, i as Save } from '../../chunks/react-vendor_BBaf1uT2.mjs';
import { e as cn, C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from '../../chunks/card_DRaKdq96.mjs';
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from '../../chunks/table_Ck_cmSKd.mjs';
import { B as Badge } from '../../chunks/badge_BpQ0bTPh.mjs';
import { B as Button } from '../../chunks/button_D4hUjemp.mjs';
import { A as Alert, a as AlertDescription } from '../../chunks/alert_oZX2k7yW.mjs';
import { P as PERMISSIONS, R as ROLES, a as RESOURCES } from '../../chunks/rbac_vK5lyOl9.mjs';
export { renderers } from '../../renderers.mjs';

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
