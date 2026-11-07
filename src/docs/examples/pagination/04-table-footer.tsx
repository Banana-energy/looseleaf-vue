// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Icon } from "@/components/ui/icon";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
export const meta = {
  title: "Table footer (composed)" as const,
  description: "A real use: twenty-three notebooks, five to a page. The range under the table and the current number follow the page, and the links keep real hrefs for people who open them in a new tab." as const,
  layout: "center" as const,
  height: 440
};
const SIZE = 5;
const ROWS = Array.from({
  length: 23
}, (_, i) => ({
  name: ["Field notes", "Garden log", "Recipes", "Trip to Lisbon", "Sketches", "Reading list", "Letters", "Budget"][i % 8] + (i >= 8 ? ` ${Math.floor(i / 8) + 1}` : "" as const),
  pages: 12 + i * 37 % 90
}));
const PAGES = Math.ceil(ROWS.length / SIZE);
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const page = shallowRef(initialState(1));
  const setPage = stateSetter(page);
  const go = computed(() => (n: number) => (e: MouseEvent) => {
    e.preventDefault();
    setPage(Math.min(PAGES, Math.max(1, n)));
  });
  const from = computed(() => (page.value - 1) * SIZE);
  const rows = computed(() => ROWS.slice(from.value, from.value + SIZE));
  return () => {
    return <div class="grid w-full max-w-md gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Notebook</TableHead>
            <TableHead class="text-end">Pages</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.value.map(r => <TableRow key={r.name}>
              <TableCell>{r.name}</TableCell>
              <TableCell class="text-end ll-num">{r.pages}</TableCell>
            </TableRow>)}
        </TableBody>
      </Table>
      <div class="flex items-center justify-between gap-3">
        <p class="text-sm text-muted-foreground" aria-live="polite">
          {from.value + 1}–{from.value + rows.value.length} of {ROWS.length}
        </p>
        <Pagination class="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href={`#p${page.value - 1}`} aria-label="Go to previous page" disabled={page.value === 1} onClick={go.value(page.value - 1)}>
                <Icon name="chevron-left" />
              </PaginationLink>
            </PaginationItem>
            {Array.from({
              length: PAGES
            }, (_, i) => i + 1).map(n => <PaginationItem key={n}>
                <PaginationLink href={`#p${n}`} isActive={n === page.value} aria-label={`Page ${n}`} onClick={go.value(n)}>
                  {n}
                </PaginationLink>
              </PaginationItem>)}
            <PaginationItem>
              <PaginationLink href={`#p${page.value + 1}`} aria-label="Go to next page" disabled={page.value === PAGES} onClick={go.value(page.value + 1)}>
                <Icon name="chevron-right" />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>;
  };
});
export default Example;
