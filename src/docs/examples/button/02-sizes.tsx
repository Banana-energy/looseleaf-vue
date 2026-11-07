// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
export const meta = {
  title: "Sizes" as const,
  description: "The shadcn heights (24, 32, 36, 40) and the square icon buttons. Icon buttons need an aria-label." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-col gap-5">
      <div class="flex flex-wrap items-center gap-4">
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
      </div>
      <div class="flex flex-wrap items-center gap-4">
        <Button size="icon-xs" aria-label="Add">
          +
        </Button>
        <Button size="icon-sm" variant="outline" aria-label="Add">
          +
        </Button>
        <Button size="icon" variant="secondary" aria-label="Add">
          +
        </Button>
        <Button size="icon-lg" variant="ghost" aria-label="Add">
          +
        </Button>
      </div>
    </div>;
  };
});
export default Example;
