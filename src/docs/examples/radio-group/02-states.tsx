// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
export const meta = {
  title: "Sizes and states" as const,
  description: "16, 20 and 28 px; off, on, invalid (red pencil, still red on top of the dot) and disabled (dashed, graphite dot). A horizontal group lays its radios in a row." as const,
  layout: "stack" as const
};
const sizes = [["size-4", "16 px"], ["size-5", "20 px"], ["size-7", "28 px"]] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid gap-5">
      {sizes.map(([size, name]) => <RadioGroup key={size} orientation="horizontal" defaultValue="on" class="items-center gap-x-7" aria-label={name}>
          <span class="w-14 text-sm text-ink-muted">{name}</span>
          <RadioGroupItem value="off" class={size} aria-label={`${name} off`} />
          <RadioGroupItem value="on" class={size} aria-label={`${name} on`} />
          <RadioGroupItem value="bad" class={size} aria-invalid aria-label={`${name} invalid`} />
          <RadioGroupItem value="locked" class={size} disabled aria-label={`${name} disabled`} />
        </RadioGroup>)}
    </div>;
  };
});
export default Example;
