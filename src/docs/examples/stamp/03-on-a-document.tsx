// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Paper } from "@/components/ui/paper";
import { Stamp } from "@/components/ui/stamp";
export const meta = {
  title: "On a document" as const,
  description: "Stamps go on top of real content and never block it: the svg ignores the pointer and keeps its own name for screen readers." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Paper stock="slip" tilt={false} class="relative w-full max-w-md p-6 text-ink">
      <h3 class="font-script text-3xl">Invoice 2026-031</h3>
      <dl class="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
        <dt class="text-pencil-text">To</dt>
        <dd>The Paper Club</dd>
        <dt class="text-pencil-text">For</dt>
        <dd>Twelve notebooks, felt tips</dd>
        <dt class="text-pencil-text">Total</dt>
        <dd class="ll-num">$ 148.00</dd>
      </dl>
      <Stamp name="stamp-paid" class="absolute right-4 bottom-3" />
    </Paper>;
  };
});
export default Example;
