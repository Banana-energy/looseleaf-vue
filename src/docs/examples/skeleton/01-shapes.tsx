// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Skeleton } from "@/components/ui/skeleton";
export const meta = {
  title: "Shapes" as const,
  description: "Whatever shape the class says: text lines, a circle for an avatar, a picture, a row of buttons. Watch one for a few seconds: the outline and the hatch are redrawn three times over, slowly." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex w-full max-w-md flex-col gap-6" aria-busy="true">
      <div class="flex items-center gap-4">
        <Skeleton class="size-12 rounded-full" />
        <div class="flex flex-col gap-2">
          <Skeleton class="h-4 w-[250px]" />
          <Skeleton class="h-4 w-[200px]" />
        </div>
      </div>
      <Skeleton class="h-36 w-full" />
      <div class="flex flex-col gap-2">
        <Skeleton class="h-3 w-full" />
        <Skeleton class="h-3 w-[92%]" />
        <Skeleton class="h-3 w-[64%]" />
      </div>
      <div class="flex gap-3">
        <Skeleton class="h-9 w-24" />
        <Skeleton class="h-9 w-20" />
        <Skeleton class="size-9 rounded-full" />
      </div>
    </div>;
  };
});
export default Example;
