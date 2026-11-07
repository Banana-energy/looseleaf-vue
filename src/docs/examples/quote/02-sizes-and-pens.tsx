// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Quote, QuoteAttribution, QuoteText } from "@/components/ui/quote";
export const meta = {
  title: "Sizes, pens and the rule" as const,
  description: "Three sizes of marks (the padding grows with them), felt pens instead of marker, and a pencil rule down the edge that runs between the marks of a longer quotation." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid items-start gap-x-10 gap-y-8 sm:grid-cols-2">
      <Quote>
        <QuoteText size="sm" class="text-xl">Small and quiet.</QuoteText>
      </Quote>
      <Quote>
        <QuoteText size="lg" tone="blue" weight="brush">Big and blue.</QuoteText>
        <QuoteAttribution class="ps-[4.75rem]">Sam</QuoteAttribution>
      </Quote>
      <Quote>
        <QuoteText rule tone="red" class="max-w-xs">A rule down the side, in pencil, so a long quotation keeps its edge all the way down.</QuoteText>
      </Quote>
      <Quote>
        <QuoteText tone="ink" weight="fine">Ink, with a fine hand.</QuoteText>
      </Quote>
    </div>;
  };
});
export default Example;
