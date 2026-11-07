// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Highlight } from "@/components/ui/highlight";
export const meta = {
  title: "Wraps, and draws on" as const,
  description: "A phrase that runs onto three lines gets three swipes, one per line, that start and stop where the words do. Press replay to watch it being drawn." as const,
  layout: "stack" as const,
  height: 220
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const on = shallowRef(initialState(true));
  const setOn = stateSetter(on);
  return () => {
    return <div class="grid max-w-sm gap-4">
      <p class="text-[17px] leading-[1.55]">
        If you only remember one thing from this page, remember{" "}
        <Highlight animate show={on.value} tone="pink">
          that the margin is where the reading happens, and the page is only where it starts
        </Highlight>
        . Everything else is decoration.
      </p>
      <Button variant="outline" size="sm" class="w-fit" onClick={() => {
        setOn(false);
        setTimeout(() => setOn(true), 60);
      }}>
        Replay
      </Button>
    </div>;
  };
});
export default Example;
