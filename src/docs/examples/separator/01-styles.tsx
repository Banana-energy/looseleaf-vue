// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Separator } from "@/components/ui/separator";
export const meta = {
  title: "Seven ways to draw a line" as const,
  description: "Pencil is the default. The others are for when a divider should say something: ledger dashes, a squiggle, dots, kraft tape, a running stitch, a torn edge." as const,
  layout: "stack" as const
};
const variants = ["pencil", "dashed", "wavy", "dotted", "tape", "stitched", "torn"] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex w-full max-w-md flex-col gap-7">
      {variants.map(v => <div key={v} class="flex flex-col gap-2">
          <span class="text-sm text-muted-foreground">{v}</span>
          <Separator variant={v} seed={v} />
        </div>)}
    </div>;
  };
});
export default Example;
