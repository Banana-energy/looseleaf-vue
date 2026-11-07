// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Icon } from "@/components/ui/icon";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
export const meta = {
  title: "Joined, separate, vertical" as const,
  description: "Outline items that touch share one box. Give them spacing and each keeps its own. Borderless items only whisper their seams. Vertical groups stack and use the up and down arrows." as const,
  layout: "stack" as const
};
const items = <>
    <ToggleGroupItem value="list" aria-label="List">
      <Icon name="list" />
    </ToggleGroupItem>
    <ToggleGroupItem value="menu" aria-label="Menu">
      <Icon name="menu" />
    </ToggleGroupItem>
    <ToggleGroupItem value="search" aria-label="Search">
      <Icon name="search" />
    </ToggleGroupItem>
  </>;
const Case = defineUi<{
  label: string;
  children: UI.VueNode;
}>("Case", ["label"], (_props, {
  slots: _slots
}) => {
  const label = computed(() => _props["label"]);
  const children = renderValue(() => readSlot(_slots.default));
  return () => {
    return <div class="grid justify-items-start gap-2">
      {readSlot(_slots.default)}
      <span class="text-sm text-muted-foreground">{label.value}</span>
    </div>;
  };
});
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="flex flex-wrap items-start gap-x-10 gap-y-6">
      <Case label="joined">
        <ToggleGroup type="single" variant="outline" defaultValue="menu" aria-label="Joined outline">
          {items}
        </ToggleGroup>
      </Case>
      <Case label="spacing 2">
        <ToggleGroup type="single" variant="outline" spacing={2} defaultValue="menu" aria-label="Separate outline">
          {items}
        </ToggleGroup>
      </Case>
      <Case label="borderless">
        <ToggleGroup type="single" defaultValue="menu" aria-label="Borderless">
          {items}
        </ToggleGroup>
      </Case>
      <Case label="marker, sm">
        <ToggleGroup type="single" variant="outline" tone="marker" size="sm" defaultValue="menu" aria-label="Marker, small">
          {items}
        </ToggleGroup>
      </Case>
      <Case label="vertical">
        <ToggleGroup type="single" variant="outline" orientation="vertical" defaultValue="menu" aria-label="Vertical">
          {items}
        </ToggleGroup>
      </Case>
      <Case label="disabled">
        <ToggleGroup type="single" variant="outline" disabled defaultValue="menu" aria-label="Disabled">
          {items}
        </ToggleGroup>
      </Case>
    </div>;
  };
});
export default Example;
