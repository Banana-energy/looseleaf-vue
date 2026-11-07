// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
export const meta = {
  title: "Sticky header" as const,
  description: "`sticky` pins the header row while the body scrolls under it; `containerClassName=\"max-h-72\"` gives the scroller its height. The header carries the paper color (`--ll-table-bg`) and its own double rule." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const rows = Array.from({
  length: 24
}, (_, i) => ({
  id: i,
  day: days[i % 5],
  page: `Notebook, p. ${12 + i * 3}`,
  words: 180 + i * 97 % 640
}));
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Card seed="sticky-table" class="mx-auto w-full max-w-lg">
      <CardContent>
        <Table sticky containerClassName="max-h-72">
          <TableHeader>
            <TableRow>
              <TableHead>Day</TableHead>
              <TableHead>Page</TableHead>
              <TableHead class="text-end">Words</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(r => <TableRow key={r.id}>
                <TableCell>{r.day}</TableCell>
                <TableCell>{r.page}</TableCell>
                <TableCell class="ll-num text-end">{r.words}</TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
        <p class="mt-3 text-sm text-muted-foreground">Twenty-four pages: scroll the list, the head stays put.</p>
      </CardContent>
    </Card>;
  };
});
export default Example;
