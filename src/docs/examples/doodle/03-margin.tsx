// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Doodle } from "@/components/ui/doodle";
export const meta = {
  title: "In the margin" as const,
  description: "Doodles live in the decoration layer: turned a few degrees, tucked in the corner of a card, next to a title." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="ll-paper ll-stock-slip ll-sheet-slip ll-tilt-2 relative w-full max-w-sm p-6 text-ink">
      <Doodle name="star" size={48} rotate={14} class="absolute -top-3 -right-2" />
      <h3 class="font-script text-3xl">Weekend list</h3>
      <p class="mt-2 text-pencil-text">Pick flowers, find the good mushrooms, call it a day.</p>
      <div class="mt-3 flex items-end gap-3">
        <Doodle name="flower" size={48} rotate={-6} />
        <Doodle name="mushroom" size={48} rotate={5} flip />
        <Doodle name="sun" size={48} />
      </div>
    </div>;
  };
});
export default Example;
