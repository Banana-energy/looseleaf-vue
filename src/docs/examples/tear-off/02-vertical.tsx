// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { TearOff, TearOffBody, TearOffStub } from "@/components/ui/tear-off";
export const meta = {
  title: "Stub below" as const,
  description: "orientation=\"vertical\" hangs the stub under the ticket, like the free coffee on a punch card. Kraft stock, and it is pulled down." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 330
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <TearOff orientation="vertical" tornMessage="One free coffee, redeemed.">
      <TearOffBody stock="kraft" class="w-56 px-5 py-4">
        <p class="font-script text-3xl leading-none">Coffee card</p>
        <p class="mt-2 text-sm">nine stamped, one free</p>
      </TearOffBody>
      <TearOffStub stock="sticky-yellow" class="h-20 w-56">
        <span class="font-script text-3xl leading-none">free coffee</span>
      </TearOffStub>
    </TearOff>;
  };
});
export default Example;
