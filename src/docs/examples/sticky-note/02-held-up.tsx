// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { StickyNote, StickyNoteContent, StickyNoteFooter, StickyNoteTitle } from "@/components/ui/sticky-note";
export const meta = {
  title: "Curled, pinned, taped" as const,
  description: "`curl` lifts the bottom-right corner; `fastener` and `tape` hold a note up. Any size works: the text wraps and the sheet follows." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-start justify-center gap-10 p-6">
      <StickyNote curl fastener="pin" seed="a">
        <StickyNoteTitle>pinned</StickyNoteTitle>
        <StickyNoteContent>a curl, and a tomato pin</StickyNoteContent>
      </StickyNote>
      <StickyNote color="blue" tape="top" tapeKind="masking" seed="b" class="w-56">
        <StickyNoteTitle>taped</StickyNoteTitle>
        <StickyNoteContent>a strip of masking tape across the top</StickyNoteContent>
        <StickyNoteFooter>from Ada</StickyNoteFooter>
      </StickyNote>
      <StickyNote color="green" seed="c" class="h-28 w-32 min-h-0">
        <StickyNoteContent>small</StickyNoteContent>
      </StickyNote>
      <StickyNote color="pink" seed="d" class="w-72 min-h-28">
        <StickyNoteContent>a wide one, because notes can be any size you cut them to</StickyNoteContent>
      </StickyNote>
    </div>;
  };
});
export default Example;
