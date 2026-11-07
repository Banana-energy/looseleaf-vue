// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Arrow } from "@/components/ui/arrow";
import { Button } from "@/components/ui/button";
export const meta = {
  title: "Pointing at an element" as const,
  description: "Give it a ref (or a selector) and the arrow leaves its small box and stops just short of the target, wherever the layout puts it. Resize the window and it follows." as const,
  layout: "stack" as const,
  height: 260
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const target = shallowRef<HTMLButtonElement | null>(null);
  return () => {
    return <div class="relative grid min-h-52 w-full max-w-xl grid-cols-[1fr_auto] items-center gap-8">
      <div class="flex items-center gap-2 text-[17px]">
        <span class="font-script text-2xl text-ink-you">the important one</span>
        <Arrow pointAt={target} curve="curved" tone="blue" class="size-6" />
      </div>
      <Button ref={target} class="mt-24">
        Publish
      </Button>
    </div>;
  };
});
export default Example;
