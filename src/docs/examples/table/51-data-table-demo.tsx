// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
export const meta = {
  title: "Data table demo" as const,
  description: "Official `data-table-demo`, rebuilt with plain Vue state and no TanStack: filter the emails, sort the Email column, hide columns from the Columns menu, tick rows (the header box goes half-ticked when only some of a page are), and page with Previous and Next. Chosen rows are a highlighter swipe. The original's five rows fit on one page, so this one has twelve at five a page. The bordered, rounded wrapper is left off: the table is already ruled by hand." as const,
  layout: "center" as const,
  height: 460
};
type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};
const data: Payment[] = [{
  id: "m5gr84i9" as const,
  amount: 316,
  status: "success" as const,
  email: "ken99@example.com" as const
}, {
  id: "3u1reuv4" as const,
  amount: 242,
  status: "success" as const,
  email: "Abe45@example.com" as const
}, {
  id: "derv1ws0" as const,
  amount: 837,
  status: "processing" as const,
  email: "Monserrat44@example.com" as const
}, {
  id: "5kma53ae" as const,
  amount: 874,
  status: "success" as const,
  email: "Silas22@example.com" as const
}, {
  id: "bhqecj4p" as const,
  amount: 721,
  status: "failed" as const,
  email: "carmella@example.com" as const
}, {
  id: "p0d9x2lq" as const,
  amount: 129,
  status: "pending" as const,
  email: "jo.okafor@example.com" as const
}, {
  id: "v7t3n8ws" as const,
  amount: 458,
  status: "success" as const,
  email: "mika.k@example.com" as const
}, {
  id: "c2h6y1rb" as const,
  amount: 63,
  status: "failed" as const,
  email: "sam.reyes@example.com" as const
}, {
  id: "k9f4a5ze" as const,
  amount: 590,
  status: "processing" as const,
  email: "priya@example.com" as const
}, {
  id: "x3m8u0dj" as const,
  amount: 205,
  status: "success" as const,
  email: "tomas.berg@example.com" as const
}, {
  id: "q1w7e5tn" as const,
  amount: 912,
  status: "pending" as const,
  email: "lena.f@example.com" as const
}, {
  id: "z6b2g4ho" as const,
  amount: 377,
  status: "success" as const,
  email: "omar@example.com" as const
}];
const PAGE_SIZE = 5;
const HIDEABLE = ["status", "email", "amount"] as const;
type ColumnId = typeof HIDEABLE[number];
type SortDirection = "asc" | "desc";
const dollars = new Intl.NumberFormat("en-US", {
  style: "currency" as const,
  currency: "USD" as const
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const sorting = shallowRef<SortDirection | null>(initialState(null));
  const setSorting = stateSetter(sorting);
  const filter = shallowRef(initialState(""));
  const setFilter = stateSetter(filter);
  const visibility = shallowRef<Record<ColumnId, boolean>>(initialState({
    status: true,
    email: true,
    amount: true
  }));
  const setVisibility = stateSetter(visibility);
  const selection = shallowRef<ReadonlySet<string>>(initialState(new Set()));
  const setSelection = stateSetter(selection);
  const pageIndex = shallowRef(initialState(0));
  const setPageIndex = stateSetter(pageIndex);
  const rows = computed(() => {
    const found = data.filter(p => p.email.toLowerCase().includes(filter.value.toLowerCase()));
    if (!sorting.value) return found;
    const sign = sorting.value === "asc" ? 1 : -1;
    return [...found].sort((a, b) => a.email.localeCompare(b.email, "en", {
      sensitivity: "base" as const
    }) * sign);
  });
  const pageCount = computed(() => Math.max(1, Math.ceil(rows.value.length / PAGE_SIZE)));
  const page = computed(() => Math.min(pageIndex.value, pageCount.value - 1));
  const pageRows = computed(() => rows.value.slice(page.value * PAGE_SIZE, (page.value + 1) * PAGE_SIZE));
  const chosenOnPage = computed(() => pageRows.value.filter(p => selection.value.has(p.id)).length);
  const chosenInFilter = computed(() => rows.value.filter(p => selection.value.has(p.id)).length);
  const columnCount = computed(() => 2 + HIDEABLE.filter(id => visibility.value[id]).length);
  const toggleRows = computed(() => (ids: string[], on: boolean) => setSelection(prev => {
    const next = new Set(prev);
    for (const id of ids) {
      if (on) next.add(id);else next.delete(id);
    }
    return next;
  }));
  return () => {
    return <div class="w-full">
      <div class="flex items-center py-4">
        <Input placeholder="Filter emails..." aria-label="Filter emails" value={filter.value} onChange={(event: Event) => {
          setFilter((event.target as HTMLInputElement).value);
          setPageIndex(0);
        }} class="max-w-sm" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" class="ms-auto">
              Columns <Icon name="chevron-down" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {HIDEABLE.map(id => <DropdownMenuCheckboxItem key={id} class="capitalize" checked={visibility.value[id]} onCheckedChange={value => setVisibility(prev => ({
              ...prev,
              [id]: !!value
            }))}>
                {id}
              </DropdownMenuCheckboxItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox checked={pageRows.value.length > 0 && chosenOnPage.value === pageRows.value.length ? true : chosenOnPage.value > 0 ? "indeterminate" as const : false} onCheckedChange={value => toggleRows.value(pageRows.value.map(p => p.id), !!value)} aria-label="Select all" />
            </TableHead>
            {visibility.value.status && <TableHead>Status</TableHead>}
            {visibility.value.email && <TableHead aria-sort={sorting.value === "asc" ? "ascending" as const : sorting.value === "desc" ? "descending" as const : "none" as const}>
                <Button variant="ghost" class="-ms-3" onClick={() => setSorting(s => s === "asc" ? "desc" as const : "asc" as const)}>
                  Email
                  <Icon name="arrow-up-down" />
                </Button>
              </TableHead>}
            {visibility.value.amount && <TableHead class="text-end">Amount</TableHead>}
            <TableHead>
              <span class="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageRows.value.length ? pageRows.value.map(payment => <TableRow key={payment.id} data-state={selection.value.has(payment.id) ? "selected" as const : undefined}>
                <TableCell>
                  <Checkbox checked={selection.value.has(payment.id)} onCheckedChange={value => toggleRows.value([payment.id], !!value)} aria-label={`Select ${payment.email}`} />
                </TableCell>
                {visibility.value.status && <TableCell>
                    <div class="capitalize">{payment.status}</div>
                  </TableCell>}
                {visibility.value.email && <TableCell>
                    <div class="lowercase">{payment.email}</div>
                  </TableCell>}
                {visibility.value.amount && <TableCell>
                    <div class="ll-num text-end font-medium">{dollars.format(payment.amount)}</div>
                  </TableCell>}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <span class="sr-only">Open menu</span>
                        <Icon name="ellipsis" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => void navigator.clipboard?.writeText(payment.id)}>Copy payment ID</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View customer</DropdownMenuItem>
                      <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>) : <TableRow>
              <TableCell colspan={columnCount.value} class="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>}
        </TableBody>
      </Table>
      <div class="flex items-center justify-end space-x-2 py-4">
        <div class="flex-1 text-sm text-muted-foreground" aria-live="polite">
          {chosenInFilter.value} of {rows.value.length} row(s) selected. Page {page.value + 1} of {pageCount.value}.
        </div>
        <div class="space-x-2">
          <Button variant="outline" size="sm" onClick={() => setPageIndex(page.value - 1)} disabled={page.value === 0}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPageIndex(page.value + 1)} disabled={page.value >= pageCount.value - 1}>
            Next
          </Button>
        </div>
      </div>
    </div>;
  };
});
export default Example;
