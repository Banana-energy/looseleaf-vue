// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { StickerBoard, StickerBoardCanvas, type StickerBoardItem } from "@/components/ui/sticker-board";
export const meta = {
  title: "A reward chart" as const,
  description: "A read-only board is a display: the stickers a student has earned, lying where the teacher stuck them. No handles, no tab stops, no toolbar." as const,
  layout: "stack" as const,
  stage: "desk" as const,
  height: 420
};
const EARNED: StickerBoardItem[] = [{
  id: "a" as const,
  name: "a-plus" as const,
  x: 96,
  y: 90,
  rot: -6,
  scale: 0.9,
  z: 0
}, {
  id: "b" as const,
  name: "hundred" as const,
  x: 236,
  y: 84,
  rot: 8,
  scale: 0.9,
  z: 1
}, {
  id: "c" as const,
  name: "first-place" as const,
  x: 376,
  y: 96,
  rot: -4,
  scale: 0.9,
  z: 2
}, {
  id: "d" as const,
  name: "rating-five" as const,
  x: 130,
  y: 210,
  rot: 3,
  scale: 0.9,
  z: 3
}, {
  id: "e" as const,
  name: "number-one" as const,
  x: 300,
  y: 216,
  rot: -9,
  scale: 0.9,
  z: 4
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="w-full max-w-xl">
      <h3 class="mb-2 font-script text-3xl text-foreground">Maya's stickers, week 12</h3>
      <StickerBoard readOnly value={EARNED} size={84} label="Maya's earned stickers" class="h-72">
        <StickerBoardCanvas class="flex-1" stock="ledger" />
      </StickerBoard>
    </div>;
  };
});
export default Example;
