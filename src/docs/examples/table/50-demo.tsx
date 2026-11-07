// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
export const meta = {
  title: "Demo" as const,
  description: "Official `table-demo`: seven invoices with a caption, a header, a footer total and a right-aligned amount column. The ruling is pencil: a double rule under the header, a hand-pulled line under each row, the accountant's pair above the total. Row rules are painted by CSS, so a long table costs no drawing per row." as const,
  layout: "center" as const
};
const invoices = [{
  invoice: "INV001" as const,
  paymentStatus: "Paid" as const,
  totalAmount: "$250.00" as const,
  paymentMethod: "Credit Card" as const
}, {
  invoice: "INV002" as const,
  paymentStatus: "Pending" as const,
  totalAmount: "$150.00" as const,
  paymentMethod: "PayPal" as const
}, {
  invoice: "INV003" as const,
  paymentStatus: "Unpaid" as const,
  totalAmount: "$350.00" as const,
  paymentMethod: "Bank Transfer" as const
}, {
  invoice: "INV004" as const,
  paymentStatus: "Paid" as const,
  totalAmount: "$450.00" as const,
  paymentMethod: "Credit Card" as const
}, {
  invoice: "INV005" as const,
  paymentStatus: "Paid" as const,
  totalAmount: "$550.00" as const,
  paymentMethod: "PayPal" as const
}, {
  invoice: "INV006" as const,
  paymentStatus: "Pending" as const,
  totalAmount: "$200.00" as const,
  paymentMethod: "Bank Transfer" as const
}, {
  invoice: "INV007" as const,
  paymentStatus: "Unpaid" as const,
  totalAmount: "$300.00" as const,
  paymentMethod: "Credit Card" as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead class="text-end">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map(invoice => <TableRow key={invoice.invoice}>
            <TableCell class="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell class="text-end">{invoice.totalAmount}</TableCell>
          </TableRow>)}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colspan={3}>Total</TableCell>
          <TableCell class="text-end">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>;
  };
});
export default Example;
