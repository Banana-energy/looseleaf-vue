// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { TearOff, TearOffBody, TearOffStub } from "@/components/ui/tear-off";
export const meta = {
  title: "Default" as const,
  description: "Pull the stub away, tap it, or focus it and press Enter. The scissors have already started." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 250
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <TearOff>
      <TearOffBody class="w-64">
        <p class="font-script text-3xl leading-none">Studio night</p>
        <p class="mt-2 text-sm">Friday, doors at 7</p>
        <p class="mt-3 text-sm text-pencil-text">admit one, keep this half</p>
      </TearOffBody>
      <TearOffStub class="w-32 justify-start gap-0 pt-3.5 pb-2" label="Tear off the 10% off coupon">
        <span class="font-script text-3xl leading-[30px]">10% off</span>
        <span class="text-sm leading-[30px] text-pencil-text">your next visit</span>
      </TearOffStub>
    </TearOff>;
  };
});
export default Example;
