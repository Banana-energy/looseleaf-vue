// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { StickyNote, StickyNoteContent, StickyNoteTitle } from "@/components/ui/sticky-note";
export const meta = {
  title: "Five pads" as const,
  description: "Yellow, green, orange, pink and blue, each turned by its own seeded angle. The first word says what the note is." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const notes = [{
  color: "yellow" as const,
  title: "todo" as const,
  body: "buy more ink" as const
}, {
  color: "green" as const,
  title: "done" as const,
  body: "book the venue" as const
}, {
  color: "orange" as const,
  title: "careful" as const,
  body: "the glue is wet" as const
}, {
  color: "pink" as const,
  title: "urgent" as const,
  body: "call mum" as const
}, {
  color: "blue" as const,
  title: "tip" as const,
  body: "tape it down first" as const
}] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap justify-center gap-8 p-4">
      {notes.map(n => <StickyNote key={n.title} color={n.color} seed={n.title}>
          <StickyNoteTitle>{n.title}</StickyNoteTitle>
          <StickyNoteContent>{n.body}</StickyNoteContent>
        </StickyNote>)}
    </div>;
  };
});
export default Example;
