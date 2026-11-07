// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { FileBrowser, sortNodes, type SortKey, type View } from "@/blocks/file-explorer/components/file-explorer-browser";
import { countIn, formatSize, nodes as sample, ROOTS, withDescendants, type FileNode } from "@/blocks/file-explorer/components/file-explorer-data";
import { Folder, FolderContent, FolderTab, FolderTabs } from "@/components/ui/folder";
import { Sticker } from "@/components/ui/sticker";
const TODAY = "2026-09-25";
const FileExplorer = defineUi<{
  as?: "main" | "div";
}>("FileExplorer", ["as"], (_props, {
  slots: _slots
}) => {
  const Root = computed(() => jsxTag(_props["as"] === undefined ? "main" as const : _props["as"]));
  const all = shallowRef<FileNode[]>(initialState(sample));
  const setAll = stateSetter(all);
  const rootId = shallowRef(initialState(ROOTS[0].id));
  const setRootId = stateSetter(rootId);
  const paths = shallowRef<Record<string, string[]>>(initialState({}));
  const setPaths = stateSetter(paths);
  const view = shallowRef<View>(initialState("list"));
  const setView = stateSetter(view);
  const sort = shallowRef<SortKey>(initialState("name"));
  const setSort = stateSetter(sort);
  const query = shallowRef(initialState(""));
  const setQuery = stateSetter(query);
  const selected = shallowRef<ReadonlySet<string>>(initialState(() => new Set()));
  const setSelected = stateSetter(selected);
  const undo = shallowRef<{
    text: string;
    nodes: FileNode[];
  } | null>(initialState(null));
  const setUndo = stateSetter(undo);
  const message = shallowRef(initialState(""));
  const setMessage = stateSetter(message);
  const main = shallowRef<HTMLDivElement | null>(null);
  const landing = shallowRef<{
    index: number;
  } | null | null>(null);
  watchDependencies(() => {
    const to = landing.value;
    if (!to) return;
    landing.value = null;
    const opens = Array.from(main.value?.querySelectorAll<HTMLElement>("[data-file-open]") ?? []);
    (opens[Math.min(to.index, opens.length - 1)] ?? main.value?.querySelector<HTMLElement>("[data-file-new]"))?.focus();
  }, undefined, false);
  const root = computed(() => ROOTS.find(r => r.id === rootId.value) ?? ROOTS[0]);
  const path = computed(() => paths.value[root.value.id] ?? []);
  const here = computed(() => path.value.at(-1) ?? root.value.id);
  const trail = computed(() => path.value.map(id => ({
    id,
    name: all.value.find(n => n.id === id)?.name ?? ""
  })));
  const inside = computed(() => all.value.filter(n => n.parent === here.value));
  const items = computed(() => {
    const q = query.value.trim().toLowerCase();
    return sortNodes(q ? inside.value.filter(n => n.name.toLowerCase().includes(q)) : inside.value, sort.value).map(n => n.kind === "folder" ? {
      ...n,
      items: countIn(all.value, n.id)
    } : n);
  });
  const total = computed(() => all.value.reduce((sum, n) => sum + (n.size ?? 0), 0));
  const reset = computed(() => () => {
    setSelected(new Set());
    setQuery("");
    setUndo(null);
  });
  const go = computed(() => (next: string[]) => {
    setPaths(p => ({
      ...p,
      [root.value.id]: next
    }));
    reset.value();
    landing.value = {
      index: 0
    };
  });
  return () => {
    function activate(n: FileNode) {
      if (n.kind === "folder") {
        go.value([...path.value, n.id]);
        setMessage(`Opened ${n.name}.`);
      } else {
        setSelected(s => {
          const next = new Set(s);
          if (next.has(n.id)) next.delete(n.id);else next.add(n.id);
          return next;
        });
      }
    }
    function remove(ids: string[], what: string) {
      const doomed = new Set<string>();
      for (const id of ids) withDescendants(all.value, id).forEach(d => doomed.add(d));
      const gone = all.value.filter(n => doomed.has(n.id));
      setAll(list => list.filter(n => !doomed.has(n.id)));
      setSelected(new Set());
      setUndo({
        text: `Deleted ${what}.`,
        nodes: gone
      });
      setMessage(`Deleted ${what}. Undo is next to the list.`);
    }
    function newFolder() {
      const taken = new Set(inside.value.map(n => n.name));
      let name = "Untitled folder";
      for (let i = 2; taken.has(name); i++) name = `Untitled folder ${i}`;
      const next = Math.max(0, ...all.value.map(n => Number(n.id.slice(1)) || 0)) + 1;
      setAll(list => [...list, {
        id: `f${next}`,
        parent: here.value,
        name,
        kind: "folder" as const,
        modified: TODAY
      }]);
      setUndo(null);
      setMessage(`Made a folder called ${name}.`);
    }
    return <Root.value ref={main} class="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <header class="flex flex-wrap items-end justify-between gap-3">
        <div class="flex items-center gap-4">
          <div>
            <p class="font-type text-sm tracking-wide text-ink-muted">Marigold Paper Co.</p>
            <h1 class="font-script text-4xl leading-none font-bold sm:text-5xl">Filing cabinet</h1>
          </div>
          <Sticker name="pencil-cup" size={68} seed="files-pencils" class="hidden shrink-0 sm:block" />
        </div>
        <p class="text-muted-foreground">
          {all.value.filter(n => n.kind !== "folder").length} files, {formatSize(total.value)}
        </p>
      </header>

      <Folder value={rootId.value} onValueChange={v => {
        setRootId(v);
        reset.value();
      }} class="max-w-none">
        <FolderTabs aria-label="Places" class="ps-2 pe-2 sm:ps-4 sm:pe-4">
          {ROOTS.map(r => <FolderTab key={r.id} value={r.id} class="min-w-0 flex-1 max-sm:px-1.5 max-sm:text-sm sm:flex-none">
              {r.name}
            </FolderTab>)}
        </FolderTabs>
        {ROOTS.map(r => <FolderContent key={r.id} value={r.id} class="px-4 pb-6 sm:px-6">
            <FileBrowser rootName={r.name} trail={trail.value} items={items.value} view={view.value} onView={setView} sort={sort.value} onSort={setSort} query={query.value} onQuery={setQuery} selected={selected.value} onSelect={(id, on) => setSelected(s => {
            const next = new Set(s);
            if (on) next.add(id);else next.delete(id);
            return next;
          })} onSelectAll={on => setSelected(on ? new Set(items.value.map(n => n.id)) : new Set())} onClearSelection={() => {
            setSelected(new Set());
            landing.value = {
              index: 0
            };
          }} onActivate={activate} onDelete={n => {
            landing.value = {
              index: items.value.findIndex(x => x.id === n.id)
            };
            remove([n.id], `“${n.name}”`);
          }} onDeleteSelected={() => {
            landing.value = {
              index: 0
            };
            remove([...selected.value], `${selected.value.size} ${selected.value.size === 1 ? "item" as const : "items" as const}`);
          }} onNewFolder={newFolder} onCrumb={depth => go.value(path.value.slice(0, depth))} undo={undo.value?.text ?? null} onUndo={() => {
            if (!undo.value) return;
            setAll(list => [...list, ...undo.value.nodes]);
            setMessage("Put it back.");
            setUndo(null);
            landing.value = {
              index: 0
            };
          }} empty={inside.value.length === 0} />
          </FolderContent>)}
      </Folder>

      <p role="status" aria-label="File updates" class="sr-only">
        {message.value}
      </p>
    </Root.value>;
  };
});
export default FileExplorer;
