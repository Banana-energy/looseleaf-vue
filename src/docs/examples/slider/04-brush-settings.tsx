// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
export const meta = {
  title: "Brush settings" as const,
  description: "Three controlled sliders in a panel, each with its own readout, and a reset that puts every knob back where it started. The values are the only state; the drawings do not change." as const,
  layout: "stack" as const
};
const initial = {
  size: 12,
  opacity: 85,
  hardness: 40
};
const rows = [["size", "Size", "px", 1, 48], ["opacity", "Opacity", "%", 0, 100], ["hardness", "Hardness", "%", 0, 100]] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const v = shallowRef(initialState(initial));
  const setV = stateSetter(v);
  return () => {
    return <div class="grid w-full max-w-sm gap-5">
      {rows.map(([key, label, unit, min, max]) => <div key={key} class="grid gap-2.5">
          <div class="flex items-baseline justify-between">
            <Label id={`${key}-label`}>{label}</Label>
            <output class="ll-num text-sm text-ink-muted">
              {v.value[key]}
              {unit}
            </output>
          </div>
          <Slider aria-labelledby={`${key}-label`} getValueText={n => `${n} ${unit === "%" ? "percent" as const : "pixels" as const}`} min={min} max={max} value={[v.value[key]]} onValueChange={([n]) => setV(s => ({
          ...s,
          [key]: n
        }))} tone={key === "hardness" ? "blue" as const : "marker" as const} />
        </div>)}
      <div>
        <Button variant="outline" size="sm" onClick={() => setV(initial)}>
          Reset
        </Button>
      </div>
    </div>;
  };
});
export default Example;
