// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
export const meta = {
  title: "In a field" as const,
  description: "A group of days inside a Field keeps the width of its buttons, and `aria-invalid` (a Form's FormControl sets it) draws the one shared box in red pencil, like any invalid field. Pick a day and it turns back to ink." as const,
  layout: "stack" as const
};
const DAYS = [{
  id: "mon" as const,
  short: "M" as const,
  label: "Monday" as const
}, {
  id: "tue" as const,
  short: "T" as const,
  label: "Tuesday" as const
}, {
  id: "wed" as const,
  short: "W" as const,
  label: "Wednesday" as const
}, {
  id: "thu" as const,
  short: "T" as const,
  label: "Thursday" as const
}, {
  id: "fri" as const,
  short: "F" as const,
  label: "Friday" as const
}, {
  id: "sat" as const,
  short: "S" as const,
  label: "Saturday" as const
}, {
  id: "sun" as const,
  short: "S" as const,
  label: "Sunday" as const
}];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const days = shallowRef<string[]>(initialState([]));
  const setDays = stateSetter(days);
  const invalid = computed(() => days.value.length === 0);
  return () => {
    return <Field data-invalid={invalid.value || undefined} class="max-w-sm">
      <FieldLabel id="quiet-days-label">Quiet days</FieldLabel>
      <ToggleGroup type="multiple" variant="outline" value={days.value} onValueChange={setDays} aria-labelledby="quiet-days-label" aria-describedby="quiet-days-help" aria-invalid={invalid.value}>
        {DAYS.map(d => <ToggleGroupItem key={d.id} value={d.id} aria-label={d.label}>
            {d.short}
          </ToggleGroupItem>)}
      </ToggleGroup>
      <FieldDescription id="quiet-days-help">No notifications on these days.</FieldDescription>
      {invalid.value ? <FieldError>Choose at least one day.</FieldError> : null}
    </Field>;
  };
});
export default Example;
