// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Paper } from "@/components/ui/paper";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
export const meta = {
  title: "Vertical, without a tab" as const,
  description: "`orientation=\"vertical\"` stacks the panels and turns the seam; without `withHandle` the seam is only stitches. The middle panel has a minimum and a maximum, so the seams stop where the limits are." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <Paper stock="slip" tilt={false} seed="vertical" class="w-full max-w-sm">
      <ResizablePanelGroup orientation="vertical" class="h-72">
        <ResizablePanel defaultSize="20%" minSize="10%">
          <div class="flex h-full items-center px-4 font-bold">Header</div>
        </ResizablePanel>
        <ResizableHandle aria-label="Resize the header" />
        <ResizablePanel defaultSize="55%" minSize="30%" maxSize="70%">
          <div class="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">The middle keeps between 30% and 70%.</div>
        </ResizablePanel>
        <ResizableHandle aria-label="Resize the footer" />
        <ResizablePanel defaultSize="25%" minSize="10%">
          <div class="flex h-full items-center px-4 text-sm text-muted-foreground">Footer</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Paper>;
  };
});
export default Example;
