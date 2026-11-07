// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Calendar } from "@/components/ui/calendar";
const Planner = defineUi<{}>("Planner", [], (_props, {
  slots: _slots
}) => {
  const today = shallowRef(initialState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }));
  const date = shallowRef<Date | undefined>(initialState(() => new Date(today.value.getFullYear(), today.value.getMonth(), today.value.getDate() + 3)));
  const setDate = stateSetter(date);
  return () => {
    return <div data-home="planner" class="flex w-full justify-center">
      <Calendar mode="single" selected={date.value} onSelect={setDate} today={today.value} defaultMonth={today.value} disabled={{
        before: today.value
      }} sheet={{
        stock: "card" as const,
        tape: "corner" as const,
        seed: "home-planner" as const
      }} seed="home-planner" />
    </div>;
  };
});
export default Planner;
