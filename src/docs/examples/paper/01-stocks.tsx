// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Paper } from "@/components/ui/paper";
export const meta = {
  title: "Stocks" as const,
  description: "Paper is a recipe: a color, a tooth, a shadow and the rules printed on it. Each stock lies at its own small angle." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const stocks = ["paper", "slip", "index-card", "graph", "dot-grid", "kraft", "sticky-yellow", "sticky-pink"] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="@container w-full">
      <div class="grid grid-cols-2 gap-x-8 gap-y-8 p-2 @2xl:grid-cols-4">
        {stocks.map(stock => <figure key={stock} class="m-0 grid gap-2">
            <Paper stock={stock} seed={stock} class="h-24" />
            <figcaption class="font-script text-xl leading-none font-bold">{stock}</figcaption>
          </figure>)}
      </div>
    </div>;
  };
});
export default Example;
