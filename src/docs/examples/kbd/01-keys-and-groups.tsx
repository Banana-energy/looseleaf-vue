// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
export const meta = {
  title: "Keys and shortcuts" as const,
  description: "Single keys inline, and KbdGroup for a combination. Each key is its own drawing, so no two caps are the same." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-col gap-5">
      <p class="text-base">
        Press <Kbd>Esc</Kbd> to close, <Kbd>Tab</Kbd> to move on, or <Kbd>Enter</Kbd> to go.
      </p>
      <div class="flex flex-wrap items-center gap-x-8 gap-y-3">
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <span class="text-sm text-muted-foreground">+</span>
          <Kbd>K</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <span class="text-sm text-muted-foreground">+</span>
          <Kbd>Shift</Kbd>
          <span class="text-sm text-muted-foreground">+</span>
          <Kbd>P</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>Alt</Kbd>
          <span class="text-sm text-muted-foreground">+</span>
          <Kbd>F4</Kbd>
        </KbdGroup>
        <Kbd>Space</Kbd>
      </div>
    </div>;
  };
});
export default Example;
