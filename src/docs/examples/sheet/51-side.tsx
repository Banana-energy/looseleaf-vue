// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
export const meta = {
  title: "Side" as const,
  description: "Official `sheet-side`: four triggers in a two-column grid, one page per edge. Three fixes to the original: its inputs were controlled with no `onChange` (frozen), so they take `defaultValue`; its ids repeated four times, so each carries its side; and the field grid gets `px-4` to line up with the header." as const,
  layout: "center" as const,
  height: 200
};
const SHEET_SIDES = ["top", "right", "bottom", "left"] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid grid-cols-2 gap-2">
      {SHEET_SIDES.map(side => <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline">{side}</Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>Make changes to your profile here. Click save when you&apos;re done.</SheetDescription>
            </SheetHeader>
            <div class="grid gap-4 px-4 py-4">
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for={`sheet-side-${side}-name`} class="text-end">
                  Name
                </Label>
                <Input id={`sheet-side-${side}-name`} defaultValue="Pedro Duarte" class="col-span-3" />
              </div>
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for={`sheet-side-${side}-username`} class="text-end">
                  Username
                </Label>
                <Input id={`sheet-side-${side}-username`} defaultValue="@peduarte" class="col-span-3" />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>)}
    </div>;
  };
});
export default Example;
