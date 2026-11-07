// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
export const meta = {
  title: "Range, ticks and tones" as const,
  description: "Two values make a range slider. `ticks` hangs pencil marks under the groove (one per step, or a number of intervals); `tone` swaps the marker for a highlighter or blue felt." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const price = shallowRef(initialState([200, 650]));
  const setPrice = stateSetter(price);
  return () => {
    return <div class="grid w-full max-w-md gap-8">
      <div class="grid gap-3">
        <div class="flex items-baseline justify-between">
          <Label id="price-label">Price</Label>
          <span class="ll-num font-script text-2xl leading-none text-ink-you">
            ${price.value[0]} to ${price.value[1]}
          </span>
        </div>
        <Slider value={price.value} onValueChange={setPrice} min={0} max={1000} step={50} ticks aria-labelledby="price-label" />
      </div>
      <div class="grid gap-3">
        <Label id="hi-label">Highlighter</Label>
        <Slider defaultValue={[3]} min={0} max={5} step={1} ticks tone="hi" aria-labelledby="hi-label" />
      </div>
      <div class="grid gap-3">
        <Label id="felt-label">Felt tip</Label>
        <Slider defaultValue={[40]} ticks={4} tone="blue" aria-labelledby="felt-label" />
      </div>
    </div>;
  };
});
export default Example;
