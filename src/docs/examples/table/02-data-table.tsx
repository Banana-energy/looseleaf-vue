// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
export const meta = {
  title: "Data table" as const,
  description: "Sorting, selection and pagination with plain Vue state and no extra dependency. A selected row is a highlighter swipe (`data-state=\"selected\"`), the sorted column says so with `aria-sort` and an arrow, and the header checkbox goes half-ticked when only some rows are chosen. Colored pencil text is 4.7:1 on paper but about 4:1 on the full swipe, so a chosen row writes its status in ink." as const,
  layout: "stack" as const
};
type Person = {
  id: string;
  name: string;
  plan: "Solo" | "Team";
  status: "Paid" | "Pending" | "Overdue";
  amount: number;
};
type SortKey = "name" | "plan" | "status" | "amount";
const DATA: Person[] = [{
  id: "1" as const,
  name: "Ada Lovelace" as const,
  plan: "Team" as const,
  status: "Paid" as const,
  amount: 250
}, {
  id: "2" as const,
  name: "Jo Okafor" as const,
  plan: "Solo" as const,
  status: "Pending" as const,
  amount: 49
}, {
  id: "3" as const,
  name: "Mika Kobayashi" as const,
  plan: "Team" as const,
  status: "Paid" as const,
  amount: 250
}, {
  id: "4" as const,
  name: "Sam Reyes" as const,
  plan: "Solo" as const,
  status: "Overdue" as const,
  amount: 49
}, {
  id: "5" as const,
  name: "Priya Nair" as const,
  plan: "Team" as const,
  status: "Paid" as const,
  amount: 250
}, {
  id: "6" as const,
  name: "Tomas Berg" as const,
  plan: "Solo" as const,
  status: "Paid" as const,
  amount: 49
}, {
  id: "7" as const,
  name: "Lena Fischer" as const,
  plan: "Team" as const,
  status: "Pending" as const,
  amount: 250
}, {
  id: "8" as const,
  name: "Omar Haddad" as const,
  plan: "Solo" as const,
  status: "Paid" as const,
  amount: 49
}, {
  id: "9" as const,
  name: "Yuki Tanaka" as const,
  plan: "Team" as const,
  status: "Overdue" as const,
  amount: 250
}, {
  id: "10" as const,
  name: "Ines Moreau" as const,
  plan: "Solo" as const,
  status: "Paid" as const,
  amount: 49
}, {
  id: "11" as const,
  name: "Kofi Mensah" as const,
  plan: "Team" as const,
  status: "Paid" as const,
  amount: 250
}, {
  id: "12" as const,
  name: "Nora Lindqvist" as const,
  plan: "Solo" as const,
  status: "Pending" as const,
  amount: 49
}];
const PAGE = 5;
const STATUS_TONE = {
  Paid: "text-green" as const,
  Pending: "text-muted-foreground" as const,
  Overdue: "text-red" as const
} as const;
const SortHead = defineUi<{
  label: string;
  k: SortKey;
  sort: {
    key: SortKey;
    dir: "asc" | "desc";
  } | null;
  onSort: (k: SortKey) => void;
  end?: boolean;
}>("SortHead", ["label", "k", "sort", "onSort", "end"], (_props, {
  slots: _slots
}) => {
  const label = computed(() => _props["label"]);
  const k = computed(() => _props["k"]);
  const sort = computed(() => _props["sort"]);
  const onSort = computed(() => _props["onSort"]);
  const end = computed(() => _props["end"]);
  const active = computed(() => sort.value?.key === k.value);
  return () => {
    return <TableHead aria-sort={active.value ? sort.value.dir === "asc" ? "ascending" as const : "descending" as const : "none" as const} class={end.value ? "text-end" as const : undefined}>
      <button type="button" onClick={() => onSort.value(k.value)} class="-mx-2 inline-flex items-center gap-1 px-2 py-1 hover:ll-swipe focus-visible:ll-swipe">
        {label.value}
        <Icon name={active.value ? sort.value.dir === "asc" ? "arrow-up" as const : "arrow-down" as const : "chevrons-up-down" as const} size={16} class={active.value ? undefined : "opacity-45" as const} />
      </button>
    </TableHead>;
  };
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const sort = shallowRef<{
    key: SortKey;
    dir: "asc" | "desc";
  } | null>(initialState(null));
  const setSort = stateSetter(sort);
  const selected = shallowRef<ReadonlySet<string>>(initialState(new Set(["3"])));
  const setSelected = stateSetter(selected);
  const page = shallowRef(initialState(0));
  const setPage = stateSetter(page);
  const rows = computed(() => {
    if (!sort.value) return DATA;
    const sign = sort.value.dir === "asc" ? 1 : -1;
    return [...DATA].sort((a, b) => {
      const x = a[sort.value.key],
        y = b[sort.value.key];
      return (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y))) * sign;
    });
  });
  const pages = computed(() => Math.ceil(rows.value.length / PAGE));
  const visible = computed(() => rows.value.slice(page.value * PAGE, page.value * PAGE + PAGE));
  const chosen = computed(() => visible.value.filter(r => selected.value.has(r.id)).length);
  const toggleSort = computed(() => (key: SortKey) => setSort(s => s?.key !== key ? {
    key,
    dir: "asc" as const
  } : s.dir === "asc" ? {
    key,
    dir: "desc" as const
  } : null));
  const toggleAll = computed(() => (on: boolean) => setSelected(prev => {
    const next = new Set(prev);
    for (const r of visible.value) on ? next.add(r.id) : next.delete(r.id);
    return next;
  }));
  const toggleOne = computed(() => (id: string, on: boolean) => setSelected(prev => {
    const next = new Set(prev);
    if (on) next.add(id);else next.delete(id);
    return next;
  }));
  return () => {
    return <div class="w-full max-w-2xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-10">
              <Checkbox aria-label="Select all rows on this page" checked={chosen.value === visible.value.length ? true : chosen.value > 0 ? "indeterminate" as const : false} onCheckedChange={v => toggleAll.value(v === true)} />
            </TableHead>
            <SortHead label="Name" k="name" sort={sort.value} onSort={toggleSort.value} />
            <SortHead label="Plan" k="plan" sort={sort.value} onSort={toggleSort.value} />
            <SortHead label="Status" k="status" sort={sort.value} onSort={toggleSort.value} />
            <SortHead label="Amount" k="amount" sort={sort.value} onSort={toggleSort.value} end />
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.value.map(r => <TableRow key={r.id} data-state={selected.value.has(r.id) ? "selected" as const : undefined}>
              <TableCell>
                <Checkbox aria-label={`Select ${r.name}`} checked={selected.value.has(r.id)} onCheckedChange={v => toggleOne.value(r.id, v === true)} />
              </TableCell>
              <TableCell class="font-bold">{r.name}</TableCell>
              <TableCell>{r.plan}</TableCell>
              <TableCell class={`font-bold ${selected.value.has(r.id) ? "text-ink" as const : STATUS_TONE[r.status]}`}>{r.status}</TableCell>
              <TableCell class="ll-num text-end">${r.amount.toFixed(2)}</TableCell>
            </TableRow>)}
        </TableBody>
      </Table>
      <div class="mt-5 flex items-center justify-between gap-4 text-sm">
        <p class="text-muted-foreground" aria-live="polite">
          {selected.value.size} of {DATA.length} chosen · page {page.value + 1} of {pages.value}
        </p>
        <div class="flex gap-2">
          <Button variant="outline" size="sm" disabled={page.value === 0} onClick={() => setPage(p => p - 1)}>
            <Icon name="chevron-left" />
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled={page.value >= pages.value - 1} onClick={() => setPage(p => p + 1)}>
            Next
            <Icon name="chevron-right" />
          </Button>
        </div>
      </div>
    </div>;
  };
});
export default Example;
