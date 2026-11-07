// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { IndexCard, IndexCardContent, IndexCardHeader, IndexCardTitle } from "@/components/ui/index-card";
import { Sticker } from "@/components/ui/sticker";
export const meta = {
  title: "Slapped on a card" as const,
  description: "A sticker on an index card. Size it small and it switches to its 64 px redraw." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <IndexCard seed="order-4471" class="relative max-w-sm">
      <Sticker name="done" size={64} class="absolute -top-5 -right-4" rotate={9} />
      <IndexCardHeader>
        <IndexCardTitle>Order 4471</IndexCardTitle>
      </IndexCardHeader>
      <IndexCardContent>
        <p class="max-w-[16rem]">Two notebooks, a pack of felt tips and one very small pencil.</p>
        <div class="relative">
          <Sticker name="cursor-click" size={40} rotate={-6} class="absolute -top-1 left-0" />
          <p class="ps-12">Track parcel</p>
        </div>
      </IndexCardContent>
    </IndexCard>;
  };
});
export default Example;
