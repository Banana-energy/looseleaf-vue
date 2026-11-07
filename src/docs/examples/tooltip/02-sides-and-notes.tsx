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
  title: "Sides and notes" as const,
  description: "The arrow follows whichever side the note opens on (Reka UI flips it near the edge of the screen). Any stock makes a note: sticky pads in four colors, or a plain slip." as const,
  layout: "center" as const,
  height: 300
};
const NOTES = [{
  side: "top" as const,
  stock: "sticky-yellow" as const,
  text: "Yellow, on top" as const
}, {
  side: "right" as const,
  stock: "sticky-blue" as const,
  text: "Blue, to the right" as const
}, {
  side: "bottom" as const,
  stock: "sticky-pink" as const,
  text: "Pink, below" as const
}, {
  side: "left" as const,
  stock: "slip" as const,
  text: "A plain slip, on the left" as const
}] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <TooltipProvider>
      <div class="flex flex-wrap items-center justify-center gap-4">
        {NOTES.map(n => <Tooltip key={n.side}>
            <TooltipTrigger asChild>
              <Button variant="outline" class="capitalize">
                {n.side}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={n.side} stock={n.stock} seed={n.side}>
              {n.text}
            </TooltipContent>
          </Tooltip>)}
      </div>
    </TooltipProvider>;
  };
});
export default Example;
