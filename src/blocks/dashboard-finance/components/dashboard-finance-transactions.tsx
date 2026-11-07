// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { AddTransaction } from "@/blocks/dashboard-finance/components/dashboard-finance-add-dialog";
import { CATEGORY_ICON, money, shortDate, type Status, type Transaction } from "@/blocks/dashboard-finance/components/dashboard-finance-data";
type Show = "all" | "in" | "out";
type SortKey = "date" | "amount";
const STATUS: Record<Status, {
  label: string;
  variant: "outline" | "secondary" | "destructive";
  icon: string;
  iconClass?: string;
}> = {
  cleared: {
    label: "Cleared" as const,
    variant: "outline" as const,
    icon: "circle-check" as const,
    iconClass: "text-green" as const
  },
  pending: {
    label: "Pending" as const,
    variant: "secondary" as const,
    icon: "clock" as const
  },
  flagged: {
    label: "Flagged" as const,
    variant: "destructive" as const,
    icon: "triangle-alert" as const
  }
};
const SortHead = defineUi<{
  label: string;
  k: SortKey;
  sort: {
    key: SortKey;
    dir: "asc" | "desc";
  };
  onSort: (k: SortKey) => void;
  className?: string;
}>("SortHead", ["label", "k", "sort", "onSort", "class"], (_props, {
  slots: _slots
}) => {
  const label = computed(() => _props["label"]);
  const k = computed(() => _props["k"]);
  const sort = computed(() => _props["sort"]);
  const onSort = computed(() => _props["onSort"]);
  const className = computed(() => _props["class"]);
  const active = computed(() => sort.value.key === k.value);
  return () => {
    return <TableHead aria-sort={active.value ? sort.value.dir === "asc" ? "ascending" as const : "descending" as const : "none" as const} class={className.value}>
      <Button variant="ghost" size="sm" class="-mx-2 font-script text-[19px] has-[>svg:not(.absolute)]:px-1.5 md:-mx-3 md:has-[>svg:not(.absolute)]:px-2.5" onClick={() => onSort.value(k.value)}>
        {label.value}
        <Icon name={active.value ? sort.value.dir === "asc" ? "arrow-up" as const : "arrow-down" as const : "arrow-up-down" as const} size={14} />
      </Button>
    </TableHead>;
  };
});
export const Transactions = defineUi<{
  list: readonly Transaction[];
  monthName: string;
  addDate: string;
  onAdd: (t: Omit<Transaction, "id">) => void;
  className?: string;
}>("Transactions", ["list", "monthName", "addDate", "onAdd", "class"], (_props, {
  slots: _slots
}) => {
  const list = computed(() => _props["list"]);
  const monthName = computed(() => _props["monthName"]);
  const addDate = computed(() => _props["addDate"]);
  const onAdd = computed(() => _props["onAdd"]);
  const className = computed(() => _props["class"]);
  const show = shallowRef<Show>(initialState("all"));
  const setShow = stateSetter(show);
  const query = shallowRef(initialState(""));
  const setQuery = stateSetter(query);
  const sort = shallowRef<{
    key: SortKey;
    dir: "asc" | "desc";
  }>(initialState({
    key: "date" as const,
    dir: "desc" as const
  }));
  const setSort = stateSetter(sort);
  const rows = computed(() => {
    const q = query.value.trim().toLowerCase();
    const filtered = list.value.filter(t => (show.value === "all" || (show.value === "in" ? t.cents > 0 : t.cents < 0)) && (!q || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)));
    const sign = sort.value.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => sign * (sort.value.key === "date" ? a.date.localeCompare(b.date) || a.id - b.id : a.cents - b.cents));
  });
  const onSort = computed(() => (key: SortKey) => setSort(s => s.key === key ? {
    key,
    dir: s.dir === "asc" ? "desc" as const : "asc" as const
  } : {
    key,
    dir: key === "date" ? "desc" as const : "asc" as const
  }));
  return () => {
    return <Card class={cn("min-w-0 max-sm:[&_[data-slot=card-content]]:px-4 max-sm:[&_[data-slot=card-header]]:px-4", className.value)} seed="finance-transactions">
      <CardHeader>
        <CardTitle role="heading" aria-level={2}>
          Transactions
        </CardTitle>
        <CardDescription>
          {rows.value.length} of {list.value.length} in {monthName.value}
        </CardDescription>
        <CardAction class="col-start-1 row-span-1 row-start-3 justify-self-start @md/card-header:col-start-2 @md/card-header:row-span-2 @md/card-header:row-start-1 @md/card-header:justify-self-end">
          <AddTransaction date={addDate.value} onAdd={onAdd.value} />
        </CardAction>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <div class="flex flex-wrap items-center gap-3">
          <ToggleGroup type="single" variant="outline" size="sm" value={show.value} onValueChange={v => v && setShow(v as Show)} aria-label="Show">
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="in">Money in</ToggleGroupItem>
            <ToggleGroupItem value="out">Money out</ToggleGroupItem>
          </ToggleGroup>
          <Input type="search" aria-label="Search transactions" placeholder="Search transactions" class="min-w-40 flex-1 sm:max-w-64" value={query.value} onChange={(e: Event) => setQuery((e.target as HTMLInputElement).value)} />
        </div>
        <Table aria-label={`Transactions in ${monthName.value}`} class="[&_td]:px-2 [&_th]:px-2 md:[&_td]:px-3 md:[&_th]:px-3">
          <TableCaption class="sr-only">Transactions in {monthName.value}, newest first unless you sort them otherwise</TableCaption>
          <TableHeader>
            <TableRow>
              <SortHead label="Date" k="date" sort={sort.value} onSort={onSort.value} />
              <TableHead>What</TableHead>
              <TableHead class="hidden lg:table-cell">Pot</TableHead>
              <TableHead class="hidden md:table-cell">Status</TableHead>
              <SortHead label="Amount" k="amount" sort={sort.value} onSort={onSort.value} class="text-end" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.value.length ? rows.value.map(t => {
              const s = STATUS[t.status];
              return <TableRow key={t.id}>
                    <TableCell class="ll-num">{shortDate(t.date)}</TableCell>
                    <TableCell class="max-w-40 whitespace-normal md:max-w-64 md:truncate">
                      {t.description}
                      <span class="block text-sm text-muted-foreground">
                        {t.account}
                        {t.status === "cleared" ? null : <span class={cn("md:hidden", t.status === "flagged" && "font-bold text-red")}> · {s.label.toLowerCase()}</span>}
                      </span>
                    </TableCell>
                    <TableCell class="hidden lg:table-cell">
                      <span class="inline-flex items-center gap-1.5 text-sm">
                        <Icon name={CATEGORY_ICON[t.category]} size={14} />
                        {t.category}
                      </span>
                    </TableCell>
                    <TableCell class="hidden md:table-cell">
                      <Badge variant={s.variant}>
                        <Icon name={s.icon} class={s.iconClass} />
                        {s.label}
                      </Badge>
                    </TableCell>
                    <TableCell class={cn("ll-num text-end font-bold", t.cents > 0 && "text-green")}>{money(t.cents, {
                    sign: true
                  })}</TableCell>
                  </TableRow>;
            }) : <TableRow class="h-auto">
                <TableCell colspan={5}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia pose="search" size={72} />
                      <EmptyTitle>Nothing matches</EmptyTitle>
                      <EmptyDescription>Try another word, or show everything again.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>}
          </TableBody>
        </Table>
      </CardContent>
    </Card>;
  };
});
