// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Label } from "@/components/ui/label";
import { Stepper } from "@/components/ui/stepper";
export const meta = {
  title: "Quantity" as const,
  description: "Press the plus, hold it to run, or type. Arrow keys step, Shift or PageUp / PageDown jump ten, Home and End go to the ends. At 10 the plus has nothing left and rattles the box." as const,
  layout: "center" as const,
  height: 200
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const qty = shallowRef<number | undefined>(initialState(2));
  const setQty = stateSetter(qty);
  return () => {
    return <div class="grid justify-items-start gap-2">
      <Label for="qty">Quantity</Label>
      <Stepper id="qty" value={qty.value} onValueChange={setQty} min={0} max={10} />
      <p class="font-hand text-sm text-ink-muted" aria-live="polite">
        {qty.value === undefined ? "Nothing chosen." as const : `${qty.value} in the basket.`}
      </p>
    </div>;
  };
});
export default Example;
