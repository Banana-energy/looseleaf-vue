// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Column } from "@/blocks/kanban-board/components/kanban-board-column";
import { COLUMNS, notes as sample, TEAM, type ColumnId, type Label, type Note } from "@/blocks/kanban-board/components/kanban-board-data";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Sticker } from "@/components/ui/sticker";
const KanbanBoard = defineUi<{
  as?: "main" | "div";
}>("KanbanBoard", ["as"], (_props, {
  slots: _slots
}) => {
  const Root = computed(() => jsxTag(_props["as"] === undefined ? "main" as const : _props["as"]));
  const notes = shallowRef<Note[]>(initialState(sample));
  const setNotes = stateSetter(notes);
  const dragging = shallowRef<string | null>(initialState(null));
  const setDragging = stateSetter(dragging);
  const over = shallowRef<ColumnId | null>(initialState(null));
  const setOver = stateSetter(over);
  const message = shallowRef(initialState(""));
  const setMessage = stateSetter(message);
  const focus = shallowRef<{
    id: string;
    via: "back" | "forward" | null;
  } | null | null>(null);
  const board = shallowRef<HTMLDivElement | null>(null);
  watchDependencies(() => {
    const target = focus.value;
    if (!target) return;
    focus.value = null;
    const card = board.value?.querySelector<HTMLElement>(`[data-note-id="${CSS.escape(target.id)}"]`);
    const wanted = target.via ? card?.querySelector<HTMLElement>(`[data-move="${target.via}"]`) : null;
    const any = card?.querySelector<HTMLElement>("[data-move]");
    (wanted ?? any)?.focus();
  }, () => [notes.value], true);
  const titleOf = computed(() => (id: ColumnId) => COLUMNS.find(c => c.id === id)?.title ?? id);
  return () => {
    function move(id: string, to: ColumnId, via: "back" | "forward" | null) {
      const note = notes.value.find(n => n.id === id);
      if (!note || note.column === to) return;
      const count = notes.value.filter(n => n.column === to).length + 1;
      focus.value = {
        id,
        via
      };
      setNotes(all => [...all.filter(n => n.id !== id), {
        ...note,
        column: to
      }]);
      setMessage(`Moved “${note.title}” to ${titleOf.value(to)}. ${titleOf.value(to)} has ${count} ${count === 1 ? "note" as const : "notes" as const}.`);
    }
    function add(column: ColumnId, title: string, label: Label) {
      const next = Math.max(0, ...notes.value.map(n => Number(n.id.slice(1)) || 0)) + 1;
      setNotes(all => [...all, {
        id: `n${next}`,
        title,
        label,
        who: TEAM[0],
        column
      }]);
      setMessage(`Added “${title}” to ${titleOf.value(column)}.`);
    }
    return <Root.value class="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <header class="flex flex-wrap items-end justify-between gap-4">
        <div class="flex max-w-prose flex-col gap-1">
          <div class="flex items-center gap-3">
            <h1 class="font-script text-4xl leading-none font-bold sm:text-5xl">Launch week</h1>
            <Sticker name="rocket" size={64} seed="kanban-rocket" class="hidden shrink-0 sm:block" />
          </div>
          <p class="text-muted-foreground">Six days to the autumn drop. Move a note with its arrows, pick it up and drop it, or write a new one.</p>
        </div>
        <AvatarGroup aria-label="On this board" role="group" class="[&>*+*]:-ms-0.5">
          {TEAM.map(name => <Avatar key={name}>
              <AvatarFallback name={name} />
            </Avatar>)}
        </AvatarGroup>
      </header>

      <div ref={board} class="grid items-start gap-4 md:grid-cols-3">
        {COLUMNS.map(c => <Column key={c.id} id={c.id} title={c.title} hint={c.hint} notes={notes.value.filter(n => n.column === c.id)} dragging={dragging.value} over={over.value === c.id} onOver={on => setOver(on ? c.id : o => o === c.id ? null : o)} onMove={move} onDragstart={(id, e) => {
          e.dataTransfer.setData("text/plain", id);
          e.dataTransfer.effectAllowed = "move";
          setDragging(id);
        }} onDragend={() => {
          setDragging(null);
          setOver(null);
        }} onDrop={(to, e) => {
          const id = e.dataTransfer.getData("text/plain") || dragging.value;
          setDragging(null);
          if (id) move(id, to, null);
        }} onAdd={(title, label) => add(c.id, title, label)} onClear={c.id === "done" ? () => {
          const n = notes.value.filter(x => x.column === "done").length;
          setNotes(all => all.filter(x => x.column !== "done"));
          setMessage(`Cleared ${n} done ${n === 1 ? "note" as const : "notes" as const}.`);
        } : undefined} />)}
      </div>
      <p role="status" aria-label="Board updates" class="sr-only">
        {message.value}
      </p>
    </Root.value>;
  };
});
export default KanbanBoard;
