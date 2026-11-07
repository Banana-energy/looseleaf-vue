// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
export const meta = {
  title: "Directions" as const,
  description: "Pull a slip in from any edge. Only the bottom slip is torn and taped (that is where the grab tab belongs); the others are plain slips you drag toward their edge." as const,
  layout: "center" as const
};
const DIRECTIONS = ["bottom", "top", "left", "right"] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-center justify-center gap-3">
      {DIRECTIONS.map(direction => <Drawer key={direction} direction={direction}>
          <DrawerTrigger asChild>
            <Button variant="outline" class="capitalize">
              {direction}
            </Button>
          </DrawerTrigger>
          <DrawerContent seed={`dir-${direction}`}>
            <DrawerHeader>
              <DrawerTitle>From the {direction}</DrawerTitle>
              <DrawerDescription>Drag it back toward the {direction} edge to put it away.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter class="mx-auto w-full max-w-xs">
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>)}
    </div>;
  };
});
export default Example;
