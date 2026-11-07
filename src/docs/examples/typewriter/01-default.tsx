// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Typewriter } from "@/components/ui/typewriter";
export const meta = {
  title: "Default" as const,
  description: "It waits until it is on screen, then types at an uneven pace, holding at the comma and the period." as const,
  layout: "stack" as const,
  height: 160
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <p class="min-h-[5.25rem] max-w-xl text-3xl leading-snug">
      <Typewriter text="Every screen, drawn by hand. Nothing here was made by a ruler." startOnView={false} />
    </p>;
  };
});
export default Example;
