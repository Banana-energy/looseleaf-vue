// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { addDays, endOfMonth, startOfMonth, subDays } from "date-fns";
import type { DateRange } from "@/lib/calendar-primitive";
import { DateRangePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "A date range" as const,
  description: "Two ends in one field. Type 'Sep 9, 2026 to Sep 24, 2026' or open the two-month calendar: each week of the range gets one highlighter swipe, and the slip puts itself away when the second end is chosen." as const,
  layout: "center" as const,
  height: 500
};
const handleLast7 = (): DateRange => ({
  from: subDays(new Date(), 6),
  to: new Date()
});
const handleThisMonth = (): DateRange => ({
  from: startOfMonth(new Date()),
  to: endOfMonth(new Date())
});
const handleNext14 = (): DateRange => ({
  from: new Date(),
  to: addDays(new Date(), 13)
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const range = shallowRef<DateRange | undefined>(initialState({
    from: new Date(2026, 8, 9),
    to: new Date(2026, 8, 24)
  }));
  const setRange = stateSetter(range);
  return () => {
    return <div class="grid w-80 gap-2">
      <Label for="stay">Dates</Label>
      <DateRangePicker id="stay" value={range.value} onValueChange={setRange} presets={[{
        label: "Last 7 days" as const,
        value: handleLast7
      }, {
        label: "This month" as const,
        value: handleThisMonth
      }, {
        label: "Next 14 days" as const,
        value: handleNext14
      }]} calendarProps={{
        today: new Date(2026, 8, 15),
        defaultMonth: new Date(2026, 8)
      }} />
    </div>;
  };
});
export default Example;
