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
  title: "Steps, decimals and units" as const,
  description: "A step of 0.5 on a price (no float drift, shown with two places), a temperature in whole degrees with the wheel opt-in (click into it and scroll), and a value that snaps to multiples of five." as const,
  layout: "stack" as const,
  height: 320
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const price = shallowRef<number | undefined>(initialState(4.5));
  const setPrice = stateSetter(price);
  const temp = shallowRef<number | undefined>(initialState(20));
  const setTemp = stateSetter(temp);
  const grams = shallowRef<number | undefined>(initialState(250));
  const setGrams = stateSetter(grams);
  return () => {
    return <div class="mx-auto grid w-full max-w-xs gap-7">
      <div class="grid justify-items-start gap-2">
        <Label for="price">Price</Label>
        <Stepper id="price" value={price.value} onValueChange={setPrice} min={0} step={0.5} precision={2} format={n => `$${n.toFixed(2)}`} parse={t => Number.parseFloat(t.replace("$", ""))} class="w-44" />
      </div>
      <div class="grid justify-items-start gap-2">
        <Label for="temp">Oven (wheel steps it while focused)</Label>
        <Stepper id="temp" value={temp.value} onValueChange={setTemp} min={-10} max={250} wheel format={n => `${n} C`} parse={t => Number.parseInt(t, 10)} class="w-44" />
      </div>
      <div class="grid justify-items-start gap-2">
        <Label for="grams">Flour, in fives</Label>
        <Stepper id="grams" value={grams.value} onValueChange={setGrams} min={0} max={1000} step={5} largeStep={50} snap format={n => `${n} g`} parse={t => Number.parseInt(t, 10)} class="w-44" />
      </div>
    </div>;
  };
});
export default Example;
