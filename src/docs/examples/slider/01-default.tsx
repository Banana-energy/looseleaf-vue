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
  title: "Default" as const,
  description: "Drag the knob, or focus it and use the arrow keys, Home, End and Page Up / Down. The marker range follows the value; nothing is redrawn while you drag." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const volume = shallowRef(initialState([60]));
  const setVolume = stateSetter(volume);
  return () => {
    return <div class="grid w-full max-w-sm gap-3">
      <div class="flex items-baseline justify-between">
        <Label id="volume-label">Pencil pressure</Label>
        <output class="ll-num font-script text-2xl leading-none text-ink-you">
          {volume.value[0]}
        </output>
      </div>
      <Slider value={volume.value} onValueChange={setVolume} max={100} step={1} aria-labelledby="volume-label" />
    </div>;
  };
});
export default Example;
