// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
export const meta = {
  title: "Plan picker" as const,
  description: "Radios with a title and a line of help, and a second horizontal group for billing. Hovering the row lights its radio; the description hangs off the label with aria-describedby." as const,
  layout: "stack" as const
};
const plans = [["starter", "Starter", "One notebook, one pen, no rush."], ["studio", "Studio", "Ten notebooks and the good highlighters."], ["workshop", "Workshop", "A whole desk. Washi tape included."]] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid w-full max-w-md gap-6">
      <RadioGroup defaultValue="studio" aria-label="Plan" class="gap-4">
        {plans.map(([value, title, help]) => <div key={value} class="group/field flex items-start gap-3">
            <RadioGroupItem value={value} id={`plan-${value}`} aria-describedby={`plan-${value}-help`} class="-mt-0.5 size-5" />
            <div class="grid gap-1">
              <Label for={`plan-${value}`}>{title}</Label>
              <p id={`plan-${value}-help`} class="text-sm text-ink-muted">
                {help}
              </p>
            </div>
          </div>)}
      </RadioGroup>
      <RadioGroup defaultValue="yearly" orientation="horizontal" aria-label="Billing">
        {["monthly", "yearly"].map(value => <div key={value} class="flex items-center gap-2.5">
            <RadioGroupItem value={value} id={`bill-${value}`} />
            <Label for={`bill-${value}`} class="capitalize">
              {value}
            </Label>
          </div>)}
      </RadioGroup>
    </div>;
  };
});
export default Example;
