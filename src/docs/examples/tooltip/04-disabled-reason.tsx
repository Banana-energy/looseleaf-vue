// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export const meta = {
  title: "Why is it disabled?" as const,
  description: "A disabled button gets no pointer or focus events, so it cannot show a tooltip. Wrap it in a focusable span and point aria-describedby at a reason that is always in the page (the note only exists while open): keyboard, mouse and screen-reader users all learn why." as const,
  layout: "center" as const,
  height: 240
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <TooltipProvider>
      <div class="pt-10">
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabindex={0} class="inline-block rounded-none" aria-describedby="why-disabled">
              <Button disabled class="pointer-events-none">
                Publish notebook
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent stock="sticky-pink" side="top">
            Add a title first, then you can publish.
          </TooltipContent>
        </Tooltip>
        <span id="why-disabled" class="sr-only">
          Add a title first, then you can publish.
        </span>
      </div>
    </TooltipProvider>;
  };
});
export default Example;
