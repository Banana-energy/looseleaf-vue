// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { PeelCorner, PeelCornerPage, PeelCornerUnder } from "@/components/ui/peel-corner";
export const meta = {
  title: "Left corner, kraft page" as const,
  description: "corner=\"bottom-left\" mirrors everything (use it for right-to-left pages); back=\"kraft\" makes the flap the same stock as the page." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 300
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <PeelCorner corner="bottom-left" back="kraft" size={100} class="w-72">
      <PeelCornerPage stock="kraft" class="h-48">
        <p class="font-script text-3xl leading-none">Field notes</p>
        <p class="mt-2 text-sm">Volume 4. Do not read the last page.</p>
      </PeelCornerPage>
      <PeelCornerUnder stock="index-card">
        <p class="font-script text-2xl leading-none">P.S. I told you.</p>
      </PeelCornerUnder>
    </PeelCorner>;
  };
});
export default Example;
