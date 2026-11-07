// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Rating } from "@/components/ui/rating";
export const meta = {
  title: "Survey rows" as const,
  description: "Several ratings side by side with their own labels and a running summary. Each row is labeled with aria-labelledby; the value text is your own." as const,
  layout: "stack" as const
};
const rows = [["pace", "Pace", "star"], ["snacks", "Snacks", "heart"], ["sun", "Sunshine", "sun"]] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const v = shallowRef<Record<string, number>>(initialState({
    pace: 4,
    snacks: 5,
    sun: 2
  }));
  const setV = stateSetter(v);
  const total = computed(() => Object.values(v.value).reduce((a, b) => a + b, 0));
  return () => {
    return <div class="grid w-full max-w-sm gap-3">
      {rows.map(([key, label, icon]) => <div key={key} class="flex items-center justify-between gap-4">
          <span id={`sv-${key}`} class="text-[15px] font-bold">
            {label}
          </span>
          <Rating icon={icon} value={v.value[key]} onValueChange={n => setV(s => ({
          ...s,
          [key]: n
        }))} aria-labelledby={`sv-${key}`} clearable />
        </div>)}
      <p class="ll-num text-sm text-ink-muted">Total: {total.value} of 15</p>
    </div>;
  };
});
export default Example;
