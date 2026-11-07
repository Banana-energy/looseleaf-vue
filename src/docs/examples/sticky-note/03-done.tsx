// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { StickyNote, StickyNoteContent, StickyNoteTitle } from "@/components/ui/sticky-note";
export const meta = {
  title: "Done" as const,
  description: "Pass `done` and the note gets a pencil tick box. Add `onDoneChange` and the box can be pressed: the tick is written with a felt pen and the text struck through. A note that loads done just shows it." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const done = shallowRef(initialState(false));
  const setDone = stateSetter(done);
  return () => {
    return <div class="flex flex-wrap items-start justify-center gap-10 p-6">
      <StickyNote color="green" done={done.value} onDoneChange={setDone} seed="live">
        <StickyNoteTitle>post the parcel</StickyNoteTitle>
        <StickyNoteContent>before the office shuts. Press the box.</StickyNoteContent>
      </StickyNote>
      <StickyNote color="yellow" done seed="loaded">
        <StickyNoteTitle>ink pens</StickyNoteTitle>
        <StickyNoteContent>two fine, one brush</StickyNoteContent>
      </StickyNote>
    </div>;
  };
});
export default Example;
