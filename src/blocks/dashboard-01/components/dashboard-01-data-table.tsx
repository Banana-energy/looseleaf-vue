// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef, useId } from "vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AreaChart, ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { monthly, REVIEWERS, SECTION_TYPES, UNASSIGNED, type Section } from "@/blocks/dashboard-01/components/dashboard-01-data";
type ColumnId = "header" | "type" | "status" | "target" | "limit" | "reviewer";
const COLUMNS: ReadonlyArray<{
  id: ColumnId;
  label: string;
}> = [{
  id: "header" as const,
  label: "Header" as const
}, {
  id: "type" as const,
  label: "Section type" as const
}, {
  id: "status" as const,
  label: "Status" as const
}, {
  id: "target" as const,
  label: "Target" as const
}, {
  id: "limit" as const,
  label: "Limit" as const
}, {
  id: "reviewer" as const,
  label: "Reviewer" as const
}];
const PAGE_SIZES = [5, 10, 20];
const VIEWS = [{
  value: "outline" as const,
  label: "Outline" as const
}, {
  value: "past-performance" as const,
  label: "Past performance" as const,
  count: 3
}, {
  value: "key-personnel" as const,
  label: "Key personnel" as const,
  count: 2
}, {
  value: "focus-documents" as const,
  label: "Focus documents" as const
}] as const;
const STATUS_ICON: Record<Section["status"], {
  icon: string;
  className?: string;
}> = {
  Done: {
    icon: "circle-check" as const,
    className: "text-green" as const
  },
  "In Process": {
    icon: "loader" as const
  },
  "Not Started": {
    icon: "circle" as const
  }
};
const chartConfig = {
  desktop: {
    label: "Desktop" as const,
    color: "var(--chart-1)" as const
  },
  mobile: {
    label: "Mobile" as const,
    color: "var(--chart-2)" as const
  }
} satisfies ChartConfig;
const SectionViewer = defineUi<{
  item: Section;
  onSave: (next: Section) => void;
}>("SectionViewer", ["item", "onSave"], (_props, {
  slots: _slots
}) => {
  const item = computed(() => _props["item"]);
  const onSave = computed(() => _props["onSave"]);
  const isMobile = useIsMobile();
  const open = shallowRef(initialState(false));
  const setOpen = stateSetter(open);
  const draft = shallowRef(initialState(item.value));
  const setDraft = stateSetter(draft);
  const uid = useId();
  const id = computed(() => (name: string) => `${uid}-${name}`);
  const set = computed(() => <K extends keyof Section,>(key: K, value: Section[K]) => setDraft(d => ({
    ...d,
    [key]: value
  })));
  return () => {
    return <Drawer direction={isMobile.value ? "bottom" as const : "right" as const} open={open.value} onOpenChange={next => {
      if (next) setDraft(item.value);
      setOpen(next);
    }}>
      <DrawerTrigger asChild>
        <Button variant="link" title={item.value.header} class="h-9 w-fit max-w-full min-w-0 shrink justify-start px-0 text-start text-foreground">
          <span class="truncate">{item.value.header}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader class="gap-1">
          <DrawerTitle>{item.value.header}</DrawerTitle>
          <DrawerDescription>Visitors to this section over the last six months</DrawerDescription>
        </DrawerHeader>
        <div class="flex flex-col gap-4 overflow-y-auto px-4 pb-3 text-sm">
          {!isMobile.value && <>
              <ChartContainer config={chartConfig} class="aspect-auto h-40 w-full">
                <AreaChart data={monthly} xKey="month" stacked xFormatter={m => String(m).slice(0, 3)} label="Visitors per month, January to June" />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              </ChartContainer>
              <Separator />
              <div class="grid gap-2">
                <div class="flex gap-2 leading-none font-bold">
                  Up 5.2% this month <Icon name="trending-up" class="size-4" />
                </div>
                <p class="text-muted-foreground">People are reading this section all the way to the end, which is more than we hoped for.</p>
              </div>
              <Separator />
            </>}
          <form id={id.value("form")} class="flex flex-col gap-4" onSubmit={(e: SubmitEvent) => {
            e.preventDefault();
            onSave.value(draft.value);
            setOpen(false);
          }}>
            <div class="flex flex-col gap-2">
              <Label for={id.value("header")}>Header</Label>
              <Input id={id.value("header")} value={draft.value.header} onChange={(e: Event) => set.value("header", (e.target as HTMLInputElement).value)} />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <Label for={id.value("type")}>Type</Label>
                <Select value={draft.value.type} onValueChange={v => set.value("type", v)}>
                  <SelectTrigger id={id.value("type")} class="w-full">
                    <SelectValue placeholder="Pick a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTION_TYPES.map(t => <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>)}
                    {SECTION_TYPES.includes(draft.value.type as typeof SECTION_TYPES[number]) ? null : <SelectItem value={draft.value.type}>{draft.value.type}</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
              <div class="flex flex-col gap-2">
                <Label for={id.value("status")}>Status</Label>
                <Select value={draft.value.status} onValueChange={v => set.value("status", v as Section["status"])}>
                  <SelectTrigger id={id.value("status")} class="w-full">
                    <SelectValue placeholder="Pick a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Done">Done</SelectItem>
                    <SelectItem value="In Process">In process</SelectItem>
                    <SelectItem value="Not Started">Not started</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <Label for={id.value("target")}>Target</Label>
                <Input id={id.value("target")} inputmode="numeric" value={draft.value.target} onChange={(e: Event) => set.value("target", (e.target as HTMLInputElement).value)} />
              </div>
              <div class="flex flex-col gap-2">
                <Label for={id.value("limit")}>Limit</Label>
                <Input id={id.value("limit")} inputmode="numeric" value={draft.value.limit} onChange={(e: Event) => set.value("limit", (e.target as HTMLInputElement).value)} />
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <Label for={id.value("reviewer")}>Reviewer</Label>
              <Select value={draft.value.reviewer} onValueChange={v => set.value("reviewer", v)}>
                <SelectTrigger id={id.value("reviewer")} class="w-full">
                  <SelectValue placeholder="Pick a reviewer" />
                </SelectTrigger>
                <SelectContent>
                  {REVIEWERS.map(r => <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>)}
                  <SelectItem value={UNASSIGNED}>Not assigned yet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button type="submit" form={id.value("form")}>
            Save changes
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>;
  };
});
export const DataTable = defineUi<{
  data: Section[];
}>("DataTable", ["data"], (_props, {
  slots: _slots
}) => {
  const initialData = computed(() => _props["data"]);
  const uid = useId();
  const rows = shallowRef<Section[]>(initialState(() => initialData.value));
  const setRows = stateSetter(rows);
  const selected = shallowRef<ReadonlySet<number>>(initialState(() => new Set()));
  const setSelected = stateSetter(selected);
  const favorites = shallowRef<ReadonlySet<number>>(initialState(() => new Set()));
  const setFavorites = stateSetter(favorites);
  const hidden = shallowRef<ReadonlySet<ColumnId>>(initialState(() => new Set()));
  const setHidden = stateSetter(hidden);
  const pageIndex = shallowRef(initialState(0));
  const setPageIndex = stateSetter(pageIndex);
  const pageSize = shallowRef(initialState(10));
  const setPageSize = stateSetter(pageSize);
  const view = shallowRef<string>(initialState("outline"));
  const setView = stateSetter(view);
  const note = shallowRef(initialState(""));
  const setNote = stateSetter(note);
  const pager = shallowRef<HTMLDivElement | null>(null);
  const pressed = shallowRef<"first" | "prev" | "next" | "last" | null | null>(null);
  watchDependencies(() => {
    const key = pressed.value;
    pressed.value = null;
    if (!key || !pager.value) return;
    if (!pager.value.querySelector<HTMLButtonElement>(`[data-pager="${key}"]`)?.disabled) return;
    pager.value.querySelector<HTMLButtonElement>(`[data-pager="${key === "first" || key === "prev" ? "next" as const : "prev" as const}"]`)?.focus();
  }, undefined, true);
  const goTo = computed(() => (to: number, key: NonNullable<typeof pressed.current>) => {
    pressed.value = key;
    setPageIndex(to);
  });
  const pageCount = computed(() => Math.max(1, Math.ceil(rows.value.length / pageSize.value)));
  const page = computed(() => Math.min(pageIndex.value, pageCount.value - 1));
  const pageRows = computed(() => rows.value.slice(page.value * pageSize.value, page.value * pageSize.value + pageSize.value));
  const allOnPage = computed(() => pageRows.value.length > 0 && pageRows.value.every(r => selected.value.has(r.id)));
  const someOnPage = computed(() => pageRows.value.some(r => selected.value.has(r.id)));
  const visible = computed(() => (id: ColumnId) => !hidden.value.has(id));
  const columnCount = computed(() => 2 + COLUMNS.filter(c => visible.value(c.id)).length);
  const update = computed(() => (id: number, patch: Partial<Section>) => setRows(rs => rs.map(r => r.id === id ? {
    ...r,
    ...patch
  } : r)));
  const toggle = computed(() => <T,>(set: ReadonlySet<T>, value: T, on: boolean): Set<T> => {
    const next = new Set(set);
    if (on) next.add(value);else next.delete(value);
    return next;
  });
  return () => {
    return <Tabs value={view.value} onValueChange={setView} class="w-full flex-col justify-start gap-6">
      <h2 class="sr-only">Document sections</h2>
      <div class="flex items-center justify-between gap-2 px-4 lg:px-6">
        <Label for={`${uid}-view`} class="sr-only">
          View
        </Label>
        <Select value={view.value} onValueChange={setView}>
          <SelectTrigger class="flex w-fit @4xl/main:hidden" size="sm" id={`${uid}-view`}>
            <SelectValue placeholder="Pick a view" />
          </SelectTrigger>
          <SelectContent>
            {VIEWS.map(v => <SelectItem key={v.value} value={v.value}>
                {v.label}
              </SelectItem>)}
          </SelectContent>
        </Select>
        <TabsList class="hidden @4xl/main:flex">
          {VIEWS.map(v => <TabsTrigger key={v.value} value={v.value}>
              {v.label}
              {"count" in v ? <Badge variant="secondary" size="sm" count={v.count} /> : null}
            </TabsTrigger>)}
        </TabsList>
        <div class="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Icon name="layout-grid" />
                <span class="hidden lg:inline">Customize columns</span>
                <span class="lg:hidden">Columns</span>
                <Icon name="chevron-down" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-56">
              {COLUMNS.map(c => <DropdownMenuCheckboxItem key={c.id} checked={visible.value(c.id)} onCheckedChange={on => setHidden(h => toggle.value(h, c.id, !on))}>
                  {c.label}
                </DropdownMenuCheckboxItem>)}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" aria-label="Add section" onClick={() => {
            const id = Math.max(0, ...rows.value.map(r => r.id)) + 1;
            setRows(rs => [...rs, {
              id,
              header: "Untitled section" as const,
              type: "Narrative" as const,
              status: "Not Started" as const,
              target: "0" as const,
              limit: "0" as const,
              reviewer: UNASSIGNED
            }]);
            setPageIndex(Math.ceil((rows.value.length + 1) / pageSize.value) - 1);
            setNote("Added a blank section at the end of the table.");
          }}>
            <Icon name="plus" />
            <span class="hidden lg:inline">Add section</span>
          </Button>
        </div>
      </div>

      <TabsContent value="outline" class="relative flex flex-col gap-4 px-4 lg:px-6">
        <Table aria-label="Document sections" class="[&_td]:px-2 [&_th]:px-2">
          <TableHeader>
            <TableRow>
              <TableHead class="w-10">
                <Checkbox aria-label="Select all rows on this page" checked={allOnPage.value ? true : someOnPage.value ? "indeterminate" as const : false} onCheckedChange={on => setSelected(s => pageRows.value.reduce((acc, r) => toggle.value(acc, r.id, on === true), s))} />
              </TableHead>
              {visible.value("header") && <TableHead>Header</TableHead>}
              {visible.value("type") && <TableHead class="hidden @4xl/main:table-cell">Section type</TableHead>}
              {visible.value("status") && <TableHead>Status</TableHead>}
              {visible.value("target") && <TableHead class="hidden w-20 text-end @2xl/main:table-cell">Target</TableHead>}
              {visible.value("limit") && <TableHead class="hidden w-20 text-end @2xl/main:table-cell">Limit</TableHead>}
              {visible.value("reviewer") && <TableHead class="hidden @3xl/main:table-cell">Reviewer</TableHead>}
              <TableHead class="w-10">
                <span class="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.value.length ? pageRows.value.map(row => <TableRow key={row.id} data-state={selected.value.has(row.id) ? "selected" as const : undefined}>
                  <TableCell class="w-10">
                    <Checkbox aria-label={`Select ${row.header}`} checked={selected.value.has(row.id)} onCheckedChange={on => setSelected(s => toggle.value(s, row.id, on === true))} />
                  </TableCell>
                  {visible.value("header") && <TableCell>
                      <span class="flex max-w-40 items-center gap-1.5 @2xl/main:max-w-48">
                        <SectionViewer item={row} onSave={next => update.value(row.id, next)} />
                        {favorites.value.has(row.id) ? <Icon name="star" size={14} label="Favorite" class="text-hi-deep" /> : null}
                      </span>
                    </TableCell>}
                  {visible.value("type") && <TableCell class="hidden @4xl/main:table-cell">
                      <Badge variant="outline" class="px-1.5 text-muted-foreground">
                        {row.type}
                      </Badge>
                    </TableCell>}
                  {visible.value("status") && <TableCell>
                      <Badge variant="outline" class="px-1.5 text-muted-foreground">
                        <Icon name={STATUS_ICON[row.status].icon} class={STATUS_ICON[row.status].className} />
                        {row.status === "Done" ? "Done" as const : row.status === "In Process" ? "In process" as const : "Not started" as const}
                      </Badge>
                    </TableCell>}
                  {visible.value("target") && <TableCell class="hidden text-end @2xl/main:table-cell">
                      <Input aria-label={`Target for ${row.header}`} inputmode="numeric" class="ms-auto h-8 w-16 text-end" value={row.target} onChange={(e: Event) => update.value(row.id, {
                  target: (e.target as HTMLInputElement).value
                })} />
                    </TableCell>}
                  {visible.value("limit") && <TableCell class="hidden text-end @2xl/main:table-cell">
                      <Input aria-label={`Limit for ${row.header}`} inputmode="numeric" class="ms-auto h-8 w-16 text-end" value={row.limit} onChange={(e: Event) => update.value(row.id, {
                  limit: (e.target as HTMLInputElement).value
                })} />
                    </TableCell>}
                  {visible.value("reviewer") && <TableCell class="hidden @3xl/main:table-cell">
                      {row.reviewer !== UNASSIGNED ? row.reviewer : <Select value="" onValueChange={v => update.value(row.id, {
                  reviewer: v
                })}>
                          <SelectTrigger size="sm" class="w-40" aria-label={`Assign a reviewer to ${row.header}`}>
                            <SelectValue placeholder="Assign reviewer" />
                          </SelectTrigger>
                          <SelectContent align="end">
                            {REVIEWERS.map(r => <SelectItem key={r} value={r}>
                                {r}
                              </SelectItem>)}
                          </SelectContent>
                        </Select>}
                    </TableCell>}
                  <TableCell class="w-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" class="text-muted-foreground">
                          <Icon name="ellipsis-vertical" />
                          <span class="sr-only">Actions for {row.header}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" class="w-40">
                        <DropdownMenuItem onSelect={() => {
                      const id = Math.max(0, ...rows.value.map(r => r.id)) + 1;
                      setRows(rs => {
                        const at = rs.findIndex(r => r.id === row.id);
                        return [...rs.slice(0, at + 1), {
                          ...row,
                          id,
                          header: `${row.header} (copy)`
                        }, ...rs.slice(at + 1)];
                      });
                      setNote(`Made a copy of ${row.header}.`);
                    }}>
                          <Icon name="copy" />
                          Make a copy
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => {
                      const on = !favorites.value.has(row.id);
                      setFavorites(f => toggle.value(f, row.id, on));
                      setNote(on ? `${row.header} is a favorite now.` : `${row.header} is no longer a favorite.`);
                    }}>
                          <Icon name="star" />
                          {favorites.value.has(row.id) ? "Unfavorite" as const : "Favorite" as const}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onSelect={() => {
                      setRows(rs => rs.filter(r => r.id !== row.id));
                      setSelected(s => toggle.value(s, row.id, false));
                      setNote(`Deleted ${row.header}.`);
                    }}>
                          <Icon name="trash" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>) : <TableRow>
                <TableCell colspan={columnCount.value} class="h-24 text-center">
                  Nothing here. Add a section to start the outline.
                </TableCell>
              </TableRow>}
          </TableBody>
        </Table>

        <div class="flex items-center justify-between px-1">
          <div class="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {selected.value.size} of {rows.value.length} row(s) selected.
          </div>
          <div class="flex w-full items-center gap-8 lg:w-fit">
            <div class="hidden items-center gap-2 lg:flex">
              <Label for={`${uid}-rows-per-page`} class="text-sm font-bold">
                Rows per page
              </Label>
              <Select value={String(pageSize.value)} onValueChange={v => {
                setPageSize(Number(v));
                setPageIndex(0);
              }}>
                <SelectTrigger size="sm" class="w-20" id={`${uid}-rows-per-page`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top">
                  {PAGE_SIZES.map(n => <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div class="flex w-fit items-center justify-center text-sm font-bold" aria-live="polite">
              Page {page.value + 1} of {pageCount.value}
            </div>
            <div ref={pager} class="ms-auto flex items-center gap-2 lg:ms-0">
              <Button variant="outline" size="icon" data-pager="first" class="hidden lg:flex" onClick={() => goTo.value(0, "first")} disabled={page.value === 0}>
                <span class="sr-only">Go to first page</span>
                <Icon name="chevrons-left" />
              </Button>
              <Button variant="outline" size="icon" data-pager="prev" onClick={() => goTo.value(page.value - 1, "prev")} disabled={page.value === 0}>
                <span class="sr-only">Go to previous page</span>
                <Icon name="chevron-left" />
              </Button>
              <Button variant="outline" size="icon" data-pager="next" onClick={() => goTo.value(page.value + 1, "next")} disabled={page.value >= pageCount.value - 1}>
                <span class="sr-only">Go to next page</span>
                <Icon name="chevron-right" />
              </Button>
              <Button variant="outline" size="icon" data-pager="last" class="hidden lg:flex" onClick={() => goTo.value(pageCount.value - 1, "last")} disabled={page.value >= pageCount.value - 1}>
                <span class="sr-only">Go to last page</span>
                <Icon name="chevrons-right" />
              </Button>
            </div>
          </div>
        </div>
        <p role="status" aria-label="Table updates" class="sr-only">
          {note.value}
        </p>
      </TabsContent>

      {VIEWS.filter(v => v.value !== "outline").map(v => <TabsContent key={v.value} value={v.value} class="flex flex-col px-4 lg:px-6">
          <Empty class="border">
            <EmptyHeader>
              <EmptyMedia pose="sleep" size={88} />
              <EmptyTitle>Nothing filed under {v.label.toLowerCase()} yet</EmptyTitle>
              <EmptyDescription>Sections you tag this way will turn up here.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </TabsContent>)}
    </Tabs>;
  };
});
