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
  title: "Spacing" as const,
  description: "Official `toggle-group-spacing`: `spacing={2}` pulls the items apart, so each keeps a box of its own. shadcn fills the icon with a color when an item is on; here each item keeps its highlighter body and writes its icon in that color instead (a drawn line has no fill to change)." as const,
  layout: "center" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <ToggleGroup type="multiple" variant="outline" spacing={2} size="sm" aria-label="Vueions">
      <ToggleGroupItem value="star" aria-label="Toggle star" class="data-[state=on]:[&_svg:not(.absolute)]:text-orange-text">
        <Icon name="star" />
        Star
      </ToggleGroupItem>
      <ToggleGroupItem value="heart" aria-label="Toggle heart" class="data-[state=on]:[&_svg:not(.absolute)]:text-red">
        <Icon name="heart" />
        Heart
      </ToggleGroupItem>
      <ToggleGroupItem value="bookmark" aria-label="Toggle bookmark" class="data-[state=on]:[&_svg:not(.absolute)]:text-ink-you">
        <Icon name="bookmark" />
        Bookmark
      </ToggleGroupItem>
    </ToggleGroup>;
  };
});
export default Example;
