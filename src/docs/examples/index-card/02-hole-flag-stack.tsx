// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { IndexCard, IndexCardContent, IndexCardHeader, IndexCardTitle } from "@/components/ui/index-card";
export const meta = {
  title: "Rod hole, flag, pile" as const,
  description: "The details of a card that lived in a card box: a hole punched for the rod, a flag stuck over the edge, more cards behind it." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid gap-10 p-2 lg:grid-cols-2">
      <IndexCard hole flag="tomato" stack={3} seed="sources">
        <IndexCardHeader>
          <IndexCardTitle>Sources</IndexCardTitle>
        </IndexCardHeader>
        <IndexCardContent>
          <p>sketchbook, dip pen, ink</p>
          <p>sage green, ochre, madder</p>
        </IndexCardContent>
      </IndexCard>
      <IndexCard hole flag="sky" seed="words" class="min-h-[194px]">
        <IndexCardHeader>
          <IndexCardTitle>Words</IndexCardTitle>
        </IndexCardHeader>
        <IndexCardContent>
          <p>petrichor</p>
          <p>the smell of rain on dry earth</p>
        </IndexCardContent>
      </IndexCard>
    </div>;
  };
});
export default Example;
