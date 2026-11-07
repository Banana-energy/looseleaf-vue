// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import type { DateRange } from "@/lib/calendar-primitive";
import { Calendar } from "@/components/ui/calendar";
export const meta = {
  title: "A range across two months" as const,
  description: "Pick a first and a last day and each week gets one highlighter swipe with chisel ends; week numbers go in the margin behind a red pencil rule." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 420
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const range = shallowRef<DateRange | undefined>(initialState({
    from: new Date(2026, 8, 24),
    to: new Date(2026, 9, 6)
  }));
  const setRange = stateSetter(range);
  return () => {
    return <Calendar mode="range" numberOfMonths={2} showWeekNumber selected={range.value} onSelect={setRange} defaultMonth={new Date(2026, 8)} today={new Date(2026, 8, 15)} sheet={{
      stock: "paper" as const,
      fastener: "binder-clip" as const,
      tilt: 0.4
    }} seed="range" />;
  };
});
export default Example;
