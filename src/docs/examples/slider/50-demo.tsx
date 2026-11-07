// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
export const meta = {
  title: "Demo" as const,
  description: "Official `slider-demo`: a single value from 0 to 100 at 60% width, written as a component that forwards its props (so a caller can pass `defaultValue`, `max`, `step` or `className`). The marker range is drawn once and clipped to the value; the only addition is an `aria-label`, which the knob needs." as const,
  layout: "center" as const
};
type SliderProps = UI.ComponentProps<typeof Slider>;
const Example = defineUi<SliderProps>("Example", ["class"], (_props, {
  slots: _slots
}) => {
  const className = computed(() => _props["class"]);
  const props = computed(() => omitProps(_props, ["class"]));
  return () => {
    return <Slider defaultValue={[50]} max={100} step={1} aria-label="Volume" class={cn("w-[60%]", className.value)} {...domProps(props.value)}>{_slots.default?.()}</Slider>;
  };
});
export default Example;
