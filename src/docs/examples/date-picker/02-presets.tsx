// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { addDays, addMonths } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "With presets" as const,
  description: "A column of shortcuts beside the calendar. A preset can be a function, so 'in a week' is worked out when you choose it, not when the page was drawn." as const,
  layout: "center" as const,
  height: 470
};
const handleToday = () => new Date();
const handleTomorrow = () => addDays(new Date(), 1);
const handleInAWeek = () => addDays(new Date(), 7);
const handleNextMonth = () => addMonths(new Date(), 1);
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const date = shallowRef<Date | undefined>(initialState(undefined));
  const setDate = stateSetter(date);
  return () => {
    return <div class="grid w-72 gap-2">
      <Label for="remind">Remind me</Label>
      <DatePicker id="remind" value={date.value} onValueChange={setDate} placeholder="Pick a day" presets={[{
        label: "Today" as const,
        value: handleToday
      }, {
        label: "Tomorrow" as const,
        value: handleTomorrow
      }, {
        label: "In a week" as const,
        value: handleInAWeek
      }, {
        label: "Next month" as const,
        value: handleNextMonth
      }]} />
    </div>;
  };
});
export default Example;
