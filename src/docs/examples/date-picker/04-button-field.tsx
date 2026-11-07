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
  title: "As a button" as const,
  description: "typeable={false} makes the whole field a button that shows the date, like a Select. Below it: invalid, disabled and a dropdown caption for far-away dates such as birthdays." as const,
  layout: "stack" as const,
  height: 480
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const born = shallowRef<Date | undefined>(initialState(undefined));
  const setBorn = stateSetter(born);
  return () => {
    return <div class="mx-auto grid w-72 gap-4">
      <div class="grid gap-2">
        <Label for="born">Date of birth</Label>
        <DatePicker id="born" typeable={false} value={born.value} onValueChange={setBorn} placeholder="Pick your birthday" max={new Date(2026, 8, 15)} calendarProps={{
          captionLayout: "dropdown" as const,
          startMonth: new Date(1930, 0),
          endMonth: new Date(2026, 8),
          defaultMonth: born.value ?? new Date(1990, 5),
          today: new Date(2026, 8, 15)
        }} />
      </div>
      <div class="grid gap-2">
        <Label for="ship">Ship by</Label>
        <DatePicker id="ship" typeable={false} invalid defaultValue={new Date(2026, 8, 30)} />
      </div>
      <div class="grid gap-2">
        <Label for="closed">Closed on</Label>
        <DatePicker id="closed" disabled defaultValue={new Date(2026, 11, 25)} />
      </div>
    </div>;
  };
});
export default Example;
