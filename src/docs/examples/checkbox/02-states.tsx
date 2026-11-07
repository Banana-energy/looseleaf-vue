// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "States and sizes" as const,
  description: "Off, on, partly on, invalid and disabled in 16, 20 and 28 px. The label of a disabled box fades with it (peer-disabled)." as const,
  layout: "stack" as const
};
const sizes = [["size-4", "16 px"], ["size-5", "20 px"], ["size-7", "28 px"]] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid gap-5">
      {sizes.map(([size, name]) => <div key={size} class="flex flex-wrap items-center gap-x-6 gap-y-3">
          <span class="w-14 text-sm text-ink-muted">{name}</span>
          <Checkbox class={size} aria-label={`${name} off`} />
          <Checkbox class={size} defaultChecked aria-label={`${name} on`} />
          <Checkbox class={size} checked="indeterminate" onCheckedChange={() => {}} aria-label={`${name} partly`} />
          <Checkbox class={size} aria-invalid aria-label={`${name} invalid`} />
          <Checkbox class={size} disabled aria-label={`${name} disabled`} />
          <Checkbox class={size} disabled defaultChecked aria-label={`${name} disabled on`} />
        </div>)}
      <div class="flex items-center gap-2">
        <Checkbox id="locked" disabled defaultChecked />
        <Label for="locked">Locked by your admin</Label>
      </div>
    </div>;
  };
});
export default Example;
