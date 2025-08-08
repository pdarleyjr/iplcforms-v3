globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BhDrV1PX.mjs';
import { $ as $$Layout } from '../../chunks/Layout_Cm10FlEX.mjs';
import { r as reactExports, j as jsxRuntimeExports, T as Trigger, I as Icon, l as ChevronDown, m as ScrollUpButton, n as ChevronUp, o as ScrollDownButton, P as Portal, p as Content2, V as Viewport, q as Label, s as Item, t as ItemIndicator, e as Check, v as ItemText, w as Separator, x as Root2, y as Value, L as LoaderCircle, S as Shield, h as CircleAlert, U as UserCheck } from '../../chunks/react-vendor_BBaf1uT2.mjs';
import { e as cn, C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from '../../chunks/card_DRaKdq96.mjs';
import { B as Button } from '../../chunks/button_D4hUjemp.mjs';
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from '../../chunks/table_Ck_cmSKd.mjs';
import { I as Input } from '../../chunks/input_BA3f0EGX.mjs';
import { B as Badge } from '../../chunks/badge_BpQ0bTPh.mjs';
import { A as Alert, a as AlertDescription } from '../../chunks/alert_oZX2k7yW.mjs';
import { R as ROLES } from '../../chunks/rbac_vK5lyOl9.mjs';
export { renderers } from '../../renderers.mjs';

const Select = Root2;
const SelectValue = Value;
const SelectTrigger = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Trigger,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-[hsl(var(--iplc-neutral-200))] bg-background px-3 py-2 text-sm shadow-[var(--iplc-shadow-sm)] transition-all duration-200",
      "hover:border-[hsl(var(--iplc-primary))] hover:shadow-[var(--iplc-shadow-md)]",
      "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--iplc-accent-sky))] focus:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "placeholder:text-muted-foreground [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 opacity-50 transition-transform duration-200 data-[state=open]:rotate-180" }) })
    ]
  }
));
SelectTrigger.displayName = Trigger.displayName;
const SelectScrollUpButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollUpButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = ScrollUpButton.displayName;
const SelectScrollDownButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollDownButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = ScrollDownButton.displayName;
const SelectContent = reactExports.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Content2,
  {
    ref,
    className: cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-[hsl(var(--iplc-neutral-200))] bg-popover text-popover-foreground shadow-[var(--iplc-shadow-lg)]",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = Content2.displayName;
const SelectLabel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = Label.displayName;
const SelectItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none transition-colors duration-150",
      "focus:bg-[hsl(var(--iplc-accent-sky)_/_0.1)] focus:text-[hsl(var(--iplc-primary))]",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-[hsl(var(--iplc-primary))]" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ItemText, { children })
    ]
  }
));
SelectItem.displayName = Item.displayName;
const SelectSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = Separator.displayName;

function RoleManager() {
  const [users, setUsers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [selectedUser, setSelectedUser] = reactExports.useState(null);
  const [updating, setUpdating] = reactExports.useState(false);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  reactExports.useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/users", {
        headers: {
          "X-Customer-ID": localStorage.getItem("customerId") || ""
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  const updateUserRole = async (userId, newRole) => {
    try {
      setUpdating(true);
      setError(null);
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Customer-ID": localStorage.getItem("customerId") || ""
        },
        body: JSON.stringify({ role: newRole })
      });
      if (!response.ok) {
        throw new Error("Failed to update user role");
      }
      setUsers(users.map(
        (user) => user.id === userId ? { ...user, role: newRole } : user
      ));
      setSelectedUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setUpdating(false);
    }
  };
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return user.email.toLowerCase().includes(searchLower) || user.name.toLowerCase().includes(searchLower) || user.role.toLowerCase().includes(searchLower) || user.organization && user.organization.toLowerCase().includes(searchLower);
  });
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "clinician":
        return "default";
      case "researcher":
        return "secondary";
      case "patient":
        return "outline";
      default:
        return "default";
    }
  };
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "active":
        return "secondary";
      case "suspended":
        return "destructive";
      case "pending":
        return "outline";
      default:
        return "default";
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5" }),
        "Role Management"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Manage user roles and permissions across the system" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
      error && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", className: "mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: error })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Search users by email, name, role, or organization...",
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
          className: "max-w-md"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "User" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Organization" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Last Login" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filteredUsers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 6, className: "text-center text-muted-foreground", children: "No users found" }) }) : filteredUsers.map((user) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: user.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: user.email }),
            user.license_number && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              "License: ",
              user.license_number
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: getRoleBadgeColor(user.role), children: user.role }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: user.organization || "-" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: getStatusBadgeColor(user.status), children: user.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: user.last_login_at ? new Date(user.last_login_at).toLocaleString() : "Never" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: selectedUser === user.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                defaultValue: user.role,
                onValueChange: (value) => updateUserRole(user.id, value),
                disabled: updating,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-32", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.keys(ROLES).map((role) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: role, children: role }, role)) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => setSelectedUser(null),
                disabled: updating,
                children: "Cancel"
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => setSelectedUser(user.id),
              className: "flex items-center gap-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "h-4 w-4" }),
                "Change Role"
              ]
            }
          ) })
        ] }, user.id)) })
      ] }) })
    ] })
  ] });
}

const $$Astro = createAstro();
const $$Users = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Users;
  const customerId = Astro2.cookies.get("customerId");
  const customerRole = Astro2.cookies.get("customerRole");
  if (!customerId || customerRole?.value !== "admin") {
    return Astro2.redirect("/login");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "User Management - Admin" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto py-8"> <div class="mb-8"> <h1 class="text-3xl font-bold">User Management</h1> <p class="text-muted-foreground mt-2">
Manage user roles and permissions
</p> </div> ${renderComponent($$result2, "RoleManager", RoleManager, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/components/admin/RoleManager", "client:component-export": "RoleManager" })} </div> ` })}`;
}, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/admin/users.astro", void 0);

const $$file = "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/admin/users.astro";
const $$url = "/admin/users";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Users,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=users.astro.mjs.map
