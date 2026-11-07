// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Paper } from "@/components/ui/paper";
import { StampButton, StampSurface } from "@/components/ui/stamp-button";
export const meta = {
  title: "Stamp the page" as const,
  description: "Press the stamp and an impression lands on the document with a thump; the page gives a little. Press it again and a fresh strike replaces the last (Approve twice is still one APPROVED)." as const,
  layout: "stack" as const,
  stage: "desk" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <StampSurface class="w-full max-w-md">
      <Paper stock="slip" tilt={false} class="p-6 pb-4 text-ink">
        <h3 class="font-script text-3xl">Invoice 2026-031</h3>
        <dl class="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
          <dt class="text-pencil-text">To</dt>
          <dd>The Paper Club</dd>
          <dt class="text-pencil-text">For</dt>
          <dd>Twelve notebooks, felt tips</dd>
          <dt class="text-pencil-text">Total</dt>
          <dd class="ll-num">$ 148.00</dd>
        </dl>
        <div class="mt-24 flex items-end gap-4">
          <StampButton stamp="stamp-approved" place={{
            x: 0.66,
            y: 0.5
          }}>
            Approve
          </StampButton>
          <StampButton stamp="stamp-void" place={{
            x: 0.5,
            y: 0.42
          }}>
            Void
          </StampButton>
        </div>
      </Paper>
    </StampSurface>;
  };
});
export default Example;
