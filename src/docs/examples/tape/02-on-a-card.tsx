// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Paper } from "@/components/ui/paper";
import { Tape } from "@/components/ui/tape";
export const meta = {
  title: "Holding a card" as const,
  description: "Tape is placed with className, like any element: absolute, a little outside the sheet, turned. The strip's own angle is seeded and never more than a few degrees." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Paper stock="index-card" seed="taped" class="relative mx-auto mt-6 min-h-[120px] w-72 px-6 pt-3.5 pb-4">
      <Tape kind="washi-stripes" angle={-36} class="absolute -top-2 -left-7" seed="l" />
      <Tape kind="washi-zigzag" angle={34} class="absolute -top-2 -right-7" seed="r" />
      <p class="font-script text-[1.7rem] leading-[30px] font-bold">Taped at an angle</p>
      <p class="text-[15px] leading-[30px]">Two strips of washi, no pins.</p>
    </Paper>;
  };
});
export default Example;
