// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
export const meta = {
  title: "Required" as const,
  description: "The star is drawn, not typed, and it is decorative: required on the control is what a screen reader hears." as const,
  layout: "stack" as const
};
const Example = defineUi<{}>("Example", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <div class="grid w-full max-w-sm gap-4">
      <div class="grid gap-2">
        <Label for="req-name" required>
          Full name
        </Label>
        <Input id="req-name" required placeholder="Ada Lovelace" />
      </div>
      <div class="grid gap-2">
        <Label for="req-note">
          Note <span class="font-normal text-ink-muted">(optional)</span>
        </Label>
        <Textarea id="req-note" />
      </div>
    </div>;
  };
});
export default Example;
