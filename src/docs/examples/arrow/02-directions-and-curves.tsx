// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Arrow } from "@/components/ui/arrow";
export const meta = {
  title: "Directions, shafts and heads" as const,
  description: "Eight directions, each straight and curved; then the curl and the five heads." as const,
  layout: "stack" as const
};
const DIRS = ["right", "left", "up", "down", "up-right", "up-left", "down-right", "down-left"] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid gap-6">
      <div class="grid grid-cols-4 gap-x-4 gap-y-2 sm:grid-cols-8">
        {DIRS.map(d => <Arrow key={d} direction={d} class="h-12 w-16" />)}
        {DIRS.map(d => <Arrow key={`c-${d}`} direction={d} curve="curved" tone="blue" class="h-12 w-16" />)}
      </div>
      <div class="flex flex-wrap items-end gap-x-6 gap-y-4">
        <figure class="grid justify-items-center gap-1">
          <Arrow direction="right" curve="curl" tone="red" class="h-12 w-40" />
          <figcaption class="font-type text-[11px] text-pencil-text">curl</figcaption>
        </figure>
        {(["v", "two", "open", "solid", "none"] as const).map(h => <figure key={h} class="grid justify-items-center gap-1">
            <Arrow direction="up-right" curve="curved" head={h} tone="ink" class="h-12 w-20" />
            <figcaption class="font-type text-[11px] text-pencil-text">{h}</figcaption>
          </figure>)}
      </div>
    </div>;
  };
});
export default Example;
