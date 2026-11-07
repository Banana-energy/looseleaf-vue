// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Squiggle } from "@/components/ui/squiggle";
export const meta = {
  title: "Six kinds, and vertical" as const,
  description: "Wave, zig-zag, loops, scallops, dashes and dots; then the same patterns standing up." as const,
  layout: "stack" as const
};
const KINDS = ["wavy", "zigzag", "loops", "scallops", "dashes", "dots"] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid max-w-lg gap-4">
      {KINDS.map((k, i) => <div key={k} class="grid grid-cols-[5.5rem_1fr] items-center gap-3 text-sm text-muted-foreground">
          {k}
          <Squiggle kind={k} tone={i % 2 ? "blue" as const : "ink" as const} />
        </div>)}
      <div class="flex h-28 gap-6">
        {KINDS.map(k => <Squiggle key={k} kind={k} orientation="vertical" tone="pencil" />)}
      </div>
    </div>;
  };
});
export default Example;
