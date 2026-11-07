// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Paper } from "@/components/ui/paper";
export const meta = {
  title: "A receipt" as const,
  description: "Thermal paper with pinked top and bottom, a mono print and a dashed total. The `receipt` stock is the same recipe as every other, cut differently." as const,
  layout: "stack" as const
};
const rows = [["oat latte", "4.50"], ["washi x3", "9.00"], ["glue stick", "2.10"]] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Paper stock="receipt" seed="till" class="mx-auto w-64 px-5 py-7 font-type text-sm">
      <p class="text-center text-base tracking-widest">Looseleaf Cafe</p>
      <ul class="mt-3 border-y border-dashed border-pencil-mark py-2">
        {rows.map(([item, price]) => <li key={item} class="flex justify-between">
            <span>{item}</span>
            <span class="ll-num">{price}</span>
          </li>)}
      </ul>
      <p class="mt-2 flex justify-between text-base">
        <span>TOTAL</span>
        <span class="ll-num text-red">15.60</span>
      </p>
      <p class="mt-3 text-center text-xs text-muted-foreground">thank you - come again</p>
    </Paper>;
  };
});
export default Example;
