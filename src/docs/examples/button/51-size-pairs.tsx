// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
export const meta = {
  title: "Text and icon buttons, size by size" as const,
  description: "Each height comes with its square twin: `sm` and `icon-sm` (32 px), default and `icon` (36 px), `lg` and `icon-lg` (40 px), and our extra `xs` pair at 24 px. Put them side by side and the labels and glyphs line up on one baseline." as const,
  layout: "stack" as const
};
const pairs = [{
  label: "Extra small" as const,
  size: "xs" as const,
  icon: "icon-xs" as const,
  px: 12
}, {
  label: "Small" as const,
  size: "sm" as const,
  icon: "icon-sm" as const,
  px: 16
}, {
  label: "Default" as const,
  size: "default" as const,
  icon: "icon" as const,
  px: 16
}, {
  label: "Large" as const,
  size: "lg" as const,
  icon: "icon-lg" as const,
  px: 20
}] as const;
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-col items-start gap-8 sm:flex-row sm:flex-wrap sm:gap-x-10">
      {pairs.map(p => <div key={p.size} class="flex items-start gap-4">
          <Button variant="outline" size={p.size}>
            {p.label}
          </Button>
          <Button variant="outline" size={p.icon} aria-label={`Send, ${p.label.toLowerCase()}`}>
            <Icon name="arrow-up-right" size={p.px} />
          </Button>
        </div>)}
    </div>;
  };
});
export default Example;
