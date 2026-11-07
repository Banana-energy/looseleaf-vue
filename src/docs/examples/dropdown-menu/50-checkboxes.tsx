// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
export const meta = {
  title: "Checkboxes" as const,
  description: "shadcn's `dropdown-menu-checkboxes`: three controlled rows, the middle one disabled. The state is a boolean (or \"indeterminate\") that you own; the menu stays open while you tick." as const,
  layout: "center" as const,
  height: 300
};
type Checked = boolean | "indeterminate";
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const showStatusBar = shallowRef<Checked>(initialState(true));
  const setShowStatusBar = stateSetter(showStatusBar);
  const showActivityBar = shallowRef<Checked>(initialState(false));
  const setShowActivityBar = stateSetter(showActivityBar);
  const showPanel = shallowRef<Checked>(initialState(false));
  const setShowPanel = stateSetter(showPanel);
  return () => {
    return <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={showStatusBar.value} onCheckedChange={setShowStatusBar}>
          Status Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={showActivityBar.value} onCheckedChange={setShowActivityBar} disabled>
          Activity Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={showPanel.value} onCheckedChange={setShowPanel}>
          Panel
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>;
  };
});
export default Example;
