// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
export const meta = {
  title: "Arrow and sides" as const,
  description: "A felt-tip arrow points at the trigger, whichever side the popover opens on (Reka UI flips it near the edge of the screen). The arrow's height is added to sideOffset for you." as const,
  layout: "center" as const,
  height: 380
};
const SIDES = ["top", "right", "bottom", "left"] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-center justify-center gap-3">
      {SIDES.map(side => <Popover key={side}>
          <PopoverTrigger asChild>
            <Button variant="outline" class="capitalize">
              {side}
            </Button>
          </PopoverTrigger>
          <PopoverContent arrow side={side} sideOffset={4} stock="sticky-yellow" seed={`arrow-${side}`} class="w-56 text-sm">
            <PopoverHeader>
              <PopoverTitle>Margin note</PopoverTitle>
              <PopoverDescription class="text-foreground/80">Opened on the {side} side of its trigger.</PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>)}
    </div>;
  };
});
export default Example;
