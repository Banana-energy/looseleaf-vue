// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed, shallowRef } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
export const meta = {
  title: "Ticks and dots" as const,
  description: "Checkbox rows are a pencil box with a felt tick written over it; radio rows are a ring with a bold dot. Both are controlled here, and the rows keep the menu open so you can tick several." as const,
  layout: "center" as const,
  height: 420
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  const status = shallowRef(initialState(true));
  const setStatus = stateSetter(status);
  const activity = shallowRef(initialState(false));
  const setActivity = stateSetter(activity);
  const panel = shallowRef(initialState(true));
  const setPanel = stateSetter(panel);
  const position = shallowRef(initialState("bottom"));
  const setPosition = stateSetter(position);
  return () => {
    return <div class="flex flex-col items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Icon name="sliders-horizontal" /> View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56" seed="view">
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked={status.value} onCheckedChange={setStatus} onSelect={e => e.preventDefault()}>
            Status bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={activity.value} onCheckedChange={setActivity} onSelect={e => e.preventDefault()} disabled>
            Activity bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={panel.value} onCheckedChange={setPanel} onSelect={e => e.preventDefault()}>
            Panel
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Panel position</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={position.value} onValueChange={setPosition}>
            <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <p class="text-sm text-muted-foreground">
        {[status.value && "status bar", panel.value && "panel"].filter(Boolean).join(" + ") || "nothing"} · panel {position.value}
      </p>
    </div>;
  };
});
export default Example;
