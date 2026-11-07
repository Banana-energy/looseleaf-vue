// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Progress } from "@/components/ui/progress";
export const meta = {
  title: "Sizes, tones and waiting" as const,
  description: "sm, default and lg; marker, highlighter, grass and sky inks. Without a value the bar is indeterminate: a marker scribble slides across (it holds still, mid-bar, with reduced motion)." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid w-full max-w-md gap-4">
      <Progress value={45} size="sm" aria-label="Small" />
      <Progress value={45} aria-label="Default" />
      <Progress value={45} size="lg" aria-label="Large" />
      <Progress value={70} tone="hi" aria-label="Highlighter" />
      <Progress value={70} tone="green" aria-label="Grass" />
      <Progress value={70} tone="blue" aria-label="Sky" />
      <Progress aria-label="Waiting" />
    </div>;
  };
});
export default Example;
