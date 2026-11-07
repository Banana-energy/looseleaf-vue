// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { IndexCard, IndexCardContent, IndexCardFooter, IndexCardHeader, IndexCardTitle } from "@/components/ui/index-card";
export const meta = {
  title: "An index card" as const,
  description: "A red header rule, blue lines every 30 px, and text that sits on them. The title goes above the red line; the footer at the foot." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <IndexCard seed="recipes">
      <IndexCardHeader>
        <IndexCardTitle>Recipes</IndexCardTitle>
      </IndexCardHeader>
      <IndexCardContent>
        <p>oat porridge, the slow way</p>
        <p>soup that forgives</p>
        <p>toast, honestly</p>
      </IndexCardContent>
      <IndexCardFooter>
        <span class="ll-num">no. 0042</span>
        <span class="ll-num">p. 3</span>
      </IndexCardFooter>
    </IndexCard>;
  };
});
export default Example;
