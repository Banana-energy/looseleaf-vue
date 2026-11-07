// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
export const meta = {
  title: "Questions" as const,
  description: "Ruled rows on a page. Opening one turns the chevron over, draws a margin brace beside the text (written top to bottom in blue pencil) and lets the words soak in. `type=\"single\" collapsible` opens one at a time and lets you close it again." as const,
  layout: "center" as const,
  height: 320
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Accordion type="single" collapsible defaultValue="item-1" class="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It follows the WAI-ARIA accordion pattern: one tab stop per row, arrows between rows, and every panel is labeled by its trigger.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it drawn by hand?</AccordionTrigger>
        <AccordionContent>Every rule, brace and highlighter swipe is a pen stroke, seeded so the same page always looks the same.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Does it respect reduced motion?</AccordionTrigger>
        <AccordionContent>Yes. With reduced motion the rows open at once and the brace simply appears.</AccordionContent>
      </AccordionItem>
    </Accordion>;
  };
});
export default Example;
