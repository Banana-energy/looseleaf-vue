// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
export const meta = {
  title: "Sizes, icons and tones" as const,
  description: "Three heights, an icon slot in front of the label (the icon keeps its own 14 px drawing), and the stationery accents for the marker fill." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-col gap-5">
      <div class="flex flex-wrap items-center gap-4">
        <Badge size="sm">Small</Badge>
        <Badge>Default</Badge>
        <Badge size="lg">Large</Badge>
      </div>
      <div class="flex flex-wrap items-center gap-4">
        <Badge variant="secondary">
          <Icon name="badge-check" />
          Verified
        </Badge>
        <Badge variant="destructive">
          <Icon name="triangle-alert" />
          Overdue
        </Badge>
        <Badge variant="outline">
          <Icon name="bell" />
          Following
        </Badge>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <Badge tone="hi">hi</Badge>
        <Badge tone="tangerine">tangerine</Badge>
        <Badge tone="lemon">lemon</Badge>
        <Badge tone="grass">grass</Badge>
        <Badge tone="teal">teal</Badge>
        <Badge tone="sky">sky</Badge>
        <Badge tone="bubblegum">bubblegum</Badge>
      </div>
    </div>;
  };
});
export default Example;
