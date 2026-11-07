// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Circled } from "@/components/ui/circled";
export const meta = {
  title: "Default" as const,
  description: "A loop around a word. It overshoots where it started, like a hand that did not quite stop." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <p class="max-w-md text-[17px] leading-[1.55]">
      We agreed to ship the first draft before <Circled tone="red" class="mx-2">Friday</Circled>, so please reply today with the numbers.
    </p>;
  };
});
export default Example;
