// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
export const meta = {
  title: "Invoices" as const,
  description: "The whole family: a header with a double rule, rows ruled by hand in pencil, a footer with its own double rule and a caption written underneath. Hover a row to see the swipe." as const,
  layout: "stack" as const
};
const invoices = [{
  invoice: "INV001" as const,
  status: "Paid" as const,
  method: "Credit card" as const,
  amount: "$250.00" as const
}, {
  invoice: "INV002" as const,
  status: "Pending" as const,
  method: "PayPal" as const,
  amount: "$150.00" as const
}, {
  invoice: "INV003" as const,
  status: "Unpaid" as const,
  method: "Bank transfer" as const,
  amount: "$350.00" as const
}, {
  invoice: "INV004" as const,
  status: "Paid" as const,
  method: "Credit card" as const,
  amount: "$450.00" as const
}, {
  invoice: "INV005" as const,
  status: "Paid" as const,
  method: "PayPal" as const,
  amount: "$550.00" as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Table class="max-w-xl">
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead class="w-28">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead class="text-end">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map(row => <TableRow key={row.invoice}>
            <TableCell class="font-bold">{row.invoice}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell>{row.method}</TableCell>
            <TableCell class="ll-num text-end">{row.amount}</TableCell>
          </TableRow>)}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colspan={3}>Total</TableCell>
          <TableCell class="ll-num text-end">$1,750.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>;
  };
});
export default Example;
