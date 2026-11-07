// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Paper } from "@/components/ui/paper";
import { ALL, FEATURED, NOTEBOOKS, NOTES, type Note } from "@/blocks/notes-app/components/notes-app-data";
import { NotesAppEditor, type EditorMode } from "@/blocks/notes-app/components/notes-app-editor";
import { NotesAppNoteList } from "@/blocks/notes-app/components/notes-app-note-list";
import { cn } from "@/lib/utils";
type Props = {
  className?: string;
  defaultNotes?: Note[];
  onNotesChange?: (notes: Note[]) => void;
};
const NotesApp = defineUi<Props>("NotesApp", ["class", "defaultNotes", "onNotesChange"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const defaultNotes = computed(() => _props["defaultNotes"] === undefined ? NOTES : _props["defaultNotes"]);
  const onNotesChange = computed(() => _props["onNotesChange"]);
  const notes = shallowRef<Note[]>(initialState(defaultNotes.value));
  const setNotes = stateSetter(notes);
  const commit = computed(() => (next: Note[]) => {
    setNotes(next);
    onNotesChange.value?.(next);
  });
  const notebook = shallowRef(initialState(ALL));
  const setNotebook = stateSetter(notebook);
  const selectedId = shallowRef<string | null>(initialState(defaultNotes.value.some(n => n.id === FEATURED) ? FEATURED : defaultNotes.value[0]?.id ?? null));
  const setSelectedId = stateSetter(selectedId);
  const mode = shallowRef<EditorMode>(initialState("page"));
  const setMode = stateSetter(mode);
  const view = shallowRef<"list" | "editor">(initialState("list"));
  const setView = stateSetter(view);
  const counter = shallowRef(0);
  const shelf = shallowRef<HTMLHeadingElement | null>(null);
  const handBack = shallowRef(initialState(false));
  const setHandBack = stateSetter(handBack);
  const note = computed(() => notes.value.find(n => n.id === selectedId.value));
  const notebookName = computed(() => NOTEBOOKS.find(nb => nb.id === note.value?.notebook)?.name ?? "");
  watchDependencies(() => {
    if (!handBack.value) return;
    shelf.value?.focus();
    setHandBack(false);
  }, () => [handBack.value], false);
  const grid = shallowRef<HTMLDivElement | null>(null);
  const shown = shallowRef(view.value);
  watchDependencies(() => {
    if (shown.value === view.value) return;
    shown.value = view.value;
    if (handBack.value) return;
    const gone = grid.value?.querySelector<HTMLElement>(view.value === "editor" ? "[data-slot=notes-app-list]" as const : "[data-slot=notes-app-editor]" as const);
    if (!gone || getComputedStyle(gone).display !== "none") return;
    const target = view.value === "editor" ? grid.value?.querySelector<HTMLElement>("[data-slot=notes-app-editor]") : grid.value?.querySelector<HTMLElement>("[data-slot=notes-app-list] [aria-current=true]") ?? shelf.value;
    target?.focus();
  }, () => [view.value, handBack.value], false);
  const open = computed(() => (id: string) => {
    setSelectedId(id);
    setMode("page");
    setView("editor");
  });
  const create = computed(() => () => {
    const id = `page-${counter.value++}`;
    const home = notebook.value === ALL ? "scraps" as const : notebook.value;
    commit.value([{
      id,
      notebook: home,
      title: "" as const,
      body: "" as const,
      updated: "just now" as const,
      reads: 0
    }, ...notes.value]);
    setSelectedId(id);
    setMode("write");
    setView("editor");
  });
  const change = computed(() => (patch: Partial<Pick<Note, "title" | "body" | "reads">>) => commit.value(notes.value.map(n => n.id === selectedId.value ? {
    ...n,
    ...patch,
    updated: "just now" as const
  } : n)));
  const remove = computed(() => () => {
    const rest = notes.value.filter(n => n.id !== selectedId.value);
    commit.value(rest);
    setSelectedId(rest.find(n => notebook.value === ALL || n.notebook === notebook.value)?.id ?? null);
    setMode("page");
    setView("list");
    setHandBack(true);
  });
  return () => {
    return <div class="@container/notes w-full">
      <div ref={grid} data-slot="notes-app" data-view={view.value} class={cn("group/notes grid h-[48rem] max-h-[100svh] min-h-[32rem] w-full grid-cols-1 grid-rows-[minmax(0,1fr)] gap-6 p-4 pt-10 @4xl/notes:grid-cols-[minmax(20rem,24rem)_minmax(0,1fr)] @4xl/notes:p-6 @4xl/notes:pt-12", className.value)}>
        <NotesAppNoteList notes={notes.value} notebook={notebook.value} onNotebookChange={setNotebook} selectedId={selectedId.value} onSelect={open.value} onNew={create.value} headingRef={shelf} class="group-data-[view=editor]/notes:@max-4xl/notes:hidden" />
        {note.value ? <NotesAppEditor key={note.value.id} note={note.value} notebookName={notebookName.value} mode={mode.value} onModeChange={setMode} onChange={change.value} onDelete={remove.value} onBack={() => setView("list")} class="group-data-[view=list]/notes:@max-4xl/notes:hidden" /> : <Paper as="section" stock="card" aria-label="Editor" class="grid place-items-center group-data-[view=list]/notes:@max-4xl/notes:hidden">
            <Empty seed="no-page">
              <EmptyHeader>
                <EmptyMedia pose="idle" size={104} />
                <EmptyTitle>Pick a page</EmptyTitle>
                <EmptyDescription>Open one from the shelf, or start a new page with the button up there.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </Paper>}
      </div>
    </div>;
  };
});
export default NotesApp;
