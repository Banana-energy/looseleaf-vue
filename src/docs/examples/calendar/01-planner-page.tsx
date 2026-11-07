// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Calendar } from "@/components/ui/calendar";
export const meta = {
  title: "Planner page" as const,
  description: "One chosen day, circled in marker; today underlined; the days before the 3rd hatched out. On its own sheet of card, taped at the corner. (Fixed dates, so the page looks the same tomorrow.)" as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 380
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const date = shallowRef<Date | undefined>(initialState(new Date(2026, 8, 17)));
  const setDate = stateSetter(date);
  return () => {
    return <Calendar mode="single" selected={date.value} onSelect={setDate} defaultMonth={new Date(2026, 8)} today={new Date(2026, 8, 15)} disabled={{
      before: new Date(2026, 8, 3)
    }} sheet={{
      stock: "card" as const,
      tape: "corner" as const,
      seed: "planner" as const
    }} seed="planner" />;
  };
});
export default Example;
