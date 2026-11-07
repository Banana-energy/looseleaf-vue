// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, useId } from "vue";
import { Button } from "@/components/ui/button";
import { Paper } from "@/components/ui/paper";
import { Tally } from "@/components/ui/tally";
import { AddNote } from "@/blocks/kanban-board/components/kanban-board-add-note";
import { NoteCard } from "@/blocks/kanban-board/components/kanban-board-card";
import type { ColumnId, Label, Note } from "@/blocks/kanban-board/components/kanban-board-data";
export const Column = defineUi<{
  id: ColumnId;
  title: string;
  hint: string;
  notes: Note[];
  dragging: string | null;
  over: boolean;
  onOver: (over: boolean) => void;
  onMove: (id: string, to: ColumnId, via: "back" | "forward") => void;
  onDragstart: (id: string, e: UI.DragEvent) => void;
  onDragend: () => void;
  onDrop: (to: ColumnId, e: UI.DragEvent) => void;
  onAdd: (title: string, label: Label) => void;
  onClear?: () => void;
}>("Column", ["id", "title", "hint", "notes", "dragging", "over", "onOver", "onMove", "onDragstart", "onDragend", "onDrop", "onAdd", "onClear"], (_props, {
  slots: _slots
}) => {
  const id = computed(() => _props["id"]);
  const title = computed(() => _props["title"]);
  const hint = computed(() => _props["hint"]);
  const notes = computed(() => _props["notes"]);
  const dragging = computed(() => _props["dragging"]);
  const over = computed(() => _props["over"]);
  const onOver = computed(() => _props["onOver"]);
  const onMove = computed(() => _props["onMove"]);
  const onDragstart = computed(() => _props["onDragstart"]);
  const onDragend = computed(() => _props["onDragend"]);
  const onDrop = computed(() => _props["onDrop"]);
  const onAdd = computed(() => _props["onAdd"]);
  const onClear = computed(() => _props["onClear"]);
  const headingId = useId();
  return () => {
    return <section aria-labelledby={headingId} data-column={id.value} class="min-w-0">
      <Paper stock="graph" tilt={false} seed={`kanban-${id.value}`} class="flex h-full flex-col gap-3 p-4">
        <header class="flex items-start gap-2">
          <div class="min-w-0 flex-1">
            <h2 id={headingId} class="font-script text-[1.9rem] leading-none font-bold">
              {title.value}
            </h2>
            <p class="text-sm text-muted-foreground">{hint.value}</p>
          </div>
          {onClear.value && notes.value.length ? <Button variant="ghost" size="sm" onClick={onClear.value} aria-label={`Clear the ${notes.value.length} done ${notes.value.length === 1 ? "note" as const : "notes" as const}`}>
              Clear
            </Button> : null}
          <Tally count={notes.value.length} size="md" seed={`kanban-tally-${id.value}`} label={`${notes.value.length} ${notes.value.length === 1 ? "note" as const : "notes" as const}`} class="mt-1" />
        </header>
        <div data-over={over.value ? "true" as const : undefined} class="flex min-h-40 flex-1 flex-col gap-4 p-1 data-[over=true]:outline-2 data-[over=true]:outline-offset-2 data-[over=true]:outline-dashed data-[over=true]:outline-ink-you" onDragover={(e: DragEvent) => {
          if (!dragging.value) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          if (!over.value) onOver.value(true);
        }} onDragleave={(e: DragEvent) => {
          if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node | null)) onOver.value(false);
        }} onDrop={(e: DragEvent) => {
          e.preventDefault();
          onOver.value(false);
          onDrop.value(id.value, e);
        }}>
          {notes.value.length ? <ul role="list" class="flex flex-col gap-4">
              {notes.value.map(n => <li key={n.id}>
                  <NoteCard note={n} dragging={dragging.value === n.id} onMove={onMove.value} onDragstart={onDragstart.value} onDragend={onDragend.value} />
                </li>)}
            </ul> : <p class="py-6 text-center text-sm text-muted-foreground">Nothing here yet. Drop a note, or write a new one.</p>}
        </div>
        <AddNote column={title.value} onAdd={onAdd.value} />
      </Paper>
    </section>;
  };
});
