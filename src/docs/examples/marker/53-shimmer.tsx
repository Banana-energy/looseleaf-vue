// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Marker, MarkerContent } from "@/components/ui/marker";
export const meta = {
  title: "Shimmer" as const,
  description: "shadcn's `marker-shimmer`: a status line that breathes while it is streaming. shadcn ships a `shimmer` utility for this; Looseleaf does not have one yet, so the example uses `motion-safe:animate-pulse`, which stops for readers who ask for less motion." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex w-full max-w-sm flex-col gap-8 py-4">
      <Marker role="status">
        <MarkerContent class="motion-safe:animate-pulse">Thinking...</MarkerContent>
      </Marker>
      <Marker variant="separator" role="status">
        <MarkerContent class="motion-safe:animate-pulse">Reading 4 files</MarkerContent>
      </Marker>
    </div>;
  };
});
export default Example;
