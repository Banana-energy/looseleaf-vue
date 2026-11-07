// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
export const meta = {
  title: "Icon buttons" as const,
  description: "Square buttons for one glyph, in the four icon sizes. Give each an aria-label; the drawing is decorative. The last one is a real toggle that swaps its icon." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const shown = shallowRef(initialState(false));
  const setShown = stateSetter(shown);
  return () => {
    return <div class="flex flex-wrap items-center gap-4">
      <Button size="icon-xs" variant="outline" aria-label="Close">
        <Icon name="x" size={12} />
      </Button>
      <Button size="icon-sm" variant="secondary" aria-label="Notifications">
        <Icon name="bell" />
      </Button>
      <Button size="icon" aria-label="Add">
        <Icon name="plus" />
      </Button>
      <Button size="icon-lg" variant="outline" aria-label="Settings">
        <Icon name="settings" size={20} />
      </Button>
      <Button size="icon" variant="ghost" aria-label="Delete">
        <Icon name="trash" />
      </Button>
      <Button size="icon" variant="outline" aria-label={shown.value ? "Hide password" as const : "Show password" as const} aria-pressed={shown.value} onClick={() => setShown(s => !s)}>
        <Icon name={shown.value ? "eye-off" as const : "eye" as const} />
      </Button>
    </div>;
  };
});
export default Example;
