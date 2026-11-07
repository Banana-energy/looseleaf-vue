// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Slider } from "@/components/ui/slider";
export const meta = {
  title: "Vertical" as const,
  description: "A mixing desk: `orientation=\"vertical\"` stands the groove up; the range grows from the bottom. The last fader is disabled." as const,
  layout: "center" as const,
  height: 300
};
const bands = [["60", 40], ["230", 65], ["910", 50], ["3k", 80], ["14k", 30]] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex h-56 items-stretch gap-8">
      {bands.map(([hz, v], i) => <div key={hz} class="flex flex-col items-center gap-3">
          <Slider orientation="vertical" defaultValue={[v]} disabled={i === bands.length - 1} aria-label={`${hz} Hz`} ticks={4} class="min-h-0 flex-1" />
          <span class="text-sm text-ink-muted">{hz}</span>
        </div>)}
    </div>;
  };
});
export default Example;
