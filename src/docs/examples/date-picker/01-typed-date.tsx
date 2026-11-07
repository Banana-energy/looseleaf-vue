// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "Type it or pick it" as const,
  description: "Type a date any way you would write it (9/17/26, 2026-09-17, Sep 17, tomorrow) and press Enter, or open the calendar and circle a day. Days before the 3rd are hatched out, so typing one turns the box red." as const,
  layout: "center" as const,
  height: 470
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const date = shallowRef<Date | undefined>(initialState(new Date(2026, 8, 17)));
  const setDate = stateSetter(date);
  return () => {
    return <div class="grid w-72 gap-2">
      <Label for="due-date">Due date</Label>
      <DatePicker id="due-date" value={date.value} onValueChange={setDate} min={new Date(2026, 8, 3)} calendarProps={{
        today: new Date(2026, 8, 15),
        defaultMonth: new Date(2026, 8)
      }} />
      <p class="font-hand text-sm text-ink-muted">{date.value ? date.value.toDateString() : "No date yet." as const}</p>
    </div>;
  };
});
export default Example;
