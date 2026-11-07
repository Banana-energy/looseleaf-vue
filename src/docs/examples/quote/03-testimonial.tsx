// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Quote, QuoteAttribution, QuoteText } from "@/components/ui/quote";
import { Paper } from "@/components/ui/paper";
import { Signature } from "@/components/ui/signature";
export const meta = {
  title: "A testimonial card" as const,
  description: "A quote on a taped index card with the customer's signature under it: three hand-made parts that share a pen. The words sit on the card's printed rules." as const,
  layout: "center" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Paper stock="index-card" tape="corner" tilt seed="quote-card" class="w-full max-w-md p-7">
      <p class="h-4 font-type text-xs leading-4 text-pencil-text">Kind words</p>
      <Quote class="gap-1">
        <QuoteText animate size="md" class="pt-0 leading-[30px]">
          I stopped using three apps the week I found this. It just looks like my notebook.
        </QuoteText>
        <QuoteAttribution>Mira, ceramicist</QuoteAttribution>
      </Quote>
      <div class="mt-1.5 flex justify-end">
        <Signature size="sm" animate delay={900}>
          Mira Okonkwo
        </Signature>
      </div>
    </Paper>;
  };
});
export default Example;
