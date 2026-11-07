// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { IndexCard, IndexCardContent, IndexCardFooter, IndexCardHeader, IndexCardTitle } from "@/components/ui/index-card";
export const meta = {
  title: "Taped, clipped, stacked" as const,
  description: "Paper's tape and fasteners work on a card as on any sheet. Cards turn under a quarter of a degree, so the printed lines stay level under the text." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid gap-x-10 gap-y-12 p-4 md:grid-cols-2">
      <IndexCard tape="both" tapeKind="washi-dots" stack={1} seed="washi" class="min-h-[194px]">
        <IndexCardHeader>
          <IndexCardTitle>Taped up</IndexCardTitle>
        </IndexCardHeader>
        <IndexCardContent>
          <p>two strips of washi</p>
        </IndexCardContent>
      </IndexCard>
      <IndexCard fastener="clip" seed="clip" class="min-h-[194px]">
        <IndexCardHeader>
          <IndexCardTitle>Clipped</IndexCardTitle>
        </IndexCardHeader>
        <IndexCardContent>
          <p>a paper clip, top right</p>
        </IndexCardContent>
        <IndexCardFooter>
          <span>page 1 of 1</span>
        </IndexCardFooter>
      </IndexCard>
    </div>;
  };
});
export default Example;
