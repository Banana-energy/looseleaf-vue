// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Ribbon } from "@/components/ui/ribbon";
export const meta = {
  title: "A banner" as const,
  description: "A band of colored paper with folded, swallow-tailed ends. The words are real text; the paper is drawn behind them and grows with them." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-col items-center gap-5">
      <Ribbon size="lg">New arrivals</Ribbon>
      <Ribbon tone="sky">Staff pick</Ribbon>
      <Ribbon size="sm" tone="grass">
        In stock
      </Ribbon>
    </div>;
  };
});
export default Example;
