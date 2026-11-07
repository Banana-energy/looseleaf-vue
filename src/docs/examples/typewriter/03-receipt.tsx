// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Paper } from "@/components/ui/paper";
import { Typewriter } from "@/components/ui/typewriter";
export const meta = {
  title: "Printing a receipt" as const,
  description: "A real use: an order confirmation types itself onto a receipt, and onDone brings in the button. `reserve` holds the height of the finished receipt, so the paper does not grow (or move, in a centered stage) as it prints. Print another remounts it with a new key." as const,
  layout: "center" as const,
  stage: "desk" as const,
  height: 420
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const run = shallowRef(initialState(0));
  const setRun = stateSetter(run);
  const done = shallowRef(initialState(false));
  const setDone = stateSetter(done);
  return () => {
    return <div class="flex flex-col items-center gap-4">
      <Paper stock="receipt" class="w-72 px-6 py-6" tilt={false}>
        <Typewriter key={run.value} text={["ORDER 0042", "one croissant", "one coffee, black", "one apology", "", "TOTAL  a smile"]} speed={26} pause={500} startOnView={false} reserve cursor="underscore" class="block text-base leading-7" onDone={() => setDone(true)} />
      </Paper>
      <div class="h-9">
        {done.value ? <Button size="sm" variant="outline" onClick={() => {
          setDone(false);
          setRun(r => r + 1);
        }}>
            Print another
          </Button> : null}
      </div>
    </div>;
  };
});
export default Example;
