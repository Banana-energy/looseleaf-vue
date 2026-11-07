// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
export const meta = {
  title: "Several open, square bracket" as const,
  description: "`type=\"multiple\"` keeps every row you open. `bracket=\"square\"` swaps the brace for a square bracket, and `bracket={false}` leaves the margin empty. Buttons inside a panel keep their focus rings: an open panel is not clipped." as const,
  layout: "center" as const,
  height: 420
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Accordion type="multiple" bracket="square" defaultValue={["shipping", "returns"]} class="w-full max-w-md">
      <AccordionItem value="shipping">
        <AccordionTrigger>Shipping</AccordionTrigger>
        <AccordionContent class="flex flex-col items-start gap-3">
          <p>Orders leave the desk on Tuesdays and Fridays, wrapped in brown paper and tied with string.</p>
          <Button variant="outline" size="sm">
            Track a parcel
          </Button>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="returns">
        <AccordionTrigger>Returns</AccordionTrigger>
        <AccordionContent>Send it back within thirty days, unused and unlined.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="notes">
        <AccordionTrigger>Gift notes</AccordionTrigger>
        <AccordionContent>We write these by hand. Tell us what to say in the order comments.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="wholesale" disabled>
        <AccordionTrigger>Wholesale (closed for the season)</AccordionTrigger>
        <AccordionContent>Back in spring.</AccordionContent>
      </AccordionItem>
    </Accordion>;
  };
});
export default Example;
