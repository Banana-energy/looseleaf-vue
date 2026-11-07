// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
export const meta = {
  title: "Four sides" as const,
  description: "The page is bound along whichever edge faces the middle of the screen: the coils hang on the left of a right-hand page, along the bottom of a page that comes from the top." as const,
  layout: "center" as const,
  height: 220
};
const SIDES = ["top", "right", "bottom", "left"] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-center justify-center gap-3">
      {SIDES.map(side => <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline" class="capitalize">
              {side}
            </Button>
          </SheetTrigger>
          <SheetContent side={side} seed={`side-${side}`}>
            <SheetHeader>
              <SheetTitle>From the {side}</SheetTitle>
              <SheetDescription>A page slides in from the {side} edge of the screen. Click outside, press Escape or tap the x to put it away.</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>)}
    </div>;
  };
});
export default Example;
