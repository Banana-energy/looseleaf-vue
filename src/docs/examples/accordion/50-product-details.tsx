// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
export const meta = {
  title: "Product details (long panels)" as const,
  description: "The shadcn demo: one row open at a time, the first open on arrival, and panels that hold more than one paragraph. Give AccordionContent a flex column and `text-balance` and the paragraphs space themselves." as const,
  layout: "center" as const,
  height: 460
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Accordion type="single" collapsible defaultValue="item-1" class="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Product information</AccordionTrigger>
        <AccordionContent class="flex flex-col gap-4 text-balance">
          <p>
            The Field Notebook is stitched by hand and lies flat on any desk. Its pages take fountain pen, felt tip and a
            careless highlighter without bleeding through.
          </p>
          <p>Key features include a lay-flat spine, a ribbon that is always long enough, and an elastic that has never once snapped.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Shipping details</AccordionTrigger>
        <AccordionContent class="flex flex-col gap-4 text-balance">
          <p>
            We post worldwide with trusted couriers. Standard delivery takes 3-5 working days; express arrives in 1-2.
          </p>
          <p>Every parcel is wrapped in brown paper and insured. You get a tracking link the moment it leaves the desk.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Return policy</AccordionTrigger>
        <AccordionContent class="flex flex-col gap-4 text-balance">
          <p>
            Send it back within 30 days if it is not right. If you are not completely happy, return it in its original condition.
          </p>
          <p>Return postage is on us, and the refund is with you within 48 hours of the parcel arriving back.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>;
  };
});
export default Example;
