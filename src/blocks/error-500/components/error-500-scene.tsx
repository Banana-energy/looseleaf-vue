// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Doodle } from "@/components/ui/doodle";
import { Mascot } from "@/components/ui/mascot";
import { StickyNote, StickyNoteContent, StickyNoteTitle } from "@/components/ui/sticky-note";
const Error500Scene = defineUi<{}>("Error500Scene", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div data-slot="error-scene" aria-hidden="true" class="relative flex flex-wrap items-end justify-center gap-x-8 gap-y-8 pt-6">
      <div class="relative">
        <Doodle name="exclaim-burst" size={52} seed="e500-burst" class="absolute -start-9 -top-3" />
        <Mascot pose="oops" size={196} class="h-[196px] w-auto" />
      </div>
      <div class="relative">
        <Doodle name="lightning" size={72} seed="e500-bolt" class="absolute -top-14 -end-4" />
        <StickyNote color="pink" tape="top" tapeKind="masking" seed="e500-note" class="w-44">
          <StickyNoteTitle>sorry!</StickyNoteTitle>
          <StickyNoteContent class="text-xl">that one is on us</StickyNoteContent>
        </StickyNote>
      </div>
    </div>;
  };
});
export { Error500Scene };
