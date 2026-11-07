// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Blockquote, H1, H2, H3, H4, InlineCode, Large, Lead, List, Muted, P, Small } from "@/components/ui/typography";
export const meta = {
  title: "The scale" as const,
  description: "Every part in one page: headings with hand rules, a lead line, body text, a list, a quotation, inline code and the small sizes." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="max-w-[64ch]">
      <H1>Notes on keeping a notebook</H1>
      <Lead class="mt-4">A notebook is a small argument you have with yourself, one page at a time.</Lead>
      <P>
        Most of what I remember from a book is in the margins. Run <InlineCode>npm run notes</InlineCode> if you want it on the screen.
      </P>
      <H2 class="mt-8">What goes in the margin</H2>
      <List class="mt-4">
        <li>A question you cannot answer yet</li>
        <li>A disagreement, politely worded</li>
      </List>
      <H3 class="mt-6">A word from someone who knew</H3>
      <Blockquote>The best time to write it down was when it happened.</Blockquote>
      <H4 class="mt-6">Small print</H4>
      <div class="mt-1 flex flex-wrap items-baseline gap-x-6">
        <Large>Large</Large>
        <Small>Small</Small>
        <Muted>Muted, for captions</Muted>
      </div>
    </div>;
  };
});
export default Example;
