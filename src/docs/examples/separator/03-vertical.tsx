// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Separator } from "@/components/ui/separator";
export const meta = {
  title: "Vertical rules" as const,
  description: "In a flex row give the separator a height (h-5, or self-stretch). Each vertical rule is its own drawing, so no two are quite alike." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-col gap-8">
      <div class="flex h-6 items-center gap-4 text-[15px]">
        <span>Sketches</span>
        <Separator orientation="vertical" />
        <span>Recipes</span>
        <Separator orientation="vertical" />
        <span>Receipts</span>
        <Separator orientation="vertical" />
        <span>Maps</span>
      </div>
      <div class="flex h-6 items-center gap-4 text-[15px]">
        <span>12 pages</span>
        <Separator orientation="vertical" variant="dotted" />
        <span>3 tabs</span>
        <Separator orientation="vertical" variant="dotted" />
        <span>1 coffee ring</span>
      </div>
      <div class="flex h-10 items-center gap-6 text-[15px]">
        <span>Draft</span>
        <Separator orientation="vertical" variant="stitched" />
        <span>Review</span>
        <Separator orientation="vertical" variant="tape" />
        <span>Done</span>
        <Separator orientation="vertical" variant="wavy" />
        <span>Filed</span>
      </div>
    </div>;
  };
});
export default Example;
