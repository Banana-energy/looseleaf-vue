// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Bracket } from "@/components/ui/bracket";
export const meta = {
  title: "Default" as const,
  description: "A square bracket down the start side of two paragraphs." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Bracket class="max-w-md">
      <p class="text-[17px] leading-[1.6]">These two paragraphs are one idea, and the bracket says so.</p>
      <p class="mt-2 text-[17px] leading-[1.6]">You could nod and keep reading, or you could underline them and come back next week.</p>
    </Bracket>;
  };
});
export default Example;
