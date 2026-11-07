// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
export const meta = {
  title: "With an icon" as const,
  description: "className goes to the frame, but padding goes to the input: pl-9 makes room for the pencilled magnifier exactly as it would on a plain shadcn input." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="relative w-full max-w-sm">
      <Icon name="search" size={16} class="absolute start-3 top-1/2 z-10 -translate-y-1/2 text-ink-muted" />
      <Input type="search" aria-label="Search the notebook" placeholder="Search the notebook" class="ps-9" />
    </div>;
  };
});
export default Example;
