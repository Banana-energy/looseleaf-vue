// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { StickerBoard, type StickerBoardItem } from "@/components/ui/sticker-board";
export const meta = {
  title: "Stick things down" as const,
  description: "Drag a sticker anywhere. Pick one and a dashed frame appears with a ring to turn it by and a square to size it; the toolbar and the keyboard do the same." as const,
  layout: "stack" as const,
  stage: "desk" as const,
  height: 560
};
const START: StickerBoardItem[] = [{
  id: "planet" as const,
  name: "ringed-planet" as const,
  x: 130,
  y: 130,
  rot: -8,
  scale: 1.2,
  z: 0
}, {
  id: "rocket" as const,
  name: "rocket" as const,
  x: 290,
  y: 100,
  rot: 24,
  scale: 1,
  z: 1
}, {
  id: "cloud" as const,
  name: "cloud-smile" as const,
  x: 432,
  y: 150,
  rot: -3,
  scale: 1.1,
  z: 2
}, {
  id: "sun" as const,
  name: "sun-shades" as const,
  x: 310,
  y: 262,
  rot: 10,
  scale: 1.25,
  z: 3
}, {
  id: "done" as const,
  name: "done" as const,
  x: 130,
  y: 290,
  rot: 6,
  scale: 0.9,
  z: 4
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <StickerBoard class="h-[30rem] w-full" defaultValue={START} />;
  };
});
export default Example;
