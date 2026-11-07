// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Calendar } from "@/components/ui/calendar";
export const meta = {
  title: "Dropdowns and limits" as const,
  description: "Month and year are native selects in pencil boxes, so jumping to a birthday takes two taps. Weekends and the past are hatched out and cannot be chosen; the arrows stop at the ends of the range." as const,
  layout: "center" as const,
  height: 430
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const date = shallowRef<Date | undefined>(initialState(undefined));
  const setDate = stateSetter(date);
  return () => {
    return <Calendar mode="single" captionLayout="dropdown" selected={date.value} onSelect={setDate} defaultMonth={new Date(2026, 8)} startMonth={new Date(2024, 0)} endMonth={new Date(2028, 11)} today={new Date(2026, 8, 15)} disabled={[{
      dayOfWeek: [0, 6]
    }, {
      before: new Date(2026, 8, 15)
    }]} sheet seed="limits" footer={date.value ? `You picked ${date.value.toDateString()}.` : "Pick a weekday from the 15th on." as const} />;
  };
});
export default Example;
