// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
export const meta = {
  title: "Default" as const,
  description: "The heading is drawn on left to right as it comes into view, once, with a marker tip writing it (nib). Replay mounts it again; on a long page it waits until you scroll to it." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const run = shallowRef(initialState(0));
  const setRun = stateSetter(run);
  return () => {
    return <div class="flex max-w-xl flex-col items-start gap-4">
      <Reveal key={run.value} nib class="font-script text-5xl leading-none">
        Drawn by hand, on the way in.
      </Reveal>
      <p class="text-sm text-muted-foreground">Nothing is hidden from screen readers while it waits.</p>
      <Button size="sm" variant="outline" onClick={() => setRun(n => n + 1)}>
        Replay
      </Button>
    </div>;
  };
});
export default Example;
