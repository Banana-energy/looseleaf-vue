// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Spinner } from "@/components/ui/spinner";
export const meta = {
  title: "Sizes and colors" as const,
  description: "Size it with size-*; the scribble is redrawn for the size (fewer, wider turns when it is small). It draws in whatever text color it sits in. With reduced motion on, every one of these stands still, whole." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-col gap-6">
      <div class="flex items-center gap-6">
        <Spinner class="size-3" aria-label="Loading, extra small" />
        <Spinner />
        <Spinner class="size-6" aria-label="Loading, medium" />
        <Spinner class="size-8" aria-label="Loading, large" />
        <Spinner class="size-12" aria-label="Loading, extra large" />
        <Spinner class="size-16" aria-label="Loading, huge" />
      </div>
      <div class="flex items-center gap-6">
        <Spinner class="size-8 text-ink-you" aria-label="Loading, blue" />
        <Spinner class="size-8 text-red" aria-label="Loading, red" />
        <Spinner class="size-8 text-green" aria-label="Loading, green" />
        <Spinner class="size-8 text-pencil-text" aria-label="Loading, pencil" />
      </div>
    </div>;
  };
});
export default Example;
