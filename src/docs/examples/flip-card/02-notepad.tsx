// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { FlipCard, FlipCardBack, FlipCardFront } from "@/components/ui/flip-card";
export const meta = {
  title: "Notepad flip" as const,
  description: "axis=\"x\" turns it like a page of a top-bound pad. Any paper works for either face." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 280
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <FlipCard axis="x" class="h-52 w-64" label="Turn the page">
      <FlipCardFront stock="sticky-yellow">
        <span class="text-3xl">pancakes</span>
        <span class="font-hand text-sm">turn me over for the recipe</span>
      </FlipCardFront>
      <FlipCardBack stock="index-card" class="items-start text-left text-xl">
        <span>2 eggs, 200 g flour,</span>
        <span>300 ml milk. Whisk, rest,</span>
        <span>fry until it smells right.</span>
      </FlipCardBack>
    </FlipCard>;
  };
});
export default Example;
