// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export const meta = {
  title: "Dimmed with a disabled control" as const,
  description: "A label after a peer control fades to graphite when the control is disabled: checkbox as a peer, a drawn Input marked peer, or a group with data-disabled." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid w-full max-w-sm gap-5">
      <div class="flex items-center gap-2">
        <Checkbox id="p1" disabled />
        <Label for="p1">Sync over cellular (off by admin)</Label>
      </div>
      <div class="grid gap-2">
        <Input id="p2" class="peer order-2" disabled defaultValue="locked@example.com" />
        <Label for="p2" class="order-1">
          Account email
        </Label>
      </div>
      <div class="group grid gap-2" data-disabled="true">
        <Label>Whole group is disabled</Label>
        <Input aria-label="grouped" disabled placeholder="Nothing to type here" />
      </div>
    </div>;
  };
});
export default Example;
