// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, Fragment } from "vue";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Paper } from "@/components/ui/paper";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { formatDay, formatSize, KIND_ICON, KIND_LABEL, type FileNode } from "@/blocks/file-explorer/components/file-explorer-data";
export type SortKey = "name" | "modified" | "size";
export type View = "list" | "grid";
export const SORTS: ReadonlyArray<{
  id: SortKey;
  label: string;
}> = [{
  id: "name" as const,
  label: "Name" as const
}, {
  id: "modified" as const,
  label: "Last changed" as const
}, {
  id: "size" as const,
  label: "Size" as const
}];
export function sortNodes(list: readonly FileNode[], key: SortKey): FileNode[] {
  return [...list].sort((a, b) => {
    if (a.kind === "folder" !== (b.kind === "folder")) return a.kind === "folder" ? -1 : 1;
    if (key === "modified") return b.modified.localeCompare(a.modified) || a.name.localeCompare(b.name);
    if (key === "size") return (b.size ?? 0) - (a.size ?? 0) || a.name.localeCompare(b.name);
    return a.name.localeCompare(b.name, "en", {
      numeric: true
    });
  });
}
type Item = FileNode & {
  items?: number;
};
const meta = (n: Item) => n.kind === "folder" ? `${n.items ?? 0} ${n.items === 1 ? "item" as const : "items" as const}` : `${formatSize(n.size ?? 0)} · ${formatDay(n.modified)}`;
const spoken = (n: Item) => n.kind === "folder" ? `, folder, ${meta(n)}` : `, ${KIND_LABEL[n.kind]}, ${formatSize(n.size ?? 0)}, changed ${formatDay(n.modified)}`;
type ListProps = {
  items: Item[];
  selected: ReadonlySet<string>;
  onActivate: (n: Item) => void;
  onSelect: (id: string, on: boolean) => void;
  onSelectAll: (on: boolean) => void;
  onDelete: (n: Item) => void;
  label: string;
};
const ListView = defineUi<ListProps>("ListView", ["items", "selected", "onActivate", "onSelect", "onSelectAll", "onDelete", "label"], (_props, {
  slots: _slots
}) => {
  const items = computed(() => _props["items"]);
  const selected = computed(() => _props["selected"]);
  const onActivate = computed(() => _props["onActivate"]);
  const onSelect = computed(() => _props["onSelect"]);
  const onSelectAll = computed(() => _props["onSelectAll"]);
  const onDelete = computed(() => _props["onDelete"]);
  const label = computed(() => _props["label"]);
  const all = computed(() => items.value.length > 0 && items.value.every(n => selected.value.has(n.id)));
  const some = computed(() => items.value.some(n => selected.value.has(n.id)));
  return () => {
    return <Table aria-label={label.value}>
      <TableHeader>
        <TableRow>
          <TableHead class="w-10">
            <Checkbox aria-label="Select everything in this folder" checked={all.value ? true : some.value ? "indeterminate" as const : false} onCheckedChange={on => onSelectAll.value(on === true)} />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead class="hidden sm:table-cell">Last changed</TableHead>
          <TableHead class="hidden text-end sm:table-cell">Size</TableHead>
          <TableHead class="w-10">
            <span class="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.value.map(n => <TableRow key={n.id} data-state={selected.value.has(n.id) ? "selected" as const : undefined}>
            <TableCell class="w-10">
              <Checkbox aria-label={`Select ${n.name}`} checked={selected.value.has(n.id)} onCheckedChange={on => onSelect.value(n.id, on === true)} />
            </TableCell>
            <TableCell class="max-w-56 sm:max-w-80">
              <button type="button" data-file-open="" class="flex w-full min-w-0 items-center gap-2.5 text-start hover:ll-swipe focus-visible:ll-swipe" onClick={() => onActivate.value(n)}>
                <Icon name={KIND_ICON[n.kind]} size={20} />
                <span class="min-w-0 flex-1">
                  <span class={cn("block truncate", n.kind === "folder" && "font-bold")}>
                    {n.name}
                    <span class="sr-only">{spoken(n)}</span>
                  </span>
                  <span aria-hidden="true" class="block truncate text-sm text-muted-foreground sm:hidden">
                    {meta(n)}
                  </span>
                </span>
              </button>
            </TableCell>
            <TableCell class="ll-num hidden sm:table-cell">{formatDay(n.modified)}</TableCell>
            <TableCell class="ll-num hidden text-end sm:table-cell">{n.kind === "folder" ? meta(n) : formatSize(n.size ?? 0)}</TableCell>
            <TableCell class="w-10">
              <RowMenu n={n} onActivate={onActivate.value} onDelete={onDelete.value} />
            </TableCell>
          </TableRow>)}
      </TableBody>
    </Table>;
  };
});
const RowMenu = defineUi<{
  n: Item;
  onActivate: (n: Item) => void;
  onDelete: (n: Item) => void;
}>("RowMenu", ["n", "onActivate", "onDelete"], (_props, {
  slots: _slots
}) => {
  const n = computed(() => _props["n"]);
  const onActivate = computed(() => _props["onActivate"]);
  const onDelete = computed(() => _props["onDelete"]);
  return () => {
    return <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" class="text-muted-foreground">
          <Icon name="ellipsis-vertical" />
          <span class="sr-only">Actions for {n.value.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-40">
        <DropdownMenuItem onSelect={() => onActivate.value(n.value)}>
          <Icon name={n.value.kind === "folder" ? "folder-open" as const : "check" as const} />
          {n.value.kind === "folder" ? "Open" as const : "Pick" as const}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => onDelete.value(n.value)}>
          <Icon name="trash" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>;
  };
});
const GridView = defineUi<Omit<ListProps, "onSelectAll">>("GridView", ["items", "selected", "onActivate", "onSelect", "onDelete", "label"], (_props, {
  slots: _slots
}) => {
  const items = computed(() => _props["items"]);
  const selected = computed(() => _props["selected"]);
  const onActivate = computed(() => _props["onActivate"]);
  const onSelect = computed(() => _props["onSelect"]);
  const onDelete = computed(() => _props["onDelete"]);
  const label = computed(() => _props["label"]);
  return () => {
    return <ul role="list" aria-label={label.value} class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.value.map(n => {
        const on = selected.value.has(n.id);
        return <li key={n.id} class="min-w-0">
            <Paper stock="index-card" rules="none" seed={n.id} data-state={on ? "selected" as const : undefined} class="relative flex min-h-0 w-full flex-col items-center gap-2 px-3 pt-8 pb-3 text-center">
              <Checkbox class="absolute start-2.5 top-2.5" aria-label={`Select ${n.name}`} checked={on} onCheckedChange={v => onSelect.value(n.id, v === true)} />
              <span class="absolute end-1 top-1">
                <RowMenu n={n} onActivate={onActivate.value} onDelete={onDelete.value} />
              </span>
              <button type="button" data-file-open="" class={cn("flex w-full min-w-0 flex-col items-center gap-1.5 py-2 hover:ll-swipe focus-visible:ll-swipe", on && "ll-swipe")} onClick={() => onActivate.value(n)}>
                <Icon name={KIND_ICON[n.kind]} size={44} tone="doodle" />
                <span class={cn("block w-full truncate text-[15px] leading-tight", n.kind === "folder" && "font-bold")}>
                  {n.name}
                  <span class="sr-only">{spoken(n)}</span>
                </span>
                <span aria-hidden="true" class="block w-full truncate text-sm text-muted-foreground">
                  {meta(n)}
                </span>
              </button>
            </Paper>
          </li>;
      })}
    </ul>;
  };
});
export const FileBrowser = defineUi<{
  rootName: string;
  trail: ReadonlyArray<{
    id: string;
    name: string;
  }>;
  items: Item[];
  view: View;
  onView: (v: View) => void;
  sort: SortKey;
  onSort: (s: SortKey) => void;
  query: string;
  onQuery: (q: string) => void;
  selected: ReadonlySet<string>;
  onSelect: (id: string, on: boolean) => void;
  onSelectAll: (on: boolean) => void;
  onClearSelection: () => void;
  onActivate: (n: Item) => void;
  onDelete: (n: Item) => void;
  onDeleteSelected: () => void;
  onNewFolder: () => void;
  onCrumb: (depth: number) => void;
  undo: string | null;
  onUndo: () => void;
  empty: boolean;
}>("FileBrowser", ["rootName", "trail", "items", "view", "onView", "sort", "onSort", "query", "onQuery", "selected", "onSelect", "onSelectAll", "onClearSelection", "onActivate", "onDelete", "onDeleteSelected", "onNewFolder", "onCrumb", "undo", "onUndo", "empty"], (_props, {
  slots: _slots
}) => {
  const rootName = computed(() => _props["rootName"]);
  const trail = computed(() => _props["trail"]);
  const items = computed(() => _props["items"]);
  const view = computed(() => _props["view"]);
  const onView = computed(() => _props["onView"]);
  const sort = computed(() => _props["sort"]);
  const onSort = computed(() => _props["onSort"]);
  const query = computed(() => _props["query"]);
  const onQuery = computed(() => _props["onQuery"]);
  const selected = computed(() => _props["selected"]);
  const onSelect = computed(() => _props["onSelect"]);
  const onSelectAll = computed(() => _props["onSelectAll"]);
  const onClearSelection = computed(() => _props["onClearSelection"]);
  const onActivate = computed(() => _props["onActivate"]);
  const onDelete = computed(() => _props["onDelete"]);
  const onDeleteSelected = computed(() => _props["onDeleteSelected"]);
  const onNewFolder = computed(() => _props["onNewFolder"]);
  const onCrumb = computed(() => _props["onCrumb"]);
  const undo = computed(() => _props["undo"]);
  const onUndo = computed(() => _props["onUndo"]);
  const empty = computed(() => _props["empty"]);
  const here = computed(() => trail.value.at(-1)?.name ?? rootName.value);
  const label = computed(() => `Everything in ${here.value}`);
  return () => {
    return <div class="flex flex-col gap-4">
      <Breadcrumb aria-label={`Where you are in ${rootName.value}`}>
        <BreadcrumbList>
          {trail.value.length === 0 ? <BreadcrumbItem>
              <BreadcrumbPage>{rootName.value}</BreadcrumbPage>
            </BreadcrumbItem> : <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <button type="button" onClick={() => onCrumb.value(0)}>
                    {rootName.value}
                  </button>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {trail.value.map((t, i) => <Fragment key={t.id}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {i === trail.value.length - 1 ? <BreadcrumbPage>{t.name}</BreadcrumbPage> : <BreadcrumbLink asChild>
                        <button type="button" onClick={() => onCrumb.value(i + 1)}>
                          {t.name}
                        </button>
                      </BreadcrumbLink>}
                  </BreadcrumbItem>
                </Fragment>)}
            </>}
        </BreadcrumbList>
      </Breadcrumb>

      <div class="flex flex-wrap items-center gap-3">
        <Input type="search" aria-label={`Search in ${here.value}`} placeholder="Search this folder" class="min-w-40 flex-1 sm:max-w-64" value={query.value} onChange={(e: Event) => onQuery.value((e.target as HTMLInputElement).value)} />
        <Select value={sort.value} onValueChange={v => onSort.value(v as SortKey)}>
          <SelectTrigger size="sm" class="w-40" aria-label="Sort by">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORTS.map(s => <SelectItem key={s.id} value={s.id}>
                {s.label}
              </SelectItem>)}
          </SelectContent>
        </Select>
        <ToggleGroup type="single" variant="outline" size="sm" value={view.value} onValueChange={v => v && onView.value(v as View)} aria-label="View">
          <ToggleGroupItem value="list" aria-label="List view">
            <Icon name="list" />
          </ToggleGroupItem>
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <Icon name="layout-grid" />
          </ToggleGroupItem>
        </ToggleGroup>
        <Button variant="outline" size="sm" data-file-new="" onClick={onNewFolder.value}>
          <Icon name="folder-plus" />
          New folder
        </Button>
      </div>

      {selected.value.size ? <div role="group" aria-label="Selected items" class="flex flex-wrap items-center gap-3 bg-hi-select/50 px-3 py-1.5">
          <span class="font-bold">{selected.value.size} picked</span>
          <Button variant="destructive" size="sm" onClick={onDeleteSelected.value}>
            <Icon name="trash" />
            Delete
          </Button>
          <Button variant="ghost" size="sm" onClick={onClearSelection.value}>
            Clear
          </Button>
        </div> : null}

      {undo.value ? <div class="flex flex-wrap items-center gap-2 text-sm" data-slot="file-explorer-undo">
          <span>{undo.value}</span>
          <Button variant="link" size="sm" onClick={onUndo.value}>
            Undo
          </Button>
        </div> : null}

      {items.value.length === 0 ? <Empty>
          <EmptyHeader>
            <EmptyMedia pose={empty.value ? "peek" as const : "search" as const} size={84} />
            <EmptyTitle>{empty.value ? "This folder is empty" as const : "Nothing matches" as const}</EmptyTitle>
            <EmptyDescription>{empty.value ? "Nothing filed here yet. Make a new folder to begin." as const : "Try another word." as const}</EmptyDescription>
          </EmptyHeader>
        </Empty> : view.value === "list" ? <ListView items={items.value} selected={selected.value} onActivate={onActivate.value} onSelect={onSelect.value} onSelectAll={onSelectAll.value} onDelete={onDelete.value} label={label.value} /> : <GridView items={items.value} selected={selected.value} onActivate={onActivate.value} onSelect={onSelect.value} onDelete={onDelete.value} label={label.value} />}
    </div>;
  };
});
