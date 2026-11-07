// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { StickyNote, StickyNoteContent, StickyNoteFooter, StickyNoteTitle } from "@/components/ui/sticky-note";
import { cn } from "@/lib/utils";
import { COLUMNS, LABEL_COLOR, type ColumnId, type Note } from "@/blocks/kanban-board/components/kanban-board-data";
type Direction = "back" | "forward";
export const NoteCard = defineUi<{
  note: Note;
  dragging: boolean;
  onMove: (id: string, to: ColumnId, via: Direction) => void;
  onDragstart: (id: string, e: UI.DragEvent) => void;
  onDragend: () => void;
}>("NoteCard", ["note", "dragging", "onMove", "onDragstart", "onDragend"], (_props, {
  slots: _slots
}) => {
  const note = computed(() => _props["note"]);
  const dragging = computed(() => _props["dragging"]);
  const onMove = computed(() => _props["onMove"]);
  const onDragstart = computed(() => _props["onDragstart"]);
  const onDragend = computed(() => _props["onDragend"]);
  const at = computed(() => COLUMNS.findIndex(c => c.id === note.value.column));
  const back = computed(() => COLUMNS[at.value - 1]);
  const forward = computed(() => COLUMNS[at.value + 1]);
  return () => {
    return <StickyNote data-note-id={note.value.id} color={LABEL_COLOR[note.value.label]} done={note.value.column === "done" ? true : undefined} fastener={note.value.column === "doing" ? "pin" as const : false} seed={note.value.id} draggable onDragstart={(e: DragEvent) => onDragstart.value(note.value.id, e)} onDragend={onDragend.value} class={cn("min-h-0 w-full cursor-grab gap-2 px-4 pt-6 pb-3 active:cursor-grabbing", dragging.value && "opacity-50")}>
      <p class="font-type text-xs text-ink-soft">{note.value.label}</p>
      <StickyNoteContent>
        <StickyNoteTitle role="heading" aria-level={3} class="text-[1.5rem] leading-[1.05]">
          {note.value.title}
        </StickyNoteTitle>
        {note.value.detail ? <p class="mt-1 text-[1.15rem] leading-tight">{note.value.detail}</p> : null}
      </StickyNoteContent>
      <StickyNoteFooter class="flex items-center gap-2 pt-1">
        <Avatar size="sm" ring="none" aria-hidden="true">
          <AvatarFallback name={note.value.who} />
        </Avatar>
        <span class="min-w-0 flex-1 truncate">
          {note.value.who.split(" ")[0]}
          {note.value.due ? <span class="text-ink-soft"> · due {note.value.due}</span> : null}
        </span>
        <span class="flex shrink-0 items-center gap-0.5">
          {back.value ? <Button variant="ghost" size="icon-sm" data-move="back" aria-label={`Move “${note.value.title}” to ${back.value.title}`} onClick={() => onMove.value(note.value.id, back.value.id, "back")}>
              <Icon name="arrow-left" />
            </Button> : null}
          {forward.value ? <Button variant="ghost" size="icon-sm" data-move="forward" aria-label={`Move “${note.value.title}” to ${forward.value.title}`} onClick={() => onMove.value(note.value.id, forward.value.id, "forward")}>
              <Icon name="arrow-right" />
            </Button> : null}
        </span>
      </StickyNoteFooter>
    </StickyNote>;
  };
});
