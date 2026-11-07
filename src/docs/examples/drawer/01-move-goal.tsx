// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Icon } from "@/components/ui/icon";
export const meta = {
  title: "Move goal" as const,
  description: "The shadcn demo: a slip pulled up from the bottom, torn along its top edge and taped down by its grab tab. Drag the tape, flick it away, or press Escape." as const,
  layout: "center" as const
};
const DATA = [400, 300, 200, 300, 200, 278, 189, 239, 300, 200, 278, 189, 349];
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const goal = shallowRef(initialState(350));
  const setGoal = stateSetter(goal);
  const clamp = computed(() => (v: number) => Math.max(200, Math.min(400, v)));
  return () => {
    return <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent seed="goal">
        <div class="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Move goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div class="p-4 pb-0">
            <div class="flex items-center justify-center gap-4">
              <Button variant="outline" size="icon" class="shrink-0 rounded-full" onClick={() => setGoal(g => clamp.value(g - 10))} disabled={goal.value <= 200} aria-label="Decrease">
                <Icon name="minus" />
              </Button>
              <div class="text-center">
                <div class="ll-num font-script text-7xl leading-none font-bold tracking-tight">{goal.value}</div>
                <div class="font-type text-[0.7rem] text-muted-foreground">Calories/day</div>
              </div>
              <Button variant="outline" size="icon" class="shrink-0 rounded-full" onClick={() => setGoal(g => clamp.value(g + 10))} disabled={goal.value >= 400} aria-label="Increase">
                <Icon name="plus" />
              </Button>
            </div>
            <div class="mt-4 flex h-16 items-end justify-center gap-1" aria-hidden="true">
              {DATA.map((v, i) => <div key={i} class="w-2.5 border-x border-t border-pencil-mark bg-[repeating-linear-gradient(-58deg,var(--ll-pencil-mark)_0_1.2px,transparent_1.2px_3.6px)]" style={cssStyle({
                height: `${v / 400 * 100}%`
              })} />)}
            </div>
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>;
  };
});
export default Example;
