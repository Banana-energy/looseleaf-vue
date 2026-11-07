// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { PeelCorner, PeelCornerPage, PeelCornerUnder } from "@/components/ui/peel-corner";
export const meta = {
  title: "Default" as const,
  description: "Hover the bottom-right corner, drag it, or click. The sheet underneath is out of reach until the corner is open." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 300
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <PeelCorner class="w-80">
      <PeelCornerPage class="h-52">
        <p class="font-script text-4xl leading-none">Spring sale</p>
        <p class="mt-2 text-sm">Everything in the shop, one week only.</p>
        <p class="mt-1 text-sm text-pencil-text">Peek under the corner for a code.</p>
      </PeelCornerPage>
      <PeelCornerUnder>
        <div class="text-end">
          <p class="font-script text-4xl leading-none">SAVE10</p>
          <p class="text-sm text-ink-soft">ten off your next order</p>
        </div>
      </PeelCornerUnder>
    </PeelCorner>;
  };
});
export default Example;
