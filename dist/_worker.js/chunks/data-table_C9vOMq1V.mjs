globalThis.process ??= {}; globalThis.process.env ??= {};
import { j as jsxRuntimeExports, k as flexRender } from './react-vendor_BBaf1uT2.mjs';
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from './table_Ck_cmSKd.mjs';

function DataTable({ table }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: table.getHeaderGroups().map((headerGroup) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: headerGroup.headers.map((header) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: header.isPlaceholder ? null : flexRender(
      header.column.columnDef.header,
      header.getContext()
    ) }, header.id)) }, headerGroup.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: table.getRowModel().rows?.length ? table.getRowModel().rows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      TableRow,
      {
        "data-state": row.getIsSelected() && "selected",
        children: row.getVisibleCells().map((cell) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: flexRender(cell.column.columnDef.cell, cell.getContext()) }, cell.id))
      },
      row.id
    )) : /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: table.getAllColumns().length, className: "h-24 text-center", children: "No results." }) }) })
  ] });
}

export { DataTable as D };
//# sourceMappingURL=data-table_C9vOMq1V.mjs.map
