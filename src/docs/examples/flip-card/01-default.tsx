// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { FlipCard, FlipCardBack, FlipCardFront } from "@/components/ui/flip-card";
export const meta = {
  title: "Default" as const,
  description: "Click it, or Tab to it and press Space. The card lifts off the desk as it turns." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 260
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <FlipCard label="Show the answer">
      <FlipCardFront>
        <span class="text-4xl">le chat</span>
        <span class="font-hand text-sm text-pencil-text">(masculine noun)</span>
      </FlipCardFront>
      <FlipCardBack>
        <span class="text-4xl">the cat</span>
        <span class="font-hand text-sm text-pencil-text">purrs, ignores you</span>
      </FlipCardBack>
    </FlipCard>;
  };
});
export default Example;
