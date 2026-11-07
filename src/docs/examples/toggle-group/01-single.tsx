// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
export const meta = {
  title: "Pick one" as const,
  description: "type=single: one item is on, clicking it again clears it. Joined outline items share one box; the seam between two items is a short pencil stroke at the edge they share." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const align = shallowRef(initialState("center"));
  const setAlign = stateSetter(align);
  return () => {
    return <div class="flex flex-col items-start gap-4">
      <ToggleGroup type="single" variant="outline" value={align.value} onValueChange={v => v && setAlign(v)} aria-label="Text alignment">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>
      <p class="w-72 border-y border-dashed border-pencil-mark py-2 text-base" style={cssStyle({
        textAlign: align.value as "left" | "center" | "right"
      })}>
        Aligned {align.value}, the way the page would be.
      </p>
    </div>;
  };
});
export default Example;
