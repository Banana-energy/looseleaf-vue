// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
export const meta = {
  title: "Snap points" as const,
  description: "Give the slip resting heights: it stops a third, two thirds or all the way up, and remembers where it is. The list only scrolls at the top snap point so a drag never fights a scroll." as const,
  layout: "center" as const
};
const SNAPS = [0.35, 0.7, 1];
const ITEMS = ["Buy oat milk", "Water the ferns", "Write to Ada", "Return the library book", "Sharpen pencils", "Fix the bike light", "Bake the second loaf", "Book the dentist", "Call mum", "Plan the trip", "Renew the passport", "Order stamps"];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const snap = shallowRef<number | string | null>(initialState(SNAPS[0]));
  const setSnap = stateSetter(snap);
  return () => {
    return <Drawer snapPoints={SNAPS} activeSnapPoint={snap.value} setActiveSnapPoint={setSnap} fadeFromIndex={0}>
      <DrawerTrigger asChild>
        <Button variant="outline">To-do slip</Button>
      </DrawerTrigger>
      <DrawerContent seed="snaps" class="h-full max-h-[97%]">
        <div class="mx-auto flex min-h-0 w-full max-w-sm flex-1 flex-col">
          <DrawerHeader>
            <DrawerTitle>Today</DrawerTitle>
            <DrawerDescription>Snapped at {Math.round(Number(snap.value) * 100)}% of the screen.</DrawerDescription>
          </DrawerHeader>
          <ul tabindex={snap.value === 1 ? 0 : undefined} aria-label="To-do list" class={"flex-1 space-y-1 px-4 pb-4 outline-hidden focus-visible:outline-2 focus-visible:outline-ring " + (snap.value === 1 ? "overflow-y-auto" as const : "overflow-hidden" as const)}>
            {ITEMS.map((t, i) => <li key={t} class="flex items-baseline gap-3 border-b border-dashed border-pencil-mark/50 py-1.5">
                <span class="ll-num w-5 text-right text-sm text-muted-foreground">{i + 1}</span>
                {t}
              </li>)}
          </ul>
        </div>
      </DrawerContent>
    </Drawer>;
  };
});
export default Example;
