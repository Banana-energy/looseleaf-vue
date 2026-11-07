// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Rating } from "@/components/ui/rating";
export const meta = {
  title: "Default" as const,
  description: "Hover to preview, click to choose. It is a radio group: Tab lands on the chosen glyph, then arrow keys, Home and End change the value." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const value = shallowRef(initialState(3));
  const setValue = stateSetter(value);
  return () => {
    return <div class="grid justify-items-start gap-2">
      <Rating value={value.value} onValueChange={setValue} aria-label="Rate this notebook" />
      <p class="text-sm text-ink-muted" aria-live="polite">
        {value.value ? `You gave it ${value.value} out of 5.` : "Not rated yet." as const}
      </p>
    </div>;
  };
});
export default Example;
